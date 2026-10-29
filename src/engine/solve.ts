import type { Catalog, Course, Meeting, Offering, Ratings, Request, Schedule, Slot } from './types.ts'
import type { CourseDetail } from './parseDetail.ts'

export interface SolveResult {
  schedules: Schedule[]
  /** Courses that were asked for but are not in the catalog. */
  missing: string[]
  /** Courses with no placeable offering after filters. */
  unplaceable: string[]
  /** Number of complete combinations examined. */
  explored: number
  /** True when the result cap stopped enumeration. */
  truncated: boolean
  /** Per course: how many slots the solver had to choose from, and whether lecture pairing was applied. */
  slotCounts: Record<string, { lectures: number; sections: number; paired: boolean }>
}

export const RESULT_CAP = 20000

/** Lecture pairing per course: section label -> lecture label. */
export type Pairings = Record<string, Record<string, string>>

export function pairingsFrom(details: Record<string, CourseDetail | undefined>): Pairings {
  const out: Pairings = {}
  for (const [code, d] of Object.entries(details)) if (d && Object.keys(d.pairing).length) out[code] = d.pairing
  return out
}

function ratingFor(o: Offering, ratings: Ratings): number | undefined {
  return ratings[o.id] ?? ratings[o.course]
}

function meetingsKey(ms: Meeting[]): string {
  return ms.map((m) => `${m.days.join('')}@${m.start}-${m.end}`).sort().join('|')
}

function usable(o: Offering, req: Request): boolean {
  if (o.tba || o.meetings.length === 0) return false
  if (req.excluded.includes(o.id)) return false
  if (!req.includeMini && o.mini !== 0) return false
  if (req.locations.length && !o.meetings.every((m) => req.locations.includes(m.location))) return false
  return true
}

/** Collapse interchangeable offerings (same meetings, same mini, same rating, same paired lecture) into slots. */
export function slotsFor(course: Course, req: Request, ratings: Ratings, pairing?: Record<string, string>): { lectures: Slot[]; sections: Slot[] } {
  const pinnedHere = req.pinned.filter((id) => id.startsWith(`${course.code}:`))
  const byKind = (kind: Offering['kind']) => {
    let offs = course.offerings.filter((o) => o.kind === kind && usable(o, req))
    const pinnedOfKind = pinnedHere.filter((id) => offs.some((o) => o.id === id))
    if (pinnedOfKind.length) offs = offs.filter((o) => pinnedOfKind.includes(o.id))
    const groups = new Map<string, Slot>()
    for (const o of offs) {
      const lec = kind === 'section' && pairing ? pairing[o.label] ?? '' : ''
      const key = `${o.mini}#${meetingsKey(o.meetings)}#${ratingFor(o, ratings) ?? ''}#${lec}`
      const g = groups.get(key)
      if (g) g.offerings.push(o)
      else groups.set(key, { course: course.code, kind, offerings: [o], meetings: o.meetings, mini: o.mini })
    }
    return [...groups.values()]
  }
  return { lectures: byKind('lecture'), sections: byKind('section') }
}

/** Two slots conflict when any meeting shares a day and overlaps in time, unless they are opposite minis. */
export function slotsConflict(a: Slot, b: Slot): boolean {
  if (a.mini !== 0 && b.mini !== 0 && a.mini !== b.mini) return false
  for (const ma of a.meetings) for (const mb of b.meetings) {
    if (ma.start >= mb.end || mb.start >= ma.end) continue
    for (const d of ma.days) if (mb.days.includes(d)) return true
  }
  return false
}

function lectureLabelMatches(label: string, want: string): boolean {
  const norm = (x: string) => (/^lec$/i.test(x.trim()) ? 'lec 1' : x.trim().toLowerCase())
  return norm(label) === norm(want)
}

/**
 * Every internally consistent way to take one course: a tuple of slots (lecture and/or section).
 * With a known pairing, a section only joins the lecture it is listed under.
 */
