export type Day = 'M' | 'T' | 'W' | 'R' | 'F' | 'S' | 'U'
export const DAY_ORDER: Day[] = ['U', 'M', 'T', 'W', 'R', 'F', 'S']
export const WEEKDAYS: Day[] = ['M', 'T', 'W', 'R', 'F']

/** One block of meeting time. start/end are minutes after midnight. */
export interface Meeting {
  days: Day[]
  start: number
  end: number
  location: string
}

export type OfferingKind = 'lecture' | 'section'
/** 0 = full semester, 3 = first mini, 4 = second mini. */
export type Mini = 0 | 3 | 4

export interface Offering {
  /** Stable id: `${course}:${label}` */
  id: string
  course: string
  label: string
  kind: OfferingKind
  mini: Mini
  meetings: Meeting[]
  /** True when days/times are TBA and the offering cannot be placed. */
  tba: boolean
}

export interface Course {
  /** Five digits, no hyphen: '15150' */
  code: string
  title: string
  units: string
  department: string
  offerings: Offering[]
}

export interface Catalog {
  semester: string
  runDate: string
  courses: Record<string, Course>
}

export interface ChoiceGroup {
  id: string
  pick: number
  /** In display order; when `ranked`, earlier options are preferred. */
  options: string[]
  ranked?: boolean
  /** Availability mode: keep every option's sections open and pick at registration (Equal groups only). */
  flexible?: boolean
}

export interface Request {
  required: string[]
  groups: ChoiceGroup[]
  /** Offering ids the student refuses. */
  excluded: string[]
  /** Offering ids the student insists on (per course, only these are considered). */
  pinned: string[]
  /** Keep only offerings whose every meeting is at one of these locations. Empty = all. */
  locations: string[]
  includeMini: boolean
}

/** A set of interchangeable offerings: identical meetings and identical rating. */
export interface Slot {
  course: string
  kind: OfferingKind
  /** All offerings in this slot; the first is representative. */
  offerings: Offering[]
  meetings: Meeting[]
  mini: Mini
}

export interface Schedule {
  id: string
  /** Courses actually taken (required + chosen from groups). */
  courses: string[]
  slots: Slot[]
}

export type CriterionId = 'fce' | 'start' | 'gap' | 'end' | 'path'

export interface Criterion {
  id: CriterionId
  name: string
  short: string
  /** One sentence on what higher means. */
  direction: string
  /** Band width in the criterion's unit; values within one band tie. */
  tolerance: number
  unit: 'rating' | 'minutes' | 'metres'
}

/** Manual ratings keyed by course code or offering id, 1..5. */
export type Ratings = Record<string, number>

export interface Scores {
  fce: number | null
  /** How many of the schedule's slots carry a manual rating. */
  rated: number
  /** Total slots in the schedule. */
  slots: number
  start: number
  gap: number
  end: number
  /** Estimated walking metres per week between consecutive buildings (and the dorm, when set). null when no building is known. */
  path: number | null
}

/** What the ranker needs beyond the schedules themselves. */
export interface RankContext {
  ratings: Ratings
  groups: ChoiceGroup[]
  /** Building code for a course, or undefined when unknown. */
  buildingOf: (course: string) => string | undefined
  /** Dorm/building code the day starts and ends at, or null. */
  dorm: string | null
}

export interface RankedSchedule extends Schedule {
  scores: Scores
  rank: number
}
