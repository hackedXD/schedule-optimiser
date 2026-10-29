import { useState } from 'react'
import type { FceRecord } from '../engine/index.ts'
import { instructorName, summariseFce } from '../engine/index.ts'
import { Icon } from './Icon.tsx'

export type FceStatus = 'loading' | 'unavailable' | undefined

interface Props {
  records: FceRecord[] | undefined
  status: FceStatus
  /** The rating currently applied to this course (course-level). */
  current: number | undefined
  /** Apply an instructor's overall-teaching score as the rating. */
  onApply: (value: number, instructor: string) => void
  /** Shorter list in a scroll box (dialog). */
  compact?: boolean
}

const RECENT_YEARS = 3

export function FceHistory({ records, status, current, onApply, compact }: Props) {
  const [all, setAll] = useState(false)
  if (!records) {
    return (
      <div className="fce-history">
        <h4>FCE history</h4>
        {status === 'loading' ? <span className="skeleton" style={{ display: 'block', height: 26 }} />
          : status === 'unavailable' ? <p className="faint">FCE history unavailable: run <code>npm run fces</code> or use the dev server.</p>
          : null}
      </div>
    )
  }
  const summary = summariseFce(records)
  if (summary.length === 0) return <div className="fce-history"><h4>FCE history</h4><p className="faint">No FCE results on record for this course.</p></div>
  const cutoff = summary[0].lastYear - RECENT_YEARS
  const recent = summary.filter((s) => s.lastYear >= cutoff)
  const shown = all ? summary : recent
  return (
    <div className={`fce-history${compact ? ' compact' : ''}`}>
      <h4>FCE history <span className="faint">via ScottyLabs · overall teaching, last 3 terms</span></h4>
      <div className="fce-rows">
        {shown.map((s) => {
          const applied = s.teaching !== null && current !== undefined && Math.abs(current - s.teaching) < 0.005
          return (
            <div className={`fce-row${applied ? ' applied' : ''}`} key={s.instructor} title={`${s.terms.length} term${s.terms.length === 1 ? '' : 's'}: ${s.terms.slice(0, 6).join(', ')}${s.terms.length > 6 ? '…' : ''}`}>
              <span className="who">
                <span className="name">{instructorName(s.instructor)}</span>
                <span className="when faint">{s.terms[0]}{s.terms.length > 1 ? ` · ${s.terms.length} terms` : ''}{s.hrsPerWeek !== null ? ` · ${s.hrsPerWeek.toFixed(0)} h/wk` : ''}</span>
              </span>
              <span className="score num" title="Overall teaching rate">{s.teaching?.toFixed(2) ?? '—'}</span>
              <span className="score sub num" title="Overall course rate">{s.course?.toFixed(2) ?? '—'}</span>
              <button className={`btn sm${applied ? ' primary' : ''}`} disabled={s.teaching === null} onClick={(e) => { e.stopPropagation(); if (s.teaching !== null) onApply(Math.round(s.teaching * 100) / 100, s.instructor) }}
                title={applied ? 'This rating is applied to the course' : `Use ${s.teaching?.toFixed(2)} as this course's FCE rating`}>
                {applied ? <><Icon name="check" size={12} /> Used</> : 'Use'}
              </button>
            </div>
          )
        })}
      </div>
      {summary.length > recent.length && (
        <button className="more" onClick={() => setAll(!all)}>{all ? `Show recent only` : `Show all ${summary.length} instructors`}</button>
      )}
    </div>
  )
}
