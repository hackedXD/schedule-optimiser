// Fetch SOC course-details pages into public/data/details.json so a production build has them.
// Usage: node scripts/details.mjs S27 21-241 18-213 15-150 ...
import { fetchDetailCached } from '../src/engine/detailCache.ts'

const [semester, ...codes] = process.argv.slice(2)
if (!semester || !/^[SFM]\d{2}$/.test(semester) || codes.length === 0) {
  console.error('usage: node scripts/details.mjs <S27|F26|M27> <course codes...>')
  process.exit(1)
}
for (const raw of codes) {
  const code = raw.replace(/\D/g, '')
  if (code.length !== 5) { console.warn(`skip ${raw}: not a course code`); continue }
  const d = await fetchDetailCached(code, semester)
  console.log(d ? `${code}  ${d.title}  (${Object.keys(d.pairing).length} paired sections)` : `${code}  no detail page`)
}
