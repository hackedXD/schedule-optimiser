/**
 * Availability-first planning.
 *
 * Registration happens section by section, and sections of a popular course fill before your slot. So for
 * courses you mark hard to get, this does not pick a section: it picks sections for the easy courses such that
 * each hard course keeps as many conflict-free (lecture, section) options open as possible, hardest first.
 *
 * A plan = fixed picks for easy courses + an open option set per hard course + a preferred concrete schedule
 * (used for the ordinary criteria once availability has had its say).
 */
import type { Catalog, Offering, Request, Ratings, Schedule, Slot } from './types.ts'
import { choicesFor, courseSets, slotsConflict, type Pairings } from './solve.ts'

/** 0 = easy (committed in the plan), 1 = hard, 2 = very hard. Higher levels are protected first. */
export type Difficulty = 0 | 1 | 2
export type DifficultyMap = Record<string, Difficulty | undefined>

/** Seat state for an offering, from an SIO import. */
export interface SeatInfo { state: 'available' | 'waitlist' | 'closed' | 'unknown'; waitlist?: number | null; max?: number | null }
export type SeatLookup = (offeringId: string) => SeatInfo | undefined

/** Weight of one open option when counting chances. */
export function seatWeight(info: SeatInfo | undefined): number {
  switch (info?.state) {
    case 'available': return 1
    case 'waitlist': return 0.5
    case 'closed': return 0.15
    default: return 1
  }
}

/** One registrable way to take a hard course: the exact offerings, their slots, and the seat weight. */
export interface OpenOption {
  offerings: Offering[]
  slots: Slot[]
  weight: number
  seat: SeatInfo | undefined
}

export interface OpenCourse {
  course: string
  /** Every option that fits the fixed picks (union over higher tiers' choices). */
  options: OpenOption[]
  /** Weighted options that stay open whatever you end up with in harder courses (the maximin). */
  guaranteed: number
  /** Weighted options open in the best case. */
  best: number
  /** Total options the course offers at all (after filters), for "6 of 14". */
  total: number
}

export interface Plan {
  id: string
  courses: string[]
  fixed: Slot[]
  open: OpenCourse[]
  /** Fixed picks plus one preferred option per hard course, for the ordinary criteria. */
  preferred: Schedule
  /** Lexicographic availability vector, one entry per hard course in difficulty order. */
  vector: number[]
}

export interface PlanResult {
  plans: Plan[]
  hardOrder: string[]
  /** Hard courses with no option at all after filters. */
  unplaceable: string[]
  truncated: boolean
}

const PLAN_CAP = 20000
const TUPLE_CAP = 60000

/** Expand a course's slot tuples into registrable options, one per concrete offering combination. */
function optionsOf(catalog: Catalog, code: string, req: Request, ratings: Ratings, pairings: Pairings, seats?: SeatLookup): OpenOption[] {
  const course = catalog.courses[code]
  if (!course) return []
  const { choices } = choicesFor(course, req, ratings, pairings[code])
  const out: OpenOption[] = []
  for (const tuple of choices) {
    // Each slot groups interchangeable offerings; every combination is a distinct seat to try for.
    const expand = (i: number, acc: Offering[]) => {
      if (i === tuple.length) {
        const sec = acc.find((o) => o.kind === 'section') ?? acc[0]
        const seat = seats?.(sec.id)
        out.push({ offerings: [...acc], slots: tuple, weight: seatWeight(seat), seat })
        return
      }
      for (const o of tuple[i].offerings) expand(i + 1, [...acc, o])
    }
    expand(0, [])
  }
  return out
}

function fits(option: OpenOption, taken: Slot[]): boolean {
  return option.slots.every((s) => taken.every((t) => !slotsConflict(s, t)))
}

function sumW(opts: OpenOption[]): number { return opts.reduce((n, o) => n + o.weight, 0) }

/**
 * For hard courses in order, compute the open set and the guaranteed count given fixed picks.
 * Tier k's guaranteed count is the minimum, over every compatible choice of tiers 1..k-1, of the weight of
 * tier k's options that still fit.
 */
