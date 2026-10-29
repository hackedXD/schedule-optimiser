// Node-only: fetch a SOC course-details page with an on-disk cache. Used by the Vite dev middleware and scripts/details.mjs.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { detailUrl, parseDetailHtml, type CourseDetail } from './parseDetail.ts'
import { fceUrl, instructorFceUrl, INSTRUCTORS_URL, type FceRecord, type InstructorFces } from './fce.ts'

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

export const INSTRUCTOR_FCE_CACHE = 'public/data/instructor-fces.json'
const INSTRUCTORS_CACHE = 'public/data/instructors.json'

async function instructorNames(): Promise<string[]> {
  try { if (existsSync(INSTRUCTORS_CACHE)) return JSON.parse(readFileSync(INSTRUCTORS_CACHE, 'utf8')) as string[] } catch { /* refetch */ }
  const res = await fetch(INSTRUCTORS_URL, { headers: { 'user-agent': UA } })
  if (!res.ok) throw new Error(`ScottyLabs instructors ${res.status}`)
  const body = (await res.json()) as { instructor?: string }[]
  const names = body.map((x) => x.instructor ?? '').filter(Boolean)
  mkdirSync(dirname(INSTRUCTORS_CACHE), { recursive: true })
  writeFileSync(INSTRUCTORS_CACHE, JSON.stringify(names))
  return names
}

/** All ScottyLabs instructors whose surname matches, each with their FCE records across every course. Cached by surname. */
export async function fetchInstructorFcesCached(surname: string, path = INSTRUCTOR_FCE_CACHE): Promise<InstructorFces> {
  const key = surname.trim().toUpperCase()
  let cache: Record<string, InstructorFces> = {}
  try { cache = existsSync(path) ? (JSON.parse(readFileSync(path, 'utf8')) as Record<string, InstructorFces>) : {} } catch { cache = {} }
  if (cache[key]) return cache[key]
  const names = (await instructorNames()).filter((n) => n.split(',')[0].trim().toUpperCase() === key)
  const candidates: InstructorFces['candidates'] = []
  for (const name of names) {
    const res = await fetch(instructorFceUrl(name), { headers: { 'user-agent': UA } })
    if (!res.ok) continue
    const body = (await res.json()) as unknown
    candidates.push({ name, records: Array.isArray(body) ? (body as FceRecord[]) : [] })
  }
  const out: InstructorFces = { surname: key, candidates }
  cache[key] = out
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, JSON.stringify(cache))
  return out
}
