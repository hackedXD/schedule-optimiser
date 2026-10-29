import type { Criterion, CriterionId, Day, RankContext, RankedSchedule, Schedule, Scores, Slot } from './types.ts'
import { DAY_ORDER } from './types.ts'
import { walkingMetres } from '../campus.ts'

export const CRITERIA: Criterion[] = [
  { id: 'fce', name: 'FCE rating', short: 'FCE', direction: 'Higher manual ratings first.', tolerance: 0.25, unit: 'rating' },
  { id: 'start', name: 'Start time', short: 'START', direction: 'Latest earliest-start first, then the average.', tolerance: 15, unit: 'minutes' },
  { id: 'gap', name: 'Time between classes', short: 'GAP', direction: 'Longer shortest break first.', tolerance: 10, unit: 'minutes' },
  { id: 'end', name: 'End time', short: 'END', direction: 'Earliest latest-end first, then the average.', tolerance: 15, unit: 'minutes' },
  { id: 'path', name: 'Walking', short: 'WALK', direction: 'Less estimated walking per week first.', tolerance: 250, unit: 'metres' },
]
export const DEFAULT_ORDER: CriterionId[] = ['fce', 'start', 'gap', 'end', 'path']

export interface DayBlock { day: Day; start: number; end: number; slot: Slot }

/** Every (day, meeting) block in a schedule, sorted by day then start. */
export function dayBlocks(s: Schedule): DayBlock[] {
  const out: DayBlock[] = []
  for (const slot of s.slots) for (const m of slot.meetings) for (const d of m.days) out.push({ day: d, start: m.start, end: m.end, slot })
  return out.sort((a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day) || a.start - b.start)
}

export function byDay(s: Schedule): Map<Day, DayBlock[]> {
  const m = new Map<Day, DayBlock[]>()
  for (const b of dayBlocks(s)) { if (!m.has(b.day)) m.set(b.day, []); m.get(b.day)!.push(b) }
  return m
}

function mean(xs: number[]): number { return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0 }

export function score(s: Schedule, ctx: RankContext, neutral: number | null): Scores {
  const days = byDay(s)
  const starts: number[] = []
  const ends: number[] = []
  const gaps: number[] = []
  let path = 0
  let pathKnown = false
  for (const blocks of days.values()) {
    starts.push(blocks[0].start)
    ends.push(blocks[blocks.length - 1].end)
    for (let i = 1; i < blocks.length; i++) gaps.push(Math.max(0, blocks[i].start - blocks[i - 1].end))
    // Walking: dorm -> first class -> ... -> last class -> dorm, over buildings we know.
    const stops = blocks.map((b) => ctx.buildingOf(b.slot.course)).filter((x): x is string => !!x)
    const route = ctx.dorm ? [ctx.dorm, ...stops, ctx.dorm] : stops
    for (let i = 1; i < route.length; i++) {
      const m = walkingMetres(route[i - 1], route[i])
      if (m !== null) { path += m; pathKnown = true }
    }
  }
  const rated: number[] = []
  let ratedCount = 0
  for (const slot of s.slots) {
    const o = slot.offerings[0]
    const r = ctx.ratings[o.id] ?? ctx.ratings[o.course]
    if (r !== undefined) { rated.push(r); ratedCount++ }
    else if (neutral !== null) rated.push(neutral)
  }
  return {
    fce: ratedCount ? mean(rated) : null,
    rated: ratedCount,
    slots: s.slots.length,
    start: starts.length ? Math.min(...starts) : 0,
    startMean: mean(starts),
    gap: gaps.length ? Math.min(...gaps) : Infinity,
    end: ends.length ? Math.max(...ends) : 0,
    endMean: mean(ends),
    path: pathKnown ? path : null,
  }
}

/** Larger is better for every criterion after this transform. */
export function orientedValue(id: CriterionId, sc: Scores): number {
  switch (id) {
    case 'fce': return sc.fce ?? 0
    case 'start': return sc.start
    case 'gap': return sc.gap === Infinity ? 24 * 60 : sc.gap
    case 'end': return -sc.end
    case 'path': return -(sc.path ?? 0)
  }
}

/** Secondary measure for a criterion, compared only when the primary ties within tolerance. */
function secondaryValue(id: CriterionId, sc: Scores): number | null {
  switch (id) {
    case 'start': return sc.startMean
    case 'end': return -sc.endMean
    default: return null
  }
}

function band(id: CriterionId, sc: Scores): number {
  const c = CRITERIA.find((x) => x.id === id)!
  return Math.round(orientedValue(id, sc) / c.tolerance)
}

function bandSecondary(id: CriterionId, sc: Scores): number | null {
  const v = secondaryValue(id, sc)
  if (v === null) return null
  return Math.round(v / CRITERIA.find((x) => x.id === id)!.tolerance)
}

/**
 * Rank by strict priority: compare criteria in `order`, each quantised to its tolerance band
 * so near-ties fall through to the next criterion. Start and end judge the worst day first (earliest
 * start, latest end) and their weekly mean second. Final tie-break on raw values, then id.
 */
export function rank(schedules: Schedule[], order: CriterionId[], ctx: RankContext): RankedSchedule[] {
  const given = Object.values(ctx.ratings)
  const neutral = given.length ? mean(given) : null
  const scored = schedules.map((s) => ({ ...s, scores: score(s, ctx, neutral), rank: 0 }))
  scored.sort((a, b) => {
    for (const id of order) {
      const d = band(id, b.scores) - band(id, a.scores)
      if (d !== 0) return d
      const sa = bandSecondary(id, a.scores), sb = bandSecondary(id, b.scores)
      if (sa !== null && sb !== null && sb - sa !== 0) return sb - sa
    }
    for (const id of order) {
      const d = orientedValue(id, b.scores) - orientedValue(id, a.scores)
      if (d !== 0) return d
      const sa = secondaryValue(id, a.scores), sb = secondaryValue(id, b.scores)
      if (sa !== null && sb !== null && sb - sa !== 0) return sb - sa
    }
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0
  })
  scored.forEach((s, i) => (s.rank = i + 1))
  return scored
}

/** Sum of option positions in ranked groups: 0 means every ranked group got its first choice. */
export function preferenceCost(s: { courses: string[] }, groups: { options: string[]; ranked?: boolean }[]): number {
  let cost = 0
  for (const g of groups) {
    if (!g.ranked) continue
    for (const c of s.courses) { const i = g.options.indexOf(c); if (i >= 0) cost += i }
  }
  return cost
}

/**
 * Ranked groups are hard tiers: keep only the schedules whose ranked-group choices are the best achievable.
 * A lower-ranked option is used only when no conflict-free schedule exists with a higher one.
 */
export function applyRankedGroups(schedules: Schedule[], groups: { options: string[]; ranked?: boolean }[]): { kept: Schedule[]; dropped: number; cost: number } {
  if (!groups.some((g) => g.ranked) || schedules.length === 0) return { kept: schedules, dropped: 0, cost: 0 }
  const costs = schedules.map((s) => preferenceCost(s, groups))
  const best = Math.min(...costs)
  const kept = schedules.filter((_, i) => costs[i] === best)
  return { kept, dropped: schedules.length - kept.length, cost: best }
}
