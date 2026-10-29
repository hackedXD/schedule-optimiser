import { describe, it, expect } from 'vitest'
import { parseSio } from './sio.ts'

const tsv = `Course: 15-150 Principles of Functional Programming
23 matches found
SECTION\tMINI\tINSTRUCTOR\tDELIVERY MODE\tBLDG/ROOM\tDAY\tTIME\tCAN I GET IN?\tLOCATION\tSPECIAL PERMISSION\tWAITLIST\tMAX ENROLL\tUNITS\tA/D/W DATES
Lec 1\tN\tKaynar; Sands\tIPE\tGHC :: 4401\tTR\t12:30PM - 01:50PM\t-\tPIT\tN\t-\t0\t12.0\t
A\tN\tKaynar; Sands\tIPE\tGHC :: 5208\tW\t08:00AM - 09:20AM\tWaitlist\tPIT\tN\t0\t20\t12.0\t
B\tN\tKaynar; Sands\tIPE\tGHC :: 5210\tW\t08:00AM - 09:20AM\tWaitlist\tPIT\tN\t0\t20\t12.0\t
Lec 2\tN\tKaynar; Sands\tIPE\tPH :: 100\tTR\t03:30PM - 04:50PM\t-\tPIT\tN\t-\t0\t12.0\t
M\tN\tKaynar; Sands\tIPE\tGHC :: 5208\tW\t08:00AM - 09:20AM\tAvailable\tPIT\tN\t0\t20\t12.0\t
A3\tY\tTBA\tREO\tTBA\tTBA\t12:00PM - 12:50PM\tClosed\tPIT\tY\t0\t5\t6.0\t`

describe('parseSio', () => {
  it('reads the heading and every row from tab-separated text', () => {
    const r = parseSio(tsv)
    expect(r.code).toBe('15150')
    expect(r.title).toBe('Principles of Functional Programming')
    expect(r.rows.map((x) => x.label)).toEqual(['Lec 1', 'A', 'B', 'Lec 2', 'M', 'A3'])
    expect(r.rows[0]).toMatchObject({ instructors: ['Kaynar', 'Sands'], delivery: 'IPE', building: 'GHC', room: '4401', days: 'TR', start: '12:30PM', end: '01:50PM', availability: '-' })
    expect(r.rows[3]).toMatchObject({ building: 'PH', room: '100' })
    expect(r.rows[4].availability).toBe('Available')
    expect(r.rows[5]).toMatchObject({ mini: true, instructors: [], building: null, delivery: 'REO' })
  })
  it('accepts the same table flattened to whitespace, with wrapped cells', () => {
    const flat = tsv.replace(/\t/g, ' ').replace('GHC :: 4401', 'GHC ::\n4401').replace('Kaynar; Sands\tIPE', 'Kaynar;\nSands IPE')
    const r = parseSio(flat)
    expect(r.rows).toHaveLength(6)
    expect(r.rows[0].building).toBe('GHC')
    expect(r.rows[0].room).toBe('4401')
    expect(r.rows[0].instructors).toEqual(['Kaynar', 'Sands'])
  })
  it('returns no rows for unrelated text', () => {
    expect(parseSio('hello world 12:30PM').rows).toEqual([])
  })
})
