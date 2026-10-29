import { describe, it, expect } from 'vitest'
import { summariseFce, instructorName, fceUrl, type FceRecord } from './fce.ts'

const rec = (instructor: string, semester: string, year: string, teaching: number, course: number, hrs = 10): FceRecord => ({
  courseID: '15-150', instructor, andrewID: null, semester, year, hrsPerWeek: hrs, numRespondents: 50, possibleRespondents: 100,
  rating: [4, 4, 4, 4, 4, 4, 4, teaching, course],
})

describe('fce', () => {
  it('summarises per instructor over recent terms, newest first', () => {
    const s = summariseFce([
      rec('A, X', 'fall', '2019', 2.0, 2.0), rec('A, X', 'fall', '2024', 4.0, 4.2), rec('A, X', 'fall', '2025', 4.4, 4.6),
      rec('B, Y', 'spring', '2025', 3.5, 3.6),
    ], 2)
    expect(s.map((x) => x.instructor)).toEqual(['A, X', 'B, Y'])
    expect(s[0].teaching).toBeCloseTo(4.2)
    expect(s[0].course).toBeCloseTo(4.4)
    expect(s[0].terms[0]).toBe('Fall 2025')
    expect(s[0].terms).toHaveLength(3)
    expect(s[0].respondents).toBe(100)
  })
  it('formats names and urls', () => {
    expect(instructorName('KAYNAR, ZELIHA DILSUN')).toBe('Zeliha Dilsun Kaynar')
    expect(instructorName("O'BRIEN, MARY-ANN")).toBe("Mary-Ann O'Brien")
    expect(fceUrl('15150')).toBe('https://course.apis.scottylabs.org/fces?courseID=15-150')
  })
})
