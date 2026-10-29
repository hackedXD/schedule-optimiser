/**
 * Parse a section table copied from SIO (Student Information Online), the only place that lists the
 * instructor, building and room for each lecture and section of an upcoming semester.
 * Columns on the page: SECTION, MINI, INSTRUCTOR, DELIVERY MODE, BLDG/ROOM, DAY, TIME, CAN I GET IN?,
 * LOCATION, SPECIAL PERMISSION, WAITLIST, MAX ENROLL, UNITS, A/D/W DATES.
 * Browsers copy the table as tab-separated cells or as whitespace-run text; both are accepted.
 */
export interface SioRow {
  label: string
  mini: boolean
  /** As printed, e.g. ['Kaynar', 'Sands'] (SIO shows last names, separated by ';'). */
  instructors: string[]
  delivery: string
  building: string | null
  room: string | null
  days: string
  start: string
  end: string
  availability: string
}

export interface SioImport {
  /** '15150' when the pasted text includes the "Course: 15-150 …" heading. */
  code: string | null
  title: string | null
  rows: SioRow[]
}

const SECTION = /^(Lec\s?\d*|[A-Z]{1,2}\d?)$/
const TIME = /(\d{1,2}:\d{2}\s?[AP]M)\s*-\s*(\d{1,2}:\d{2}\s?[AP]M)/i
const DAYS = /^(?:[MTWRFSU]{1,7}|TBA)$/

export function parseSio(text: string): SioImport {
  const clean = text.replace(/\r/g, '').replace(/ /g, ' ')
  const head = /Course:\s*(\d{2})-?(\d{3})\s+([^\n\t]+)/i.exec(clean)
  const code = head ? head[1] + head[2] : null
  const title = head ? head[3].trim() : null

  // Flatten to one token stream; cells may wrap onto several lines in the page, so line breaks mean nothing.
  const tokens = clean.split(/[\s]+/).filter(Boolean)
  const rows: SioRow[] = []
  let i = 0
  while (i < tokens.length) {
    // A row starts with a section label followed by the Mini flag.
    let label = tokens[i]
    let next = i + 1
    if (/^Lec$/i.test(label) && /^\d+$/.test(tokens[i + 1] ?? '')) { label = `Lec ${tokens[i + 1]}`; next = i + 2 }
    const mini = tokens[next]
    if (!SECTION.test(label) || !/^[YN]$/.test(mini ?? '')) { i++; continue }
    // Find the time range ahead of us; everything between is instructor, delivery, bldg/room, days.
    let j = next + 1
    let timeAt = -1
    for (; j < Math.min(tokens.length, next + 40); j++) {
      if (/^\d{1,2}:\d{2}[AP]M$/i.test(tokens[j]) && tokens[j + 1] === '-' && /^\d{1,2}:\d{2}[AP]M$/i.test(tokens[j + 2] ?? '')) { timeAt = j; break }
      if (/^\d{1,2}:\d{2}[AP]M-\d{1,2}:\d{2}[AP]M$/i.test(tokens[j])) { timeAt = j; break }
    }
    if (timeAt < 0) { i++; continue }
    const mid = tokens.slice(next + 1, timeAt)
    const days = mid.pop() ?? ''
    if (!DAYS.test(days)) { i++; continue }
    // Building/room: 'GHC :: 4401' (three tokens), 'PH :: 100', or a lone 'TBA' / 'DNM'.
    let building: string | null = null
    let room: string | null = null
    const sep = mid.lastIndexOf('::')
    if (sep > 0) { building = mid[sep - 1]; room = mid.slice(sep + 1).join(' ') || null; mid.splice(sep - 1) }
    else if (/^(TBA|DNM)$/i.test(mid[mid.length - 1] ?? '')) { mid.pop() }
    // Delivery mode: the last all-caps code before the building.
    let delivery = ''
    if (/^[A-Z]{2,4}$/.test(mid[mid.length - 1] ?? '')) delivery = mid.pop()!
    const instructors = mid.join(' ').split(/\s*;\s*/).map((s) => s.trim()).filter((s) => s && s !== '-' && !/^TBA$/i.test(s))
    const tm = TIME.exec(tokens.slice(timeAt, timeAt + 3).join(' '))!
    const after = tokens.slice(timeAt + 3, timeAt + 6).join(' ')
    const availability = /Waitlist|Available|Closed|Full|-/.exec(after)?.[0] ?? ''
    rows.push({ label, mini: mini === 'Y', instructors, delivery, building, room, days, start: tm[1].toUpperCase().replace(' ', ''), end: tm[2].toUpperCase().replace(' ', ''), availability })
    i = timeAt + 3
  }
  return { code, title, rows }
}
