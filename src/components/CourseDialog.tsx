import { useEffect, useRef } from 'react'
import type { Catalog, CourseDetail, Slot } from '../engine/index.ts'
import { detailUrl, displayCode, formatMeeting } from '../engine/index.ts'
import { About, type DetailStatus } from './CoursePanel.tsx'
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
  onClose: () => void
}

export function CourseDialog({ code, catalog, slots, detail, status, semester, color, onClose }: Props) {
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
          {course && (
            <dl className="dialog-meta">
              <dt>Units</dt><dd>{course.units}</dd>
              <dt>Dept</dt><dd>{course.department}</dd>
              {slots.map((sl) => (
                <span key={sl.offerings[0].id} style={{ display: 'contents' }}>
                  <dt>{sl.kind === 'lecture' ? 'Lecture' : 'Section'}</dt>
                  <dd>{sl.offerings.map((o) => o.label).join(' / ')} · {sl.meetings.map(formatMeeting).join(' · ')}{sl.mini ? ` · mini ${sl.mini}` : ''}</dd>
                </span>
              ))}
            </dl>
          )}
          <About detail={detail} status={status} code={code} semester={semester} />
          <footer className="dialog-foot">
            <span className="faint">Esc to close</span>
            {semester && <a className="btn sm" href={detailUrl(code, semester)} target="_blank" rel="noreferrer"><Icon name="external" size={12} /> Open on SOC</a>}
          </footer>
        </div>
      )}
    </dialog>
  )
}
