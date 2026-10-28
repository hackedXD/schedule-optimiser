// Converts the CMU "Full Schedule Of Classes" HTML export into public/data/soc.json.
// Usage: node scripts/ingest.mjs [path/to/export.html]
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { parseSocHtml } from '../src/engine/parseSoc.ts'

const input = process.argv[2] ?? 'cmu-schedule-of-classes.html'
const html = readFileSync(input, 'latin1')
const catalog = parseSocHtml(html)
mkdirSync('public/data', { recursive: true })
writeFileSync('public/data/soc.json', JSON.stringify(catalog))
const courses = Object.keys(catalog.courses).length
const sections = Object.values(catalog.courses).reduce((n, c) => n + c.offerings.length, 0)
console.log(`${catalog.semester}: ${courses} courses, ${sections} offerings -> public/data/soc.json`)
