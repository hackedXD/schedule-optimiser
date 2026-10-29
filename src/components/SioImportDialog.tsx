import { useEffect, useMemo, useRef, useState } from 'react'
import type { Catalog } from '../engine/index.ts'
import { displayCode, parseSio } from '../engine/index.ts'
import { Icon } from './Icon.tsx'

interface Props {
  open: boolean
  catalog: Catalog
  /** Courses in the current request, offered as targets when the paste has no heading. */
  codes: string[]
  onImport: (code: string, rows: ReturnType<typeof parseSio>['rows']) => void
  onClose: () => void
}

export function SioImportDialog({ open, catalog, codes, onImport, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const [text, setText] = useState('')
  const [target, setTarget] = useState('')
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) { d.showModal(); setText(''); setTarget('') }
    if (!open && d.open) d.close()
  }, [open])
  const parsed = useMemo(() => parseSio(text), [text])
  const code = parsed.code && catalog.courses[parsed.code] ? parsed.code : target
  const course = code ? catalog.courses[code] : undefined
  const labels = new Set(course?.offerings.map((o) => o.label) ?? [])
  const matched = parsed.rows.filter((r) => labels.has(r.label))
  const unmatched = parsed.rows.filter((r) => !labels.has(r.label))
  const withStaff = parsed.rows.filter((r) => r.instructors.length).length
  const canImport = !!code && matched.length > 0
  return (
    <dialog ref={ref} className="course-dialog sio-dialog" onClose={onClose} onClick={(e) => { if (e.target === e.currentTarget) onClose() }} aria-labelledby="sio-dialog-title">
      <div className="dialog-body">
        <header className="dialog-head">
          <h3 id="sio-dialog-title"><span className="code">Import from SIO</span> instructors and rooms for one course</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><Icon name="x" size={14} /></button>
        </header>
        <div className="dialog-scroll" style={{ padding: '12px 16px' }}>
          <p className="help" style={{ margin: '0 0 8px' }}>
            In SIO, open the course, select the whole section table (from the "Course:" heading through the last row), copy, and paste it here. Tabs or plain text both work.
          </p>
          <textarea className="paste" value={text} onChange={(e) => setText(e.target.value)} spellCheck={false} rows={9}
            placeholder={'Course: 15-150 Principles of Functional Programming\nSECTION  MINI  INSTRUCTOR  DELIVERY MODE  BLDG/ROOM  DAY  TIME …\nLec 1  N  Kaynar; Sands  IPE  GHC :: 4401  TR  12:30PM - 01:50PM …'} />
          {text.trim() && (
            <div className="sio-preview">
              {parsed.rows.length === 0 ? (
                <p className="faint">No section rows recognised yet. Each row needs a section label, the Mini flag, and a time like 12:30PM - 01:50PM.</p>
              ) : (
                <>
                  <div className="row-field">
                    <span>Course</span>
                    {parsed.code && catalog.courses[parsed.code] ? (
                      <span>{displayCode(parsed.code)} · {catalog.courses[parsed.code].title}</span>
                    ) : (
                      <select className="select" value={target} onChange={(e) => setTarget(e.target.value)} aria-label="Course these rows belong to">
                        <option value="">Choose the course…</option>
                        {codes.filter((c) => catalog.courses[c]).map((c) => <option key={c} value={c}>{displayCode(c)} · {catalog.courses[c].title}</option>)}
                      </select>
                    )}
                  </div>
                  <p className="help" style={{ margin: '6px 0 0' }}>
                    {parsed.rows.length} rows, {withStaff} with an instructor.
                    {course && <> {matched.length} match {displayCode(code)}'s sections{unmatched.length ? `; ${unmatched.length} unknown here (${unmatched.map((r) => r.label).join(', ')})` : ''}.</>}
                  </p>
                  <div className="sio-rows">
                    {parsed.rows.slice(0, 40).map((r) => (
                      <div className="sio-row" key={r.label}>
                        <span className={labels.has(r.label) ? '' : 'faint'}>{r.label}</span>
                        <span className="faint">{r.days} {r.start}–{r.end}</span>
                        <span>{r.instructors.join(', ') || <span className="faint">no instructor</span>}</span>
                        <span className="faint">{r.building ? `${r.building} ${r.room ?? ''}` : ''}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        <footer className="dialog-foot">
          <span className="faint">Stays in this browser only</span>
          <span style={{ display: 'flex', gap: 6 }}>
            <button className="btn sm" onClick={onClose}>Cancel</button>
            <button className="btn sm primary" disabled={!canImport} onClick={() => { onImport(code, matched); onClose() }}><Icon name="check" size={12} /> Import {matched.length ? `${matched.length} rows` : ''}</button>
          </span>
        </footer>
      </div>
    </dialog>
  )
}
