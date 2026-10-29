// Node-only: fetch a SOC course-details page with an on-disk cache. Used by the Vite dev middleware and scripts/details.mjs.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { detailUrl, parseDetailHtml, type CourseDetail } from './parseDetail.ts'
import { fceUrl, type FceRecord } from './fce.ts'
import { schedulesUrl, type TermSchedule } from './staffing.ts'

export const DETAILS_CACHE = 'public/data/details.json'
const UA = 'schedule-optimiser (personal, local; one request per course)'

export type DetailCache = Record<string, CourseDetail>

export function readCache(path = DETAILS_CACHE): DetailCache {
  try { return existsSync(path) ? (JSON.parse(readFileSync(path, 'utf8')) as DetailCache) : {} } catch { return {} }
}

export function writeCache(cache: DetailCache, path = DETAILS_CACHE): void {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, JSON.stringify(cache))
}

export const cacheKey = (code: string, semester: string) => `${semester}:${code}`

/** Returns the detail (cached or freshly fetched), or null when SOC has no such course. */
export async function fetchDetailCached(code: string, semester: string, path = DETAILS_CACHE): Promise<CourseDetail | null> {
  const cache = readCache(path)
  const key = cacheKey(code, semester)
  if (cache[key]) return cache[key]
  const res = await fetch(detailUrl(code, semester), { headers: { 'user-agent': UA } })
  if (!res.ok) return null
  const detail = parseDetailHtml(await res.text(), code)
  if (!detail) return null
  cache[key] = detail
  writeCache(cache, path)
  return detail
}

export const FCE_CACHE = 'public/data/fces.json'
export type FceCache = Record<string, { fetchedAt: string; records: FceRecord[] }>

/** FCE records for a course (cached on disk); [] when ScottyLabs has none. Throws on network failure. */
export async function fetchFceCached(code: string, path = FCE_CACHE): Promise<FceRecord[]> {
  let cache: FceCache = {}
  try { cache = existsSync(path) ? (JSON.parse(readFileSync(path, 'utf8')) as FceCache) : {} } catch { cache = {} }
  if (cache[code]) return cache[code].records
  const res = await fetch(fceUrl(code), { headers: { 'user-agent': UA } })
  if (!res.ok) throw new Error(`ScottyLabs FCE API ${res.status}`)
  const body = (await res.json()) as unknown
  const records = Array.isArray(body) ? (body as FceRecord[]) : []
  cache[code] = { fetchedAt: new Date().toISOString(), records }
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, JSON.stringify(cache))
  return records
}

export const SCHEDULES_CACHE = 'public/data/schedules.json'
export type SchedulesCache = Record<string, { fetchedAt: string; terms: TermSchedule[] }>

/** Past-term schedules (instructors, rooms) for a course, cached on disk. Throws on network failure. */
export async function fetchSchedulesCached(code: string, path = SCHEDULES_CACHE): Promise<TermSchedule[]> {
  let cache: SchedulesCache = {}
  try { cache = existsSync(path) ? (JSON.parse(readFileSync(path, 'utf8')) as SchedulesCache) : {} } catch { cache = {} }
  if (cache[code]) return cache[code].terms
  const res = await fetch(schedulesUrl(code), { headers: { 'user-agent': UA } })
  if (!res.ok) throw new Error(`ScottyLabs schedules API ${res.status}`)
  const body = (await res.json()) as unknown
  const terms = Array.isArray(body) ? (body as TermSchedule[]) : []
  cache[code] = { fetchedAt: new Date().toISOString(), terms }
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, JSON.stringify(cache))
  return terms
}
