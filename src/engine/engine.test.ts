import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { parseSocHtml } from './parseSoc.ts'
import { parseClock, formatClock, normaliseCode } from './time.ts'
import { solve, courseSets, slotsConflict } from './solve.ts'
import { rank, score } from './rank.ts'
import type { RankContext, Request, Slot } from './types.ts'
import { defaultBuilding } from '../campus.ts'

const ctx = (ratings: RankContext['ratings'] = {}, extra: Partial<RankContext> = {}): RankContext => ({ ratings, groups: [], buildingOf: () => undefined, dorm: null, ...extra })

const html = readFileSync('cmu-schedule-of-classes.html', 'latin1')
const catalog = parseSocHtml(html)

const base: Request = { required: [], groups: [], excluded: [], pinned: [], locations: ['Pittsburgh, Pennsylvania'], includeMini: true }

describe('time', () => {
  it('parses 12-hour clocks', () => {
    expect(parseClock('12:30PM')).toBe(750)
    expect(parseClock('12:00AM')).toBe(0)
    expect(parseClock('01:50PM')).toBe(830)
    expect(parseClock('08:00AM')).toBe(480)
    expect(formatClock(830)).toBe('1:50 PM')
  })
  it('normalises codes', () => {
    expect(normaliseCode('15-150')).toBe('15150')
    expect(normaliseCode(' 21 241 ')).toBe('21241')
    expect(normaliseCode('1515')).toBeNull()
  })
})

describe('parser', () => {
  it('reads the semester and course count', () => {
    expect(catalog.semester).toBe('Spring 2027')
    expect(Object.keys(catalog.courses).length).toBeGreaterThan(3000)
  })
  it('splits lectures and sections', () => {
    const c = catalog.courses['21241']
    expect(c.title).toBe('Matrices and Linear Transformations')
    expect(c.offerings.filter((o) => o.kind === 'lecture').map((o) => o.label)).toEqual(['Lec 1', 'Lec 2', 'Lec 3'])
    expect(c.offerings.filter((o) => o.kind === 'section')).toHaveLength(12)
    const lec1 = c.offerings[0]
    expect(lec1.meetings[0]).toMatchObject({ days: ['M', 'W', 'F'], start: 540, end: 590 })
  })
  it('attaches continuation rows as extra meetings', () => {
    const multi = Object.values(catalog.courses).flatMap((c) => c.offerings).filter((o) => o.meetings.length > 1)
    expect(multi.length).toBeGreaterThan(50)
  })
  it('flags TBA offerings and mini sections', () => {
    const offs = Object.values(catalog.courses).flatMap((c) => c.offerings)
    expect(offs.filter((o) => o.tba).length).toBeGreaterThan(1000)
    expect(offs.some((o) => o.mini === 3)).toBe(true)
    expect(offs.some((o) => o.mini === 4)).toBe(true)
  })
})

describe('solver', () => {
  it('expands pick-N groups', () => {
    const sets = courseSets({ ...base, required: ['a'], groups: [{ id: 'g', pick: 1, options: ['x', 'y', 'z'] }] })
    expect(sets).toEqual([['a', 'x'], ['a', 'y'], ['a', 'z']])
    const two = courseSets({ ...base, groups: [{ id: 'g', pick: 2, options: ['x', 'y', 'z'] }] })
    expect(two).toHaveLength(3)
  })
  it('detects conflicts and lets opposite minis coexist', () => {
    const mk = (days: string, s: number, e: number, mini: 0 | 3 | 4 = 0): Slot => ({
      course: 'c', kind: 'section', mini, offerings: [], meetings: [{ days: days.split('') as never, start: s, end: e, location: '' }],
    })
    expect(slotsConflict(mk('MW', 600, 650), mk('WF', 640, 700))).toBe(true)
    expect(slotsConflict(mk('MW', 600, 650), mk('WF', 650, 700))).toBe(false)
    expect(slotsConflict(mk('TR', 600, 650), mk('MW', 600, 650))).toBe(false)
    expect(slotsConflict(mk('MW', 600, 650, 3), mk('MW', 600, 650, 4))).toBe(false)
  })
  it('solves the canonical example without conflicts', () => {
    const req: Request = { ...base, required: ['21241', '18213', '15150', '49101'], groups: [{ id: 'g', pick: 1, options: ['17200', '10335', '73102'] }] }
    const res = solve(catalog, req, {})
    expect(res.missing).toEqual([])
    expect(res.unplaceable).toEqual([])
    expect(res.schedules.length).toBeGreaterThan(0)
    expect(res.truncated).toBe(false)
    for (const s of res.schedules) {
      expect(s.courses).toHaveLength(5)
      for (let i = 0; i < s.slots.length; i++) for (let j = i + 1; j < s.slots.length; j++) expect(slotsConflict(s.slots[i], s.slots[j])).toBe(false)
    }
  })
  it('reports missing courses', () => {
    const res = solve(catalog, { ...base, required: ['99999'] }, {})
    expect(res.missing).toEqual(['99999'])
    expect(res.schedules).toEqual([])
  })
})