export function choicesFor(course: Course, req: Request, ratings: Ratings, pairing?: Record<string, string>): { choices: Slot[][]; lectures: number; sections: number; paired: boolean } {
  const { lectures, sections } = slotsFor(course, req, ratings, pairing)
  const paired = !!pairing && lectures.length > 0 && sections.length > 0 && sections.some((s) => pairing[s.offerings[0].label])
  const allLectureLabels = course.offerings.filter((o) => o.kind === 'lecture').map((o) => o.label)
  let choices: Slot[][]
  if (lectures.length && sections.length) {
    choices = []
    for (const sec of sections) {
      const want = paired ? pairing![sec.offerings[0].label] : undefined
      let lecs = lectures
      if (want) {
        lecs = lectures.filter((lec) => lec.offerings.some((o) => lectureLabelMatches(o.label, want)))
        if (lecs.length === 0) {
          // The paired lecture exists but was excluded or pinned away: this section is not takeable.
          if (allLectureLabels.some((l) => lectureLabelMatches(l, want))) continue
          // The detail page names a lecture the export does not have at all: pairing is unusable, allow every lecture.
          lecs = lectures
        }
      }
      for (const lec of lecs) if (!slotsConflict(lec, sec)) choices.push([lec, sec])
    }
  } else {
    // A course that offers lectures needs one, and one that offers sections needs one: if every option of a
    // kind was excluded or pinned away, the course cannot be taken at all.
    const hasLectures = course.offerings.some((o) => o.kind === 'lecture' && !o.tba)
    const hasSections = course.offerings.some((o) => o.kind === 'section' && !o.tba)
    choices = (hasLectures && !lectures.length) || (hasSections && !sections.length) ? [] : [...lectures, ...sections].map((s) => [s])
  }
  return { choices, lectures: lectures.length, sections: sections.length, paired }
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

export function solve(catalog: Catalog, req: Request, ratings: Ratings, pairings: Pairings = {}): SolveResult {
  const schedules: Schedule[] = []
  const missing = new Set<string>()
  const unplaceable = new Set<string>()
  const slotCounts: SolveResult['slotCounts'] = {}
  let explored = 0
  let truncated = false

  const allCodes = new Set([...req.required, ...req.groups.flatMap((g) => g.options)])
  const perCourse = new Map<string, Slot[][]>()
  for (const code of allCodes) {
    const course = catalog.courses[code]
    if (!course) { missing.add(code); continue }
    const { choices, lectures, sections, paired } = choicesFor(course, req, ratings, pairings[code])
    slotCounts[code] = { lectures, sections, paired }
    if (choices.length === 0) { unplaceable.add(code); continue }
    perCourse.set(code, choices)
  }

  for (const set of courseSets(req)) {
    if (set.some((c) => !perCourse.has(c))) continue
    const dims = set.map((c) => perCourse.get(c)!).sort((a, b) => a.length - b.length)
    const chosen: Slot[] = []
    const dfs = (i: number): boolean => {
      if (i === dims.length) {
        explored++
        if (schedules.length >= RESULT_CAP) { truncated = true; return false }
        const slots = [...chosen]
        schedules.push({ id: slots.map((s) => s.offerings[0].id).sort().join('+'), courses: set, slots })
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

  return { schedules, missing: [...missing], unplaceable: [...unplaceable], explored, truncated, slotCounts }
}

/** Pairs of courses that can never coexist given the filters (used to explain an empty result). */
export function conflictingPairs(catalog: Catalog, codes: string[], req: Request, ratings: Ratings, pairings: Pairings = {}): [string, string][] {
  const choices = new Map<string, Slot[][]>()
  for (const c of codes) {
    const course = catalog.courses[c]
    if (!course) continue
    const { choices: ch } = choicesFor(course, req, ratings, pairings[c])
    if (ch.length) choices.set(c, ch)
  }
  const out: [string, string][] = []
  const list = [...choices.keys()]
  for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
    const ca = choices.get(list[i])!, cb = choices.get(list[j])!
    const ok = ca.some((pa) => cb.some((pb) => pa.every((x) => pb.every((y) => !slotsConflict(x, y)))))
    if (!ok) out.push([list[i], list[j]])
  }
  return out
}
