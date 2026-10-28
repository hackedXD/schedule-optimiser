// Node-only: fetch a SOC course-details page with an on-disk cache. Used by the Vite dev middleware and scripts/details.mjs.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { detailUrl, parseDetailHtml, type CourseDetail } from './parseDetail.ts'

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