describe('ranker', () => {
  const req: Request = { ...base, required: ['21241', '18213'] }
  const res = solve(catalog, req, {})
  it('later starts rank first when start leads', () => {
    const r = rank(res.schedules, ['start', 'gap', 'end', 'fce'], ctx())
    for (let i = 1; i < r.length; i++) expect(r[i - 1].scores.start).toBeGreaterThanOrEqual(r[i].scores.start - 15)
  })
  it('earlier ends rank first when end leads', () => {
    const r = rank(res.schedules, ['end', 'start', 'gap', 'fce'], ctx())
    for (let i = 1; i < r.length; i++) expect(r[i - 1].scores.end).toBeLessThanOrEqual(r[i].scores.end + 15)
  })
  it('ratings move schedules and unrated are neutral', () => {
    const lec3 = res.schedules.find((s) => s.slots.some((sl) => sl.offerings[0].id === '21241:Lec 3'))!
    const sc = score(lec3, ctx({ '21241:Lec 3': 5, '21241:Lec 1': 1 }), 3)
    expect(sc.fce).toBeCloseTo(3.5) // (5 + 3 + 3 + 3) / 4 slots
    const r = rank(res.schedules, ['fce', 'start', 'gap', 'end'], ctx({ '21241:Lec 3': 5, '21241:Lec 1': 1 }))
    expect(r[0].slots.some((sl) => sl.offerings[0].id === '21241:Lec 3')).toBe(true)
  })
})

describe('lecture pairing', () => {
  it('treats the detail page\'s "Lec 1" as the export\'s lone "Lec"', () => {
    const req: Request = { ...base, required: ['18213'] }
    const free = solve(catalog, req, {})
    const paired = solve(catalog, req, {}, { '18213': { A: 'Lec 1', B: 'Lec 1', C: 'Lec 1', D: 'Lec 1', E: 'Lec 1' } })
    expect(paired.unplaceable).toEqual([])
    expect(paired.schedules.length).toBe(free.schedules.length)
  })
  it('restricts sections to their listed lecture when a detail page is known', async () => {
    const { parseDetailHtml } = await import('./parseDetail.ts')
    const { readFileSync } = await import('node:fs')
    const d = parseDetailHtml(readFileSync(new URL('./fixtures/detail-15150.html', import.meta.url), 'latin1'))!
    const req: Request = { ...base, required: ['15150'] }
    const free = solve(catalog, req, {})
    const paired = solve(catalog, req, {}, { '15150': d.pairing })
    expect(paired.slotCounts['15150'].paired).toBe(true)
    expect(paired.schedules.length).toBeLessThan(free.schedules.length)
    for (const s of paired.schedules) {
      const lec = s.slots.find((x) => x.kind === 'lecture')!.offerings[0].label
      const sec = s.slots.find((x) => x.kind === 'section')!
      for (const o of sec.offerings) expect(d.pairing[o.label]).toBe(lec)
    }
  })
})

describe('preference and walking', () => {
  const req: Request = { ...base, required: ['21241'], groups: [{ id: 'g', pick: 1, options: ['17200', '10335', '73102'], ranked: true }] }
  const res = solve(catalog, req, {})
  it('ranked groups prefer earlier options', () => {
    const r = rank(res.schedules, ['pref', 'start', 'gap', 'end', 'fce', 'path'], ctx({}, { groups: req.groups }))
    expect(r[0].courses).toContain('17200')
    expect(r[0].scores.pref).toBe(0)
    expect(r[r.length - 1].courses).toContain('73102')
  })
  it('walking is estimated from department buildings and a dorm', () => {
    const r = rank(res.schedules, ['path', 'start', 'gap', 'end', 'fce', 'pref'], ctx({}, { buildingOf: defaultBuilding, dorm: 'MOR' }))
    expect(r[0].scores.path).not.toBeNull()
    for (let i = 1; i < r.length; i++) expect(r[i - 1].scores.path!).toBeLessThanOrEqual(r[i].scores.path! + 250)
    const noDorm = rank(res.schedules, ['path'], ctx({}, { buildingOf: defaultBuilding, dorm: null }))
    expect(noDorm[0].scores.path!).toBeLessThan(r[0].scores.path!)
  })
})
