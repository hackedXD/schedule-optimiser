/** Staffing for the planned semester: who teaches each lecture and section, and where. Comes only from an SIO import. */
export interface Staffed { instructors: string[]; building: string | null; room: string | null }
export interface Staffing {
  /** Where it came from, e.g. 'SIO · Spring 2027'. */
  term: string
  lectures: Record<string, Staffed>
  sections: Record<string, Staffed>
}

/** Staffing built from rows pasted out of SIO for the planned semester. */
export function staffingFromSio(rows: { label: string; instructors: string[]; building: string | null; room: string | null }[], term: string): Staffing {
  const lectures: Record<string, Staffed> = {}
  const sections: Record<string, Staffed> = {}
  for (const r of rows) {
    const st: Staffed = { instructors: r.instructors, building: r.building, room: r.room }
    if (/^lec/i.test(r.label)) lectures[r.label] = st
    else sections[r.label] = st
  }
  return { term, lectures, sections }
}

/** Upper-cased surname, the part every source agrees on: 'KAYNAR, ZELIHA DILSUN' / 'Kaynar, Zeliha' / 'Kaynar' -> 'KAYNAR'. */
export function surnameKey(name: string): string {
  return name.split(/[,;]/)[0].trim().toUpperCase()
}

/** Surname -> labels (lectures and sections) that person teaches. */
export function taughtBy(st: Staffing): Record<string, string[]> {
  const out: Record<string, string[]> = {}
  for (const group of [st.lectures, st.sections]) for (const [label, s] of Object.entries(group)) for (const i of s.instructors) (out[surnameKey(i)] ??= []).push(label)
  return out
}

/** 'Erdmann, Michael' -> 'Michael Erdmann'; 'Kaynar' stays. */
export function staffName(raw: string): string {
  const [last, first] = raw.split(',').map((s) => s.trim())
  return first ? `${first} ${last}` : raw
}
