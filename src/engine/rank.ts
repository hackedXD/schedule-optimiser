import type { Criterion, CriterionId, Day, RankContext, RankedSchedule, Schedule, Scores, Slot } from './types.ts'
import { DAY_ORDER } from './types.ts'
import { walkingMetres } from '../campus.ts'

export const CRITERIA: Criterion[] = [
  { id: 'fce', name: 'FCE rating', short: 'FCE', direction: 'Higher manual ratings first.', tolerance: 0.25, unit: 'rating' },
  { id: 'start', name: 'Start time', short: 'START', direction: 'Days that begin later first.', tolerance: 15, unit: 'minutes' },
  { id: 'gap', name: 'Time between classes', short: 'GAP', direction: 'Longer shortest break first.', tolerance: 10, unit: 'minutes' },
  { id: 'end', name: 'End time', short: 'END', direction: 'Days that finish earlier first.', tolerance: 15, unit: 'minutes' },
  { id: 'pref', name: 'Group preference', short: 'PREF', direction: 'Higher-ranked options in ranked groups first.', tolerance: 0.5, unit: 'rank' },
  { id: 'path', name: 'Walking', short: 'WALK', direction: 'Less estimated walking per week first.', tolerance: 250, unit: 'metres' },
]
export const DEFAULT_ORDER: CriterionId[] = ['fce', 'start', 'gap', 'end', 'pref', 'path']

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
  let pref: number | null = null
  for (const g of ctx.groups) {
    if (!g.ranked) continue
    for (const c of s.courses) { const i = g.options.indexOf(c); if (i >= 0) pref = (pref ?? 0) + i }
    if (pref === null) pref = 0
  }
  return {
    fce: ratedCount ? mean(rated) : null,
    rated: ratedCount,
    slots: s.slots.length,
    start: mean(starts),
    gap: gaps.length ? Math.min(...gaps) : Infinity,
    end: mean(ends),
    pref,
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
    case 'pref': return -(sc.pref ?? 0)
    case 'path': return -(sc.path ?? 0)
  }
}

function band(id: CriterionId, sc: Scores): number {
  const c = CRITERIA.find((x) => x.id === id)!
  return Math.round(orientedValue(id, sc) / c.tolerance)
}

/**
 * Rank by strict priority: compare criteria in `order`, each quantised to its tolerance band
 * so near-ties fall through to the next criterion. Final tie-break on raw values, then id.
 */
export function rank(schedules: Schedule[], order: CriterionId[], ctx: RankContext): RankedSchedule[] {
  const given = Object.values(ctx.ratings)
  const neutral = given.length ? mean(given) : null
  const scored = schedules.map((s) => ({ ...s, scores: score(s, ctx, neutral), rank: 0 }))
  scored.sort((a, b) => {
    for (const id of order) {
      const d = band(id, b.scores) - band(id, a.scores)
      if (d !== 0) return d
    }
    for (const id of order) {
      const d = orientedValue(id, b.scores) - orientedValue(id, a.scores)
      if (d !== 0) return d
    }
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0
  })
  scored.forEach((s, i) => (s.rank = i + 1))
  return scored
}
