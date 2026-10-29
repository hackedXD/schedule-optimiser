import { describe, it, expect } from 'vitest'
import { latestStaffing, seasonOf, staffName, type TermSchedule } from './staffing.ts'

const term = (year: string, semester: string, lecInstr: string[], bld: string | null): TermSchedule => ({
  courseID: '15-150', year, semester,
  lectures: [{ name: 'Lec 1', instructors: lecInstr, times: [{ days: [1, 3], begin: '9:00AM', end: '9:50AM', building: bld, room: bld ? '2210' : null }] }],
  sections: [{ name: 'A', lecture: 'Lec 1', instructors: lecInstr, times: [] }],
})

describe('staffing', () => {
  it('prefers the newest same-season term that has instructors', () => {
    const s = latestStaffing([
      term('2027', 'spring', [], null), term('2025', 'fall', ['Brookes, Stephen'], 'GHC'),
      term('2025', 'spring', ['Erdmann, Michael'], 'DH'), term('2024', 'spring', ['Crary, Karl'], 'WEH'),
    ], 'spring')!
    expect(s.term).toBe('Spring 2025')
    expect(s.sameSeason).toBe(true)
    expect(s.lectures['Lec 1']).toEqual({ instructors: ['Erdmann, Michael'], building: 'DH', room: '2210' })
    expect(s.sections.A.instructors).toEqual(['Erdmann, Michael'])
  })
  it('falls back to any season and ignores TBA', () => {
    const s = latestStaffing([term('2025', 'fall', ['Brookes, Stephen'], 'GHC'), term('2026', 'spring', ['TBA'], null)], 'spring')!
    expect(s.term).toBe('Fall 2025')
    expect(s.sameSeason).toBe(false)
    expect(latestStaffing([term('2027', 'spring', [], null)], 'spring')).toBeNull()
  })
  it('helpers', () => {
    expect(seasonOf('Spring 2027')).toBe('spring')
    expect(staffName('Erdmann, Michael')).toBe('Michael Erdmann')
  })
})
