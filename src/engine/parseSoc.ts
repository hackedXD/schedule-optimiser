import type { Catalog, Course, Meeting, Mini, Offering, OfferingKind } from './types.ts'
import { parseClock, parseDays } from './time.ts'

const ENTITIES: Record<string, string> = { '&nbsp;': ' ', '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" }

function clean(cell: string): string {
  return cell
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z#0-9]+;/gi, (e) => ENTITIES[e.toLowerCase()] ?? ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function cellsOf(row: string): string[] {
  const out: string[] = []
  const re = /<TD[^>]*>(.*?)<\/TD>/gis
  let m: RegExpExecArray | null
  while ((m = re.exec(row))) out.push(clean(m[1]))
  return out
}

function classify(label: string): { kind: OfferingKind; mini: Mini } {
  const kind: OfferingKind = /^lec/i.test(label) ? 'lecture' : 'section'
  const tail = label.trim().slice(-1)
  const mini: Mini = kind === 'section' && (tail === '3' || tail === '4') ? (Number(tail) as Mini) : 0
  return { kind, mini }
}

/**
 * Parse the CMU "Full Schedule Of Classes" HTML export.
 * Columns: Course, Title, Units, Lec/Sec, Days, Begin, End, Location.
 */
export function parseSocHtml(html: string): Catalog {
  const semester = /Semester:\s*([^<]+)/i.exec(html)?.[1]?.trim() ?? 'Unknown semester'
  const runDate = /Run Date:\s*([^<]+)/i.exec(html)?.[1]?.trim() ?? ''
  const courses: Record<string, Course> = {}

  let department = ''
  let course: Course | null = null
  let offering: Offering | null = null

  for (const raw of html.split('</TR>')) {
    const c = cellsOf(raw)
    if (c.length === 0) continue

    // Department header rows have 11 cells with a bold name in the first.
    if (c.length === 11 && c[0] && !/^\d{5}$/.test(c[0])) {
      department = c[0]
      continue
    }
    if (c.length < 8) continue
    const [code, title, units, label, days, begin, end, location] = c
    if (code === 'Course') continue

    if (/^\d{5}$/.test(code)) {
      course = courses[code] ?? { code, title, units, department, offerings: [] }
      if (!courses[code]) courses[code] = course
      offering = null
    } else if (!course) {
      continue
    } else if (!code && title && !label && !days) {
      // Title continuation row ("Practicum:" etc.)
      course.title = `${course.title} ${title}`.replace(/\s+/g, ' ').trim()
      continue
    }

    if (label) {
      const { kind, mini } = classify(label)
      offering = { id: `${course.code}:${label}`, course: course.code, label, kind, mini, meetings: [], tba: false }
      course.offerings.push(offering)
    }
    if (!offering) continue

    const d = parseDays(days)
    const s = parseClock(begin)
    const e = parseClock(end)
    if (d && s !== null && e !== null && e > s) {
      const meeting: Meeting = { days: d, start: s, end: e, location }
      offering.meetings.push(meeting)
    } else if (days.toUpperCase() === 'TBA' || !days) {
      if (offering.meetings.length === 0) offering.tba = true
    }
  }

  // An offering with a TBA row and real rows is placeable; clear the flag.
  for (const c of Object.values(courses)) for (const o of c.offerings) if (o.meetings.length) o.tba = false
  return { semester, runDate, courses }
}
