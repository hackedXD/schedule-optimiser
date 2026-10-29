import { useEffect, useRef } from 'react'
import type { Catalog, CourseDetail, FceRecord, InstructorFces, Slot, Staffing } from '../engine/index.ts'
import type { FceStatus } from './FceHistory.tsx'
import { detailUrl, displayCode, displayLabel } from '../engine/index.ts'
import { CourseBody, type DetailStatus } from './CoursePanel.tsx'
import type { AppState } from '../state.ts'
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
  state: AppState
  update: (f: (s: AppState) => AppState) => void
  fces: FceRecord[] | undefined
  fceStatus: FceStatus
  counts?: { lectures: number; sections: number; paired?: boolean }
  staffing: Staffing | null
  instructorFces: Record<string, InstructorFces>
  onClose: () => void
}

export function CourseDialog({ code, catalog, slots, detail, status, semester, color, state, update, fces, fceStatus, counts, staffing, instructorFces, onClose }: Props) {
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
              <div className="dialog-meta-line">
                <span>{course.units} units</span><span className="dot" /><span>{course.department}</span>
                {slots.length > 0 && <><span className="dot" /><span>Taking {slots.map((sl) => (sl.kind === 'lecture' ? displayLabel(sl.offerings[0].label) : `Sec ${sl.offerings.map((o) => o.label).join('/')}`)).join(' + ')}</span></>}
              </div>
            )}
            {course && (
              <CourseBody code={code} course={course} state={state} update={update} detail={detail} detailStatus={status} semester={semester}
                fces={fces} fceStatus={fceStatus} counts={counts} layout="dialog" staffing={staffing} instructorFces={instructorFces} taking={new Set(slots.flatMap((sl) => sl.offerings.map((o) => o.id)))} />
            )}
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
