// Fetch ScottyLabs FCE history and past schedules (instructors, rooms) into public/data/ so a production build has them.
// Usage: node scripts/fces.mjs 21-241 18-213 ...
import { fetchFceCached, fetchSchedulesCached } from '../src/engine/detailCache.ts'
import { summariseFce } from '../src/engine/fce.ts'

const codes = process.argv.slice(2)
if (codes.length === 0) { console.error('usage: node scripts/fces.mjs <course codes...>'); process.exit(1) }
for (const raw of codes) {
  const code = raw.replace(/\D/g, '')
  if (code.length !== 5) { console.warn(`skip ${raw}: not a course code`); continue }
  try {
    const recs = await fetchFceCached(code)
    const s = summariseFce(recs)
    const terms = await fetchSchedulesCached(code)
    console.log(`${code}  ${recs.length} FCE records, ${s.length} instructors${s[0] ? `, latest ${s[0].instructor} (${s[0].terms[0]})` : ''}; ${terms.length} past schedules`)
  } catch (e) { console.log(`${code}  failed: ${e}`) }
}
