import { useEffect, useRef } from 'react'
import type { Catalog, CourseDetail, FceRecord, Ratings, Slot } from '../engine/index.ts'
import { FceHistory, type FceStatus } from './FceHistory.tsx'
import { detailUrl, displayCode, formatMeeting } from '../engine/index.ts'
import { About, RatingInput, type DetailStatus } from './CoursePanel.tsx'
import { Icon } from './Icon.tsx'

interface Props {
  code: string | null
  catalog: Catalog
  /** The slot clicked (lecture or section) and any sibling slot for the same course in the schedule. */
  slots: Slot[]
  detail: CourseDetail | undefined
  status: DetailStatus
  semester: string | null
  color: { fg: string }
  ratings: Ratings
  onRate: (key: string, value: number | undefined) => void
  fces: FceRecord[] | undefined
  fceStatus: FceStatus
  onClose: () => void
}

export function CourseDialog({ code, catalog, slots, detail, status, semester, color, ratings, onRate, fces, fceStatus, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (code && !d.open) d.showModal()
    if (!code && d.open) d.close()
  }, [code])
  const course = code ? catalog.courses[code] : undefined
  return (
    <dialog ref={ref} className="course-dialog" onClose={onClose} onClick={(e) => { if (e.target === e.currentTarget) onClose() }} aria-labelledby="course-dialog-title">
      {code && (
        <div className="dialog-body">
          <header className="dialog-head">
            <span className="swatch" style={{ background: color.fg }} />
            <h3 id="course-dialog-title"><span className="code">{displayCode(code)}</span> {course?.title ?? detail?.title ?? ''}</h3>
            <button className="icon-btn" onClick={onClose} aria-label="Close"><Icon name="x" size={14} /></button>
          </header>
          <div className="dialog-scroll">
          {course && (
            <dl className="dialog-meta">
              <dt>Units</dt><dd>{course.units}</dd>
              <dt>Dept</dt><dd>{course.department}</dd>
              <dt>FCE</dt>
              <dd className="rate-row">
                <span>Whole course</span>
                <RatingInput value={ratings[code]} title={`FCE rating for all of ${displayCode(code)}`} onChange={(v) => onRate(code, v)} />
              </dd>
              {slots.map((sl) => (
                <span key={sl.offerings[0].id} style={{ display: 'contents' }}>
                  <dt>{sl.kind === 'lecture' ? 'Lecture' : 'Section'}</dt>
                  <dd className="rate-row">
                    <span>{sl.offerings.map((o) => o.label).join(' / ')} · {sl.meetings.map(formatMeeting).join(' · ')}{sl.mini ? ` · mini ${sl.mini}` : ''}</span>
                    <RatingInput value={ratings[sl.offerings[0].id]} title={`FCE rating for ${displayCode(code)} ${sl.offerings[0].label}`}
                      onChange={(v) => { for (const o of sl.offerings) onRate(o.id, v) }} />
                  </dd>
                </span>
              ))}
            </dl>
          )}
          <FceHistory records={fces} status={fceStatus} current={ratings[code]} onApply={(v) => onRate(code, v)} />
          <About detail={detail} status={status} code={code} semester={semester} />
          </div>
          <footer className="dialog-foot">
            <span className="faint">Esc to close</span>
            {semester && <a className="btn sm" href={detailUrl(code, semester)} target="_blank" rel="noreferrer"><Icon name="external" size={12} /> Open on SOC</a>}
          </footer>
        </div>
      )}
    </dialog>
  )
}
