// Fetch ScottyLabs FCE history into public/data/fces.json so a production build has it.
// Usage: node scripts/fces.mjs 21-241 18-213 ...
import { fetchFceCached } from '../src/engine/detailCache.ts'
import { summariseFce } from '../src/engine/fce.ts'

const codes = process.argv.slice(2)
if (codes.length === 0) { console.error('usage: node scripts/fces.mjs <course codes...>'); process.exit(1) }
for (const raw of codes) {
  const code = raw.replace(/\D/g, '')
  if (code.length !== 5) { console.warn(`skip ${raw}: not a course code`); continue }
  try {
    const recs = await fetchFceCached(code)
    const s = summariseFce(recs)
    console.log(`${code}  ${recs.length} FCE records, ${s.length} instructors${s[0] ? `, latest ${s[0].instructor} (${s[0].terms[0]})` : ''}`)
  } catch (e) { console.log(`${code}  failed: ${e}`) }
}
