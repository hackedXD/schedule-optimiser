import type { Catalog, Course, Meeting, Offering, Ratings, Request, Schedule, Slot } from './types.ts'

export interface SolveResult {
  schedules: Schedule[]
  /** Courses that were asked for but are not in the catalog. */
  missing: string[]
  /** Courses with no placeable offering after filters. */
  unplaceable: string[]
  /** Number of complete combinations examined (before conflict pruning counts). */
  explored: number
  /** True when the result cap stopped enumeration. */
  truncated: boolean
  /** Per course: how many slots the solver had to choose from. */
  slotCounts: Record<string, { lectures: number; sections: number }>
}

export const RESULT_CAP = 20000

function ratingFor(o: Offering, ratings: Ratings): number | undefined {
  return ratings[o.id] ?? ratings[o.course]
}

function meetingsKey(ms: Meeting[]): string {
  return ms
    .map((m) => `${m.days.join('')}@${m.start}-${m.end}`)
    .sort()
    .join('|')
}

function usable(o: Offering, req: Request): boolean {
  if (o.tba || o.meetings.length === 0) return false
  if (req.excluded.includes(o.id)) return false
  if (!req.includeMini && o.mini !== 0) return false
  if (req.locations.length && !o.meetings.every((m) => req.locations.includes(m.location))) return false
  return true
}

/** Collapse interchangeable offerings (same meetings, same mini, same rating) into slots. */
export function slotsFor(course: Course, req: Request, ratings: Ratings): { lectures: Slot[]; sections: Slot[] } {
  const pinnedHere = req.pinned.filter((id) => id.startsWith(`${course.code}:`))
  const byKind = (kind: Offering['kind']) => {
    let offs = course.offerings.filter((o) => o.kind === kind && usable(o, req))
    const pinnedOfKind = pinnedHere.filter((id) => offs.some((o) => o.id === id))
    if (pinnedOfKind.length) offs = offs.filter((o) => pinnedOfKind.includes(o.id))
    const groups = new Map<string, Slot>()
    for (const o of offs) {
      const key = `${o.mini}#${meetingsKey(o.meetings)}#${ratingFor(o, ratings) ?? ''}`
      const g = groups.get(key)
      if (g) g.offerings.push(o)
      else groups.set(key, { course: course.code, kind, offerings: [o], meetings: o.meetings, mini: o.mini })
    }
    return [...groups.values()]
  }
  return { lectures: byKind('lecture'), sections: byKind('section') }
}

/** Two offerings conflict when any meeting shares a day and overlaps in time, unless they are opposite minis. */
export function slotsConflict(a: Slot, b: Slot): boolean {
  if (a.mini !== 0 && b.mini !== 0 && a.mini !== b.mini) return false
  for (const ma of a.meetings) for (const mb of b.meetings) {
    if (ma.start >= mb.end || mb.start >= ma.end) continue
    for (const d of ma.days) if (mb.days.includes(d)) return true
  }
  return false
}

function* combinations<T>(items: T[], k: number, start = 0, acc: T[] = []): Generator<T[]> {
  if (acc.length === k) { yield [...acc]; return }
  for (let i = start; i <= items.length - (k - acc.length); i++) {
    acc.push(items[i])
    yield* combinations(items, k, i + 1, acc)
    acc.pop()
  }
}

/** All distinct course sets implied by required + groups. */
export function courseSets(req: Request): string[][] {
  let sets: string[][] = [[...new Set(req.required)]]
  for (const g of req.groups) {
    const opts = [...new Set(g.options)]
    const pick = Math.min(Math.max(0, g.pick), opts.length)
    const next: string[][] = []
    for (const base of sets) for (const combo of combinations(opts, pick)) next.push([...new Set([...base, ...combo])])
    sets = next
  }
  const seen = new Set<string>()
  return sets.filter((s) => { const k = [...s].sort().join(','); if (seen.has(k)) return false; seen.add(k); return true })
}

export function solve(catalog: Catalog, req: Request, ratings: Ratings): SolveResult {
  const schedules: Schedule[] = []
  const missing = new Set<string>()
  const unplaceable = new Set<string>()
  const slotCounts: Record<string, { lectures: number; sections: number }> = {}
  let explored = 0
  let truncated = false

  const allCodes = new Set([...req.required, ...req.groups.flatMap((g) => g.options)])
  const perCourse = new Map<string, Slot[][]>() // course -> list of independent choice dimensions
  for (const code of allCodes) {
    const course = catalog.courses[code]
    if (!course) { missing.add(code); continue }
    const { lectures, sections } = slotsFor(course, req, ratings)
    slotCounts[code] = { lectures: lectures.length, sections: sections.length }
    const dims: Slot[][] = []
    if (lectures.length) dims.push(lectures)
    if (sections.length) dims.push(sections)
    if (dims.length === 0) { unplaceable.add(code); continue }
    perCourse.set(code, dims)
  }

  for (const set of courseSets(req)) {
    if (set.some((c) => !perCourse.has(c))) continue
    // Order dimensions by fewest options first for faster pruning.
    const dims = set.flatMap((c) => perCourse.get(c)!).sort((a, b) => a.length - b.length)
    const chosen: Slot[] = []
    const dfs = (i: number): boolean => {
      if (i === dims.length) {
        explored++
        if (schedules.length >= RESULT_CAP) { truncated = true; return false }
        const slots = [...chosen]
        schedules.push({ id: slots.map((s) => s.offerings[0].id).sort().join('+'), courses: set, slots })
        return true
      }
      for (const slot of dims[i]) {
        if (chosen.some((c) => slotsConflict(c, slot))) continue
        chosen.push(slot)
        const ok = dfs(i + 1)
        chosen.pop()
        if (!ok) return false
      }
      return true
    }
    if (!dfs(0)) break
  }

  return { schedules, missing: [...missing], unplaceable: [...unplaceable], explored, truncated, slotCounts }
}

/** Pairs of courses that can never coexist given the filters (used to explain an empty result). */
export function conflictingPairs(catalog: Catalog, codes: string[], req: Request, ratings: Ratings): [string, string][] {
  const dims = new Map<string, Slot[][]>()
  for (const c of codes) {
    const course = catalog.courses[c]
    if (!course) continue
    const { lectures, sections } = slotsFor(course, req, ratings)
    const d: Slot[][] = []
    if (lectures.length) d.push(lectures)
    if (sections.length) d.push(sections)
    if (d.length) dims.set(c, d)
  }
  const out: [string, string][] = []
  const list = [...dims.keys()]
  for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
    const a = dims.get(list[i])!, b = dims.get(list[j])!
    const choices = (d: Slot[][]): Slot[][] => d.reduce<Slot[][]>((acc, dim) => acc.flatMap((p) => dim.map((s) => [...p, s])), [[]])
    const ca = choices(a).filter((p) => p.every((x, k) => p.slice(k + 1).every((y) => !slotsConflict(x, y))))
    const cb = choices(b).filter((p) => p.every((x, k) => p.slice(k + 1).every((y) => !slotsConflict(x, y))))
    const ok = ca.some((pa) => cb.some((pb) => pa.every((x) => pb.every((y) => !slotsConflict(x, y)))))
    if (!ok) out.push([list[i], list[j]])
  }
  return out
}
