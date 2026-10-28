import type { Day, Meeting } from './types.ts'

const DAY_RE = /^[MTWRFSU]+$/

export function parseDays(s: string): Day[] | null {
  const t = s.trim()
  if (!DAY_RE.test(t)) return null
  const out: Day[] = []
  for (const ch of t) if (!out.includes(ch as Day)) out.push(ch as Day)
  return out
}

/** '01:50PM' -> 830 */
export function parseClock(s: string): number | null {
  const m = /^(\d{1,2}):(\d{2})\s*([AP])M$/i.exec(s.trim())
  if (!m) return null
  let h = Number(m[1])
  const min = Number(m[2])
  const pm = m[3].toUpperCase() === 'P'
  if (h === 12) h = pm ? 12 : 0
  else if (pm) h += 12
  return h * 60 + min
}

/** 830 -> '1:50 PM' */
export function formatClock(min: number, opts: { compact?: boolean } = {}): string {
  const h24 = Math.floor(min / 60) % 24
  const m = min % 60
  const h = h24 % 12 === 0 ? 12 : h24 % 12
  const suffix = h24 < 12 ? 'AM' : 'PM'
  if (opts.compact && m === 0) return `${h}${suffix.toLowerCase()}`
  return `${h}:${String(m).padStart(2, '0')} ${suffix}`
}

export function formatDuration(min: number): string {
  if (!Number.isFinite(min)) return '—'
  const h = Math.floor(min / 60)
  const m = Math.round(min % 60)
  if (h === 0) return `${m} min`
  if (m === 0) return `${h} h`
  return `${h} h ${m} min`
}

export const DAY_NAMES: Record<Day, string> = {
  M: 'Monday', T: 'Tuesday', W: 'Wednesday', R: 'Thursday', F: 'Friday', S: 'Saturday', U: 'Sunday',
}
export const DAY_SHORT: Record<Day, string> = {
  M: 'Mon', T: 'Tue', W: 'Wed', R: 'Thu', F: 'Fri', S: 'Sat', U: 'Sun',
}

export function formatDays(days: Day[]): string {
  return days.join('')
}

export function formatMeeting(m: Meeting): string {
  return `${formatDays(m.days)} ${formatClock(m.start)}–${formatClock(m.end)}`
}

/** 'MWF 9:00–9:50 AM' (suffix once when both ends share it). */
export function formatMeetingCompact(m: Meeting): string {
  const a = formatClock(m.start)
  const b = formatClock(m.end)
  const sa = a.slice(-2), sb = b.slice(-2)
  return sa === sb ? `${formatDays(m.days)} ${a.slice(0, -3)}–${b}` : `${formatDays(m.days)} ${a}–${b}`
}

/** Normalise '15-150' / '15150' / ' 15 150 ' to '15150'. Returns null if not five digits. */
export function normaliseCode(s: string): string | null {
  const d = s.replace(/\D/g, '')
  return d.length === 5 ? d : null
}

/** '15150' -> '15-150' */
export function displayCode(code: string): string {
  return code.length === 5 ? `${code.slice(0, 2)}-${code.slice(2)}` : code
}
