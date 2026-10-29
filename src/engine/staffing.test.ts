import { describe, it, expect } from 'vitest'
import { staffingFromSio, surnameKey, taughtBy, staffName } from './staffing.ts'

describe('staffing', () => {
  it('builds staffing from SIO rows and maps surnames to what they teach', () => {
    const st = staffingFromSio([
      { label: 'Lec 1', instructors: ['Kaynar', 'Sands'], building: 'GHC', room: '4401' },
      { label: 'A', instructors: ['Kaynar', 'Sands'], building: 'GHC', room: '5208' },
      { label: 'B', instructors: ['Grodin'], building: null, room: null },
    ], 'SIO · Spring 2027')
    expect(Object.keys(st.lectures)).toEqual(['Lec 1'])
    expect(Object.keys(st.sections)).toEqual(['A', 'B'])
    expect(taughtBy(st)).toEqual({ KAYNAR: ['Lec 1', 'A'], SANDS: ['Lec 1', 'A'], GRODIN: ['B'] })
  })
  it('surname keys agree across sources', () => {
    expect(surnameKey('KAYNAR, ZELIHA DILSUN')).toBe('KAYNAR')
    expect(surnameKey('Kaynar')).toBe('KAYNAR')
    expect(staffName('Erdmann, Michael')).toBe('Michael Erdmann')
  })
})
