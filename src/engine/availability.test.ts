import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { parseSocHtml } from './parseSoc.ts'
import { planAvailability, compareVectors, seatWeight } from './availability.ts'
import { solve } from './solve.ts'
import type { Request } from './types.ts'

const catalog = parseSocHtml(readFileSync('cmu-schedule-of-classes.html', 'latin1'))
const base: Request = { required: [], groups: [], excluded: [], pinned: [], locations: ['Pittsburgh, Pennsylvania'], includeMini: true }

describe('availability planning', () => {
  it('keeps the hard course open and commits only the easy ones', () => {
    const req: Request = { ...base, required: ['15122', '18100'] }
    const r = planAvailability(catalog, req, {}, {}, { '15122': 1 })
    expect(r.hardOrder).toEqual(['15122'])
    expect(r.plans.length).toBeGreaterThan(0)
    const p = r.plans[0]
    expect(p.fixed.every((s) => s.course === '18100')).toBe(true)
    expect(p.open).toHaveLength(1)
    expect(p.open[0].key).toBe('15122')
    expect(p.open[0].options.length).toBeGreaterThan(0)
    expect(p.open[0].options.length).toBeLessThanOrEqual(p.open[0].total)
    // Every open option really fits the fixed picks.
    const full = solve(catalog, req, {})
    for (const o of p.open[0].options) {
      const ids = new Set([...p.fixed, ...o.slots].flatMap((s) => s.offerings.map((x) => x.id)))
      expect(full.schedules.some((s) => s.slots.every((sl) => sl.offerings.some((x) => ids.has(x.id))))).toBe(true)
    }
    // Sorted by vector, the best plan keeps at least as many options as any other.
    const sorted = [...r.plans].sort((a, b) => compareVectors(a.vector, b.vector))
    expect(sorted[0].vector[0]).toBe(Math.max(...r.plans.map((x) => x.vector[0])))
  })
  it('a second hard course is scored by its guaranteed (worst-case) options', () => {
    const req: Request = { ...base, required: ['15122', '21241', '18100'] }
    const r = planAvailability(catalog, req, {}, {}, { '15122': 2, '21241': 1 })
    expect(r.hardOrder).toEqual(['15122', '21241'])
    const p = r.plans[0]
    expect(p.open.map((o) => o.key)).toEqual(['15122', '21241'])
    expect(p.open[1].guaranteed).toBeLessThanOrEqual(p.open[1].best)
    expect(p.vector).toHaveLength(2)
    expect(p.preferred.slots.length).toBeGreaterThan(p.fixed.length)
  })
  it('with nothing hard, a plan is just a schedule', () => {
    const r = planAvailability(catalog, { ...base, required: ['21241', '18213'] }, {}, {}, {})
    expect(r.hardOrder).toEqual([])
    expect(r.plans.length).toBe(solve(catalog, { ...base, required: ['21241', '18213'] }, {}).schedules.length)
    expect(r.plans[0].open).toEqual([])
  })
  it('a flexible Equal group is one tier whose options span all its courses', () => {
    const req: Request = { ...base, required: ['21241'], groups: [{ id: 'g', pick: 1, options: ['17200', '10335', '73102'], flexible: true }] }
    const r = planAvailability(catalog, req, {}, {}, {})
    expect(r.hardOrder).toEqual(['g'])
    const p = r.plans[0]
    expect(p.fixed.every((s) => s.course === '21241')).toBe(true)
    expect(p.open[0].courses.sort()).toEqual(['10335', '17200', '73102'])
    expect(new Set(p.open[0].options.map((o) => o.course)).size).toBeGreaterThan(1)
    expect(p.open[0].label).toBe('pick 1 of 3')
    expect(p.preferred.courses).toHaveLength(2)
    expect(p.courses.sort()).toEqual(['10335', '17200', '21241', '73102'])
    // A ranked group is never flexible.
    const ranked = planAvailability(catalog, { ...req, groups: [{ ...req.groups[0], ranked: true }] }, {}, {}, {})
    expect(ranked.hardOrder).toEqual([])
  })
  it('seat weights favour open seats', () => {
    expect(seatWeight({ state: 'available' })).toBe(1)
    expect(seatWeight({ state: 'waitlist' })).toBe(0.5)
    expect(seatWeight({ state: 'closed' })).toBeLessThan(0.5)
    expect(seatWeight(undefined)).toBe(1)
    const req: Request = { ...base, required: ['15122', '18100'] }
    const r = planAvailability(catalog, req, {}, {}, { '15122': 1 }, (id) => (id.endsWith(':A') ? { state: 'closed' } : { state: 'available' }))
    expect(r.plans[0].open[0].guaranteed).toBeLessThan(r.plans[0].open[0].options.length)
  })
})
