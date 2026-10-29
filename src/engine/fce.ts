/** Instructor-level FCE results as served by the ScottyLabs course API (https://course.apis.scottylabs.org/fces?courseID=15-150). */
export interface FceRecord {
  courseID: string
  instructor: string
  andrewID: string | null
  semester: string
  year: string | number
  hrsPerWeek: number | null
  numRespondents: number | null
  possibleRespondents: number | null
  /** CMU's nine FCE questions in survey order. */
  rating: number[]
}

/** Positions of the two summary questions in `rating`, in CMU's FCE question order. */
export const OVERALL_TEACHING = 7
export const OVERALL_COURSE = 8

export interface InstructorSummary {
  instructor: string
  /** Terms taught, newest first, as 'Fall 2025'. */
  terms: string[]
  lastYear: number
  /** Means over the terms considered. */
  teaching: number | null
  course: number | null
  hrsPerWeek: number | null
  respondents: number
}

const SEM_ORDER: Record<string, number> = { spring: 1, summer: 2, fall: 3 }
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()

function termKey(r: FceRecord): number {
  return Number(r.year) * 10 + (SEM_ORDER[r.semester.toLowerCase()] ?? 0)
}

function mean(xs: number[]): number | null { return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null }

/**
 * One row per instructor, newest first. Scores average that instructor's last `recentTerms` offerings,
 * so a long-ago bad term does not drag down someone who has since improved.
 */
export function summariseFce(records: FceRecord[], recentTerms = 3): InstructorSummary[] {
  const byInstructor = new Map<string, FceRecord[]>()
  for (const r of records) {
    if (!r.instructor || !Array.isArray(r.rating) || r.rating.length <= OVERALL_COURSE) continue
    const list = byInstructor.get(r.instructor) ?? []
    list.push(r)
    byInstructor.set(r.instructor, list)
  }
  const out: InstructorSummary[] = []
  for (const [instructor, list] of byInstructor) {
    list.sort((a, b) => termKey(b) - termKey(a))
    const recent = list.slice(0, recentTerms)
    out.push({
      instructor,
      terms: list.map((r) => `${cap(r.semester)} ${r.year}`),
      lastYear: Number(list[0].year),
      teaching: mean(recent.map((r) => r.rating[OVERALL_TEACHING]).filter((x) => typeof x === 'number')),
      course: mean(recent.map((r) => r.rating[OVERALL_COURSE]).filter((x) => typeof x === 'number')),
      hrsPerWeek: mean(recent.map((r) => r.hrsPerWeek).filter((x): x is number => typeof x === 'number')),
      respondents: recent.reduce((n, r) => n + (r.numRespondents ?? 0), 0),
    })
  }
  return out.sort((a, b) => termKey(byInstructor.get(b.instructor)![0]) - termKey(byInstructor.get(a.instructor)![0]))
}

/** Pretty instructor name: 'KAYNAR, ZELIHA DILSUN' -> 'Zeliha Dilsun Kaynar'. */
export function instructorName(raw: string): string {
  const [last, first] = raw.split(',').map((s) => s.trim())
  const title = (s: string) => s.toLowerCase().replace(/(^|[\s'-])([a-z])/g, (_, p, c) => p + c.toUpperCase())
  return first ? `${title(first)} ${title(last)}` : title(raw)
}

export function fceUrl(code: string): string {
  const id = code.length === 5 ? `${code.slice(0, 2)}-${code.slice(2)}` : code
  return `https://course.apis.scottylabs.org/fces?courseID=${id}`
}

export interface GeneralSummary {
  instructor: string
  /** Distinct course ids in the terms considered, e.g. ['15-112', '46-901']. */
  courses: string[]
  terms: string[]
  teaching: number | null
  course: number | null
  respondents: number
}

/** One instructor's record across every course they have taught, over their last `recentTerms` offerings of any course. */
export function summariseInstructor(records: FceRecord[], recentTerms = 3): GeneralSummary | null {
  const usable = records.filter((r) => Array.isArray(r.rating) && r.rating.length > OVERALL_COURSE).sort((a, b) => termKey(b) - termKey(a))
  if (!usable.length) return null
  const recent = usable.slice(0, recentTerms)
  return {
    instructor: usable[0].instructor,
    courses: [...new Set(usable.map((r) => r.courseID))].sort(),
    terms: usable.map((r) => `${cap(r.semester)} ${r.year} · ${r.courseID}`),
    teaching: mean(recent.map((r) => r.rating[OVERALL_TEACHING]).filter((x) => typeof x === 'number')),
    course: mean(recent.map((r) => r.rating[OVERALL_COURSE]).filter((x) => typeof x === 'number')),
    respondents: recent.reduce((n, r) => n + (r.numRespondents ?? 0), 0),
  }
}

export function instructorFceUrl(name: string): string {
  return `https://course.apis.scottylabs.org/fces?instructor=${encodeURIComponent(name)}`
}
export const INSTRUCTORS_URL = 'https://course.apis.scottylabs.org/instructors'

/** What the app keeps per imported surname: every ScottyLabs instructor with that surname and their records. */
export interface InstructorFces { surname: string; candidates: { name: string; records: FceRecord[] }[] }