function openSets(hard: string[], all: Record<string, OpenOption[]>, fixed: Slot[]): { open: OpenCourse[]; ok: boolean; truncated: boolean } {
  const open: OpenCourse[] = []
  let truncated = false
  const firstFits = (all[hard[0]] ?? []).filter((o) => fits(o, fixed))
  // Tier 1 is simple.
  if (hard.length === 0) return { open, ok: true, truncated }
  const w1 = sumW(firstFits)
  open.push({ course: hard[0], options: firstFits, guaranteed: w1, best: w1, total: all[hard[0]].length })
  if (firstFits.length === 0) return { open, ok: false, truncated }
  // Later tiers: walk every compatible tuple of the earlier tiers' open options.
  for (let k = 1; k < hard.length; k++) {
    const code = hard[k]
    const candidates = all[code].filter((o) => fits(o, fixed))
    let guaranteed = Infinity
    let best = 0
    const union = new Set<OpenOption>()
    let tuples = 0
    const walk = (tier: number, taken: Slot[]) => {
      if (tier === k) {
        tuples++
        const here = candidates.filter((o) => fits(o, taken))
        const w = sumW(here)
        guaranteed = Math.min(guaranteed, w)
        best = Math.max(best, w)
        for (const o of here) union.add(o)
        return
      }
      for (const o of open[tier].options) {
        if (tuples > TUPLE_CAP) { truncated = true; return }
        if (!fits(o, taken)) continue
        walk(tier + 1, [...taken, ...o.slots])
      }
    }
    walk(0, fixed)
    if (!Number.isFinite(guaranteed)) guaranteed = 0
    open.push({ course: code, options: [...union], guaranteed, best, total: all[code].length })
    if (union.size === 0) return { open, ok: false, truncated }
  }
  return { open, ok: true, truncated }
}

/** Hard courses ordered hardest first; ties keep request order. */
export function hardOrderOf(codes: string[], difficulty: DifficultyMap): string[] {
  return codes.filter((c) => (difficulty[c] ?? 0) > 0).sort((a, b) => (difficulty[b] ?? 0) - (difficulty[a] ?? 0))
}

export function planAvailability(catalog: Catalog, req: Request, ratings: Ratings, pairings: Pairings, difficulty: DifficultyMap, seats?: SeatLookup): PlanResult {
  const plans: Plan[] = []
  const unplaceable = new Set<string>()
  let truncated = false
  const allCodes = [...new Set([...req.required, ...req.groups.flatMap((g) => g.options)])]
  const hardOrder = hardOrderOf(allCodes, difficulty)
  const optionCache: Record<string, OpenOption[]> = {}
  for (const c of hardOrder) {
    optionCache[c] = optionsOf(catalog, c, req, ratings, pairings, seats)
    if (catalog.courses[c] && optionCache[c].length === 0) unplaceable.add(c)
  }

  for (const set of courseSets(req)) {
    const easy = set.filter((c) => !(difficulty[c] ?? 0))
    const hard = hardOrder.filter((c) => set.includes(c))
    if (hard.some((c) => !catalog.courses[c] || optionCache[c].length === 0)) continue
    // Enumerate easy picks (conflict-free among themselves) with the ordinary solver machinery.
    const easyChoices = easy.map((c) => catalog.courses[c] ? choicesFor(catalog.courses[c], req, ratings, pairings[c]).choices : [])
    if (easyChoices.some((ch) => ch.length === 0)) continue
    const dims = easyChoices.slice().sort((a, b) => a.length - b.length)
    const chosen: Slot[] = []
    const dfs = (i: number): boolean => {
      if (i === dims.length) {
        if (plans.length >= PLAN_CAP) { truncated = true; return false }
        const fixed = [...chosen]
        const { open, ok, truncated: t } = openSets(hard, optionCache, fixed)
        truncated ||= t
        if (!ok) return true
        // Preferred concrete schedule: for each hard course the heaviest option that fits what came before.
        const taken = [...fixed]
        const pref: Slot[] = [...fixed]
        for (const oc of open) {
          const pick = oc.options.filter((o) => fits(o, taken)).sort((a, b) => b.weight - a.weight)[0]
          if (!pick) return true
          taken.push(...pick.slots); pref.push(...pick.slots)
        }
        const preferred: Schedule = { id: pref.map((s) => s.offerings[0].id).sort().join('+'), courses: set, slots: pref }
        plans.push({
          id: `${fixed.map((s) => s.offerings[0].id).sort().join('+')}|${hard.join(',')}`,
          courses: set, fixed, open, preferred,
          vector: open.map((o) => Math.round(o.guaranteed * 100) / 100),
        })
        return true
      }
      for (const tuple of dims[i]) {
        if (tuple.some((slot) => chosen.some((c) => slotsConflict(c, slot)))) continue
        chosen.push(...tuple)
        const ok = dfs(i + 1)
        chosen.length -= tuple.length
        if (!ok) return false
      }
      return true
    }
    if (!dfs(0)) break
  }
  return { plans, hardOrder, unplaceable: [...unplaceable], truncated }
}

/** Lexicographic compare of availability vectors, larger first; equal-length assumed within one course set. */
export function compareVectors(a: number[], b: number[]): number {
  const n = Math.max(a.length, b.length)
  for (let i = 0; i < n; i++) {
    const d = (b[i] ?? 0) - (a[i] ?? 0)
    if (Math.abs(d) > 1e-9) return d
  }
  return 0
}
