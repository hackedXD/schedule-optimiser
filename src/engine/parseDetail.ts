import type { Mini } from './types.ts'

/** Durable facts from a SOC course-details page (not in the full-schedule export). */
export interface CourseDetail {
  code: string
  semester: string
  title: string
  description: string
  prerequisites: string
  corequisites: string
  crossListed: string
  notes: string
  urls: string[]
  specialPermission: boolean
  /** Section label -> lecture label, as listed on the page (sections follow their lecture). */
  pairing: Record<string, string>
  /** Section label -> mini (3/4) when the page says so. */
  minis: Record<string, Mini>
  /** Section label -> enrollment reservation notes, as printed ('Some reservations are for Students in SCS'). */
  reservations: Record<string, string[]>
  fetchedAt: string
}

const ENT: Record<string, string> = { '&nbsp;': ' ', '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&#039;': "'" }
function text(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, (e) => ENT[e.toLowerCase()] ?? ' ').replace(/\s+/g, ' ').trim()
}

function field(html: string, label: string): string {
  const m = new RegExp(`<dt>\\s*${label}\\s*</dt>\\s*<dd>(.*?)</dd>`, 'is').exec(html)
  const v = m ? text(m[1]) : ''
  return v === 'None' ? '' : v
}

/** Returns null when the page is the SOC error page or has no course. */
export function parseDetailHtml(html: string, fallbackCode = ''): CourseDetail | null {
  const head = /data-subtitle="([^"]*)"\s+data-maintitle="([^"]*)"/i.exec(html)
  if (!head) return null
  const semester = text(head[1])
  const main = text(head[2])
  const tm = /^(\d{5})\s+(.*)$/.exec(main)
  const code = tm?.[1] ?? fallbackCode
  const title = tm?.[2] ?? main

  const pairing: Record<string, string> = {}
  const minis: Record<string, Mini> = {}
  const tableEnd = html.indexOf('</table>')
  const table = tableEnd > 0 ? html.slice(0, tableEnd) : html
  let lecture: string | null = null
  let lectureLocation = ''
  for (const row of table.split('</tr>')) {
    const cells = [...row.matchAll(/<td[^>]*>(.*?)<\/td>/gis)].map((m) => text(m[1]))
    if (cells.length < 8) continue
    const label = cells[2]
    const mini = cells[3]
    const location = cells[7]
    if (!label) continue
    if (/^lec/i.test(label)) { lecture = label; lectureLocation = location }
    else {
      // Sections follow their lecture on the page; a section at another campus is not that lecture's.
      if (lecture && location === lectureLocation) pairing[label] = lecture
      if (mini === '3' || mini === '4') minis[label] = Number(mini) as Mini
    }
  }

  const reservations: Record<string, string[]> = {}
  const resM = /<h4>\s*Reservations\s*<\/h4>\s*<table[^>]*>(.*?)<\/table>/is.exec(html)
  if (resM) {
    for (const row of resM[1].split('</tr>')) {
      const cells = [...row.matchAll(/<td[^>]*>(.*?)<\/td>/gis)].map((m) => text(m[1]))
      if (cells.length < 2 || !cells[0]) continue
      ;(reservations[cells[0]] ??= []).push(cells[1])
    }
  }

  const descM = /<h4>\s*Description:?\s*<\/h4>\s*<p[^>]*>(.*?)<\/p>/is.exec(html)
  const urlsM = /<dt>\s*Related URLs\s*<\/dt>\s*<dd>(.*?)<\/dd>/is.exec(html)
  const urls = urlsM ? [...urlsM[1].matchAll(/href="([^"]+)"/g)].map((m) => m[1]) : []

  return {
    code, semester, title,
    description: descM ? text(descM[1]) : '',
    prerequisites: field(html, 'Prerequisites'),
    corequisites: field(html, 'Corequisites'),
    crossListed: field(html, 'Cross-Listed Courses'),
    notes: field(html, 'Notes'),
    urls,
    specialPermission: /^yes/i.test(field(html, 'Special Permission Required')),
    pairing, minis, reservations,
    fetchedAt: new Date().toISOString(),
  }
}

/** 'Spring 2027' -> 'S27'; Fall -> F; Summer -> M. */
export function semesterCode(semester: string): string | null {
  const m = /^(Spring|Fall|Summer)\s+(\d{4})/i.exec(semester.trim())
  if (!m) return null
  const letter = { spring: 'S', fall: 'F', summer: 'M' }[m[1].toLowerCase()]
  return `${letter}${m[2].slice(2)}`
}

export function detailUrl(code: string, semester: string): string {
  return `https://enr-apps.as.cmu.edu/open/SOC/SOCServlet/courseDetails?COURSE=${code}&SEMESTER=${semester}`
}
