/**
 * Historical staffing from the ScottyLabs schedules endpoint
 * (https://course.apis.scottylabs.org/schedules?courseID=15-150): who taught each lecture and section,
 * and where, in past terms. Terms from Fall 2025 on carry no instructors or rooms (the registrar stopped
 * publishing them), so the newest usable term is used as a guess for the upcoming one.
 */
export interface ScheduleTime { days: number[]; begin: string; end: string; building: string | null; room: string | null }
export interface ScheduleMeeting { name: string; instructors: string[]; lecture?: string | null; location?: string | null; times: ScheduleTime[] }
export interface TermSchedule { courseID: string; year: string | number; semester: string; instructors?: string[]; lectures: ScheduleMeeting[]; sections: ScheduleMeeting[] }

export interface Staffed { instructors: string[]; building: string | null; room: string | null }
export interface Staffing {
  /** 'Spring 2025' */
  term: string
  /** True when the term is the same season as the one being planned. */
  sameSeason: boolean
  lectures: Record<string, Staffed>
  sections: Record<string, Staffed>
}

const SEM_ORDER: Record<string, number> = { spring: 1, summer: 2, fall: 3 }
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
const termKey = (t: TermSchedule) => Number(t.year) * 10 + (SEM_ORDER[String(t.semester).toLowerCase()] ?? 0)
const hasStaff = (t: TermSchedule) => [...(t.lectures ?? []), ...(t.sections ?? [])].some((m) => (m.instructors ?? []).some((i) => i && i.toUpperCase() !== 'TBA'))

function staffed(m: ScheduleMeeting): Staffed {
  const t = (m.times ?? []).find((x) => x.building) ?? m.times?.[0]
  return { instructors: (m.instructors ?? []).filter((i) => i && i.toUpperCase() !== 'TBA'), building: t?.building || null, room: t?.room || null }
}

/**
 * The newest term with instructors, preferring the same season as `season` ('spring' | 'fall' | 'summer').
 * Returns null when no term carries instructors.
 */
export function latestStaffing(terms: TermSchedule[], season: string): Staffing | null {
  const usable = terms.filter(hasStaff).sort((a, b) => termKey(b) - termKey(a))
  if (!usable.length) return null
  const same = usable.find((t) => String(t.semester).toLowerCase() === season.toLowerCase())
  const pick = same ?? usable[0]
  const lectures: Record<string, Staffed> = {}
  const sections: Record<string, Staffed> = {}
  for (const l of pick.lectures ?? []) if (l.name) lectures[l.name] = staffed(l)
  for (const s of pick.sections ?? []) if (s.name) sections[s.name] = staffed(s)
  return { term: `${cap(String(pick.semester))} ${pick.year}`, sameSeason: !!same, lectures, sections }
}

/** 'Spring 2027' -> 'spring' */
export function seasonOf(semester: string): string {
  return semester.trim().split(/\s+/)[0]?.toLowerCase() ?? ''
}

/** 'Erdmann, Michael' -> 'Michael Erdmann' */
export function staffName(raw: string): string {
  const [last, first] = raw.split(',').map((s) => s.trim())
  return first ? `${first} ${last}` : raw
}

export function schedulesUrl(code: string): string {
  const id = code.length === 5 ? `${code.slice(0, 2)}-${code.slice(2)}` : code
  return `https://course.apis.scottylabs.org/schedules?courseID=${id}`
}
