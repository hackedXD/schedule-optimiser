import type { FceRecord, InstructorFces, Ratings } from '../engine/index.ts'
import { instructorName, summariseFce, summariseInstructor, surnameKey } from '../engine/index.ts'
import { Icon } from './Icon.tsx'

export type FceStatus = 'loading' | 'unavailable' | undefined

interface Props {
  records: FceRecord[] | undefined
  status: FceStatus
  /** Surname -> labels they teach this semester (from the SIO import). Only these instructors are listed. */
  taught: Record<string, string[]>
  ratings: Ratings
  code: string
  /** Apply an instructor's overall-teaching score to everything they teach. */
  onApply: (value: number, surname: string) => void
  compact?: boolean
  /** Surname -> that instructor's FCEs across every course (used when they have none for this course). */
  general: Record<string, InstructorFces>
}

export function FceHistory({ records, status, taught, ratings, code, onApply, compact, general }: Props) {
  const surnames = Object.keys(taught)
  if (!records) {
    return (
      <div className={`fce-history${compact ? ' compact' : ''}`}>
        <h4>FCE history</h4>
        {status === 'loading' ? <span className="skeleton" style={{ display: 'block', height: 26 }} />
          : status === 'unavailable' ? <p className="faint">FCE history unavailable: run <code>npm run fces</code> or use the dev server.</p>
          : null}
      </div>
    )
  }
  const summary = summariseFce(records)
  const rows = surnames.map((sn) => {
    const here = summary.find((s) => surnameKey(s.instructor) === sn)
    const g = general[sn]
    const elsewhere = here ? [] : (g?.candidates ?? []).map((c) => summariseInstructor(c.records)).filter((x): x is NonNullable<typeof x> => !!x)
    return { surname: sn, labels: taught[sn], here, elsewhere, pending: !here && !g }
  })
  const row = (key: string, surname: string, labels: string[], name: string, teaching: number | null, courseRate: number | null, when: string, title: string, scope: 'here' | 'all') => {
    const applied = teaching !== null && labels.every((l) => ratings[`${code}:${l}`] !== undefined && Math.abs(ratings[`${code}:${l}`] - teaching) < 0.005)
    return (
      <div className={`fce-row${applied ? ' applied' : ''}`} key={key} title={title}>
        <span className="who">
          <span className="name">
            {name}
            <span className="tag accent" style={{ marginLeft: 6 }}>{labels.length > 4 ? `${labels.slice(0, 3).join(', ')} +${labels.length - 3}` : labels.join(', ')}</span>
            {scope === 'all' && <span className="tag" style={{ marginLeft: 4 }} title="No FCEs for this course; score is across every course they have taught">all courses</span>}
          </span>
          <span className="when faint">{when}</span>
        </span>
        <span className="score num" title="Overall teaching rate">{teaching?.toFixed(2) ?? '—'}</span>
        <span className="score sub num" title="Overall course rate">{courseRate?.toFixed(2) ?? '—'}</span>
        <button className={`btn sm${applied ? ' primary' : ''}`} disabled={teaching === null} onClick={(e) => { e.stopPropagation(); if (teaching !== null) onApply(Math.round(teaching * 100) / 100, surname) }}
          title={applied ? `Applied to ${labels.join(', ')}` : teaching !== null ? `Rate ${labels.join(', ')} ${teaching.toFixed(2)}` : 'Nothing to apply'}>
          {applied ? <><Icon name="check" size={12} /> Used</> : 'Use'}
        </button>
      </div>
    )
  }
  return (
    <div className={`fce-history${compact ? ' compact' : ''}`}>
      <h4>FCEs for this semester's instructors <span className="faint">via ScottyLabs · overall teaching, last 3 terms</span></h4>
      <div className="fce-rows">
        {rows.flatMap(({ surname, labels, here, elsewhere, pending }) => {
          if (here) {
            const when = `${here.terms[0]}${here.terms.length > 1 ? ` · ${here.terms.length} terms of this course` : ''}${here.hrsPerWeek !== null ? ` · ${here.hrsPerWeek.toFixed(0)} h/wk` : ''}`
            return [row(surname, surname, labels, instructorName(here.instructor), here.teaching, here.course, when, `${here.terms.length} term${here.terms.length === 1 ? '' : 's'} of this course: ${here.terms.slice(0, 6).join(', ')}${here.terms.length > 6 ? '…' : ''}`, 'here')]
          }
          if (elsewhere.length) {
            return elsewhere.map((g) => row(`${surname}:${g.instructor}`, surname, labels, instructorName(g.instructor), g.teaching, g.course,
              `${g.terms[0]} · ${g.courses.length} course${g.courses.length === 1 ? '' : 's'}: ${g.courses.slice(0, 4).join(', ')}${g.courses.length > 4 ? '…' : ''}`, `Last terms: ${g.terms.slice(0, 6).join('; ')}`, 'all'))
          }
          const pretty = surname.charAt(0) + surname.slice(1).toLowerCase()
          return [row(surname, surname, labels, pretty, null, null, pending ? 'looking up FCEs across all courses…' : 'no FCEs on record anywhere', pending ? 'Fetching' : 'ScottyLabs has no evaluations under this surname', 'all')]
        })}
      </div>
    </div>
  )
}
