import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { parseDetailHtml, semesterCode } from './parseDetail.ts'

const fx = (n: string) => readFileSync(new URL(`./fixtures/detail-${n}.html`, import.meta.url), 'latin1')

describe('parseDetailHtml', () => {
  it('reads title, description, fields and pairing for 15-150', () => {
    const d = parseDetailHtml(fx('15150'))!
    expect(d.code).toBe('15150')
    expect(d.title).toBe('Principles of Functional Programming')
    expect(d.semester).toBe('Spring 2027')
    expect(d.description.startsWith('An introduction to programming based on a "functional" model')).toBe(true)
    expect(d.prerequisites).toBe('(15151 or 21127 or 21128) and (15112)')
    expect(d.corequisites).toBe('')
    expect(d.urls).toEqual(['http://www.csd.cmu.edu', 'http://www.cs.cmu.edu/~15150/'])
    expect(d.specialPermission).toBe(false)
    expect(d.pairing.A).toBe('Lec 1')
    expect(d.pairing.L).toBe('Lec 1')
    expect(d.pairing.M).toBe('Lec 2')
    expect(d.pairing.U).toBe('Lec 2')
  })
  it('pairs three lectures for 21-241 and handles a lecture-less course', () => {
    const d = parseDetailHtml(fx('21241'))!
    expect(Object.values(d.pairing).filter((l) => l === 'Lec 1')).toHaveLength(4)
    expect(d.pairing.E).toBe('Lec 2')
    const s = parseDetailHtml(fx('10335'))!
    expect(s.pairing).toEqual({})
    expect(s.description.startsWith('ARS, the Latin root')).toBe(true)
  })
  it('returns null on the SOC error page', () => {
    expect(parseDetailHtml(fx('error'))).toBeNull()
  })
  it('derives semester codes', () => {
    expect(semesterCode('Spring 2027')).toBe('S27')
    expect(semesterCode('Fall 2026')).toBe('F26')
    expect(semesterCode('nonsense')).toBeNull()
  })
})
