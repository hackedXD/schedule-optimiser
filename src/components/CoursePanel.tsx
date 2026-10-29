import { useState, type KeyboardEvent, type MouseEvent } from 'react'
import type { Catalog, ChoiceGroup, Course, CourseDetail, FceRecord, Offering, Ratings } from '../engine/index.ts'
import { FceHistory, type FceStatus } from './FceHistory.tsx'
import { detailUrl, displayCode, formatMeeting, formatMeetingCompact, normaliseCode } from '../engine/index.ts'
import { BUILDINGS, defaultBuilding } from '../campus.ts'
import { Icon } from './Icon.tsx'
import { move, useRowDrag } from './CriteriaPanel.tsx'
import type { AppState } from '../state.ts'
import { EXAMPLE, newId } from '../state.ts'

export type DetailStatus = 'loading' | 'missing' | 'unavailable' | undefined

interface Props {
  catalog: Catalog
  state: AppState
  update: (f: (s: AppState) => AppState) => void
  colorOf: (code: string) => { fg: string; bg: string; border: string }
  slotCounts: Record<string, { lectures: number; sections: number; paired?: boolean }>
  detailFor: (code: string) => CourseDetail | undefined
  detailStatusFor: (code: string) => DetailStatus
  semester: string | null
  expanded: string | null
  onExpand: (code: string | null) => void
  fcesFor: (code: string) => FceRecord[] | undefined
  fceStatusFor: (code: string) => FceStatus
}

function parseCodes(text: string): { codes: string[]; bad: string[] } {
  const codes: string[] = []
  const bad: string[] = []
  for (const tok of text.split(/[\s,;]+/).filter(Boolean)) {
    const c = normaliseCode(tok)
    if (c) codes.push(c)
    else bad.push(tok)
  }
  return { codes, bad }
}

function CodeInput({ placeholder, onAdd, inline, onClose }: { placeholder: string; onAdd: (codes: string[]) => void; inline?: boolean; onClose?: () => void }) {
  const [text, setText] = useState('')
  const [bad, setBad] = useState<string[]>([])
  const commit = () => {
    const { codes, bad } = parseCodes(text)
    setBad(bad)
    if (codes.length) onAdd(codes)
    setText(bad.join(', '))
    if (!bad.length) onClose?.()
  }
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); commit() }
    if (e.key === 'Escape') { setText(''); setBad([]); onClose?.() }
  }
  return (
    <div className={`field${inline ? ' inline' : ''}${bad.length ? ' invalid' : ''}`}>
      <span className="prompt" aria-hidden="true">$</span>
      <input value={text} placeholder={placeholder} aria-label={placeholder} spellCheck={false} autoFocus={inline}
        onChange={(e) => { setText(e.target.value); if (bad.length) setBad([]) }} onKeyDown={onKey} onBlur={() => { if (text.trim()) commit(); else onClose?.() }} />
      {bad.length ? <span className="hint" style={{ color: 'var(--danger)' }}>not a course code</span> : text.trim() ? <span className="hint"><Icon name="enter" size={12} /></span> : null}
    </div>
  )
}

export function RatingInput({ value, onChange, title }: { value: number | undefined; onChange: (v: number | undefined) => void; title: string }) {
  return (
    <input className="num-input" type="number" min={1} max={5} step={0.1} inputMode="decimal" placeholder="—" title={title} aria-label={title}
      value={value ?? ''} onClick={(e) => e.stopPropagation()}
      onChange={(e) => { const v = e.target.value === '' ? undefined : Math.min(5, Math.max(1, Number(e.target.value))); onChange(v) }} />
  )
}

function OfferingRow({ o, state, update, taking }: { o: Offering; state: AppState; update: Props['update']; taking?: boolean }) {
  const pinned = state.pinned.includes(o.id)
  const excluded = state.excluded.includes(o.id)
  const toggle = (key: 'pinned' | 'excluded', other: 'pinned' | 'excluded') => update((s) => {
    const has = s[key].includes(o.id)
    return { ...s, [key]: has ? s[key].filter((x) => x !== o.id) : [...s[key], o.id], [other]: s[other].filter((x) => x !== o.id) }
  })
  return (
    <div className={`offering${excluded ? ' excluded' : ''}${taking ? ' taking' : ''}`} title={taking ? 'In the selected schedule' : undefined}>
      <span className="label">{o.label}{o.mini ? <span className="faint" title={o.mini === 3 ? 'First mini' : 'Second mini'}> m{o.mini}</span> : null}</span>
      <span className={`when${o.tba ? ' tba' : ''}`} title={o.meetings.map(formatMeeting).join(' · ')}>
        {o.tba || !o.meetings.length ? 'TBA' : o.meetings.map(formatMeetingCompact).join(' · ')}
      </span>
      <RatingInput value={state.ratings[o.id]} title={`FCE rating for ${displayCode(o.course)} ${o.label}`}
        onChange={(v) => update((s) => { const r: Ratings = { ...s.ratings }; if (v === undefined) delete r[o.id]; else r[o.id] = v; return { ...s, ratings: r } })} />
      <span className="state">
        <button className={`icon-btn${pinned ? ' on' : ''}`} title={pinned ? 'Unpin' : 'Pin: only consider this one'} aria-pressed={pinned} onClick={() => toggle('pinned', 'excluded')} disabled={o.tba}>
          <Icon name="pin" size={13} />
        </button>
        <button className={`icon-btn danger${excluded ? ' on' : ''}`} title={excluded ? 'Include again' : 'Exclude'} aria-pressed={excluded} onClick={() => toggle('excluded', 'pinned')} disabled={o.tba}>
          <Icon name="ban" size={13} />
        </button>
      </span>
    </div>
  )
}

export function About({ detail, status, code, semester }: { detail: CourseDetail | undefined; status: DetailStatus; code: string; semester: string | null }) {
  const [more, setMore] = useState(false)
  if (!detail) {
    return (
      <div className="about">
        {status === 'loading' ? <span className="skeleton" style={{ display: 'block', height: 30 }} />
          : status === 'missing' ? <p className="faint">SOC has no detail page for {displayCode(code)}.</p>
          : status === 'unavailable' ? <p className="faint">Description unavailable: run <code>npm run details</code> or use the dev server to fetch it.</p>
          : null}
      </div>
    )
  }
  const long = detail.description.length > 260
  return (
    <div className="about">
      {detail.description && <p className={`desc${more || !long ? '' : ' clamp'}`}>{detail.description}</p>}
      {long && <button className="more" aria-expanded={more} onClick={() => setMore(!more)}>{more ? 'Show less' : 'Show more'}</button>}
      <dl>
        {detail.prerequisites && <><dt>Prereq</dt><dd>{detail.prerequisites}</dd></>}
        {detail.corequisites && <><dt>Coreq</dt><dd>{detail.corequisites}</dd></>}
        {detail.crossListed && <><dt>Cross-listed</dt><dd>{detail.crossListed}</dd></>}
        {detail.notes && <><dt>Notes</dt><dd>{detail.notes}</dd></>}
        {detail.specialPermission && <><dt>Permission</dt><dd>Special permission required</dd></>}
        <dt>Links</dt>
        <dd>
          {semester && <a href={detailUrl(code, semester)} target="_blank" rel="noreferrer">SOC course details</a>}
          {detail.urls.map((u) => <a key={u} href={u} target="_blank" rel="noreferrer">{u.replace(/^https?:\/\//, '')}</a>)}
        </dd>
      </dl>
    </div>
  )
}

interface RowProps {
  code: string; course: Course | undefined; state: AppState; update: Props['update']
  color: { fg: string }; counts?: { lectures: number; sections: number; paired?: boolean }; onRemove: () => void
  detail: CourseDetail | undefined; detailStatus: DetailStatus; semester: string | null
  open: boolean; onToggle: () => void
  fces: FceRecord[] | undefined; fceStatus: FceStatus
  /** Rank badge for options in a ranked group. */
  rank?: number
  dragProps?: Record<string, unknown>
}

function CourseRow({ code, course, state, update, color, counts, onRemove, detail, detailStatus, semester, open, onToggle, fces, fceStatus, rank, dragProps }: RowProps) {
  const noTimes = course && counts && counts.lectures + counts.sections === 0
  const pinnedHere = state.pinned.filter((id) => id.startsWith(`${code}:`)).length
  const excludedHere = state.excluded.filter((id) => id.startsWith(`${code}:`)).length
  const onRowKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (course) onToggle() }
  }
  const stop = (e: MouseEvent) => e.stopPropagation()
  return (
    <div className={`course${open ? ' open' : ''}`}>
      <div className="course-row" role={course ? 'button' : undefined} tabIndex={course ? 0 : undefined} aria-expanded={course ? open : undefined}
        onClick={() => { if (course) onToggle() }} onKeyDown={onRowKey} {...dragProps}>
        {rank !== undefined ? <span className="rank-badge num" title="Preference within this group">{rank}</span> : <span className="swatch" style={{ background: course ? color.fg : 'var(--danger)' }} />}
        <span className="code" style={rank !== undefined ? { color: course ? color.fg : undefined } : undefined}>{displayCode(code)}</span>
        {course ? (
          <span className="title" title={course.title}>{course.title}</span>
        ) : (
          <span className="title"><span className="tag danger">not in this semester</span></span>
        )}
        <span className="ops" onClick={stop}>
          {course && (pinnedHere || excludedHere) ? (
            <span className="counts">
              {pinnedHere ? <span className="tag accent">{pinnedHere} pin</span> : null}
              {excludedHere ? <span className="tag" style={{ marginLeft: 4 }}>{excludedHere} out</span> : null}
            </span>
          ) : null}
          {course && noTimes ? <span className="tag warn">no times</span> : null}
          {course && <span className={`icon-btn chevron${open ? ' on' : ''}`} aria-hidden="true"><Icon name={open ? 'chevronDown' : 'chevronRight'} size={13} /></span>}
          <button className="icon-btn" title={`Remove ${displayCode(code)}`} onClick={onRemove}><Icon name="x" size={13} /></button>
        </span>
      </div>
      {open && course && (
        <CourseBody code={code} course={course} state={state} update={update} detail={detail} detailStatus={detailStatus} semester={semester}
          fces={fces} fceStatus={fceStatus} counts={counts} layout="row" />
      )}
    </div>
  )
}

export interface CourseBodyProps {
  code: string; course: Course; state: AppState; update: Props['update']
  detail: CourseDetail | undefined; detailStatus: DetailStatus; semester: string | null
  fces: FceRecord[] | undefined; fceStatus: FceStatus
  counts?: { lectures: number; sections: number; paired?: boolean }
  /** Offering ids that the selected schedule takes (dialog only). */
  taking?: Set<string>
  /** 'row' keeps FCE history near the top; 'dialog' puts description first and a short FCE list last. */
  layout: 'row' | 'dialog'
}

/** Everything known about a course: description, ratings, building, lectures and sections, FCE history. */
export function CourseBody({ code, course, state, update, detail, detailStatus, semester, fces, fceStatus, counts, taking, layout }: CourseBodyProps) {
  const lectures = course.offerings.filter((o) => o.kind === 'lecture')
  const sections = course.offerings.filter((o) => o.kind === 'section')
  const building = state.buildings[code] ?? defaultBuilding(code)
  const fce = <FceHistory records={fces} status={fceStatus} current={state.ratings[code]} compact={layout === 'dialog'}
    onApply={(v) => update((s) => ({ ...s, ratings: { ...s.ratings, [code]: v } }))} />
  return (
    <div className={`course-detail ${layout}`}>
      <About detail={detail} status={detailStatus} code={code} semester={semester} />
      {layout === 'row' && fce}
      <div className="rate-all">
        <span>Rate all</span>
        <span className="counts">{lectures.length ? `${lectures.length} lec` : ''}{lectures.length && sections.length ? ' · ' : ''}{sections.length ? `${sections.length} sec` : ''}{counts?.paired ? <span className="tag ok" style={{ marginLeft: 6 }} title="Sections are only paired with the lecture SOC lists them under">paired</span> : null}</span>
        <RatingInput value={state.ratings[code]} title={`FCE rating for all of ${displayCode(code)}`}
          onChange={(v) => update((s) => { const r: Ratings = { ...s.ratings }; if (v === undefined) delete r[code]; else r[code] = v; return { ...s, ratings: r } })} />
      </div>
      <label className="row-field" style={{ padding: '0 0 0 8px' }}>
        <span>Building <span className="faint">{state.buildings[code] ? '' : '(estimate)'}</span></span>
        <select className="select" value={building ?? ''} aria-label={`Building for ${displayCode(code)}`}
          onChange={(e) => update((s) => { const b = { ...s.buildings }; if (e.target.value) b[code] = e.target.value; else delete b[code]; return { ...s, buildings: b } })}>
          <option value="">Unknown</option>
          {BUILDINGS.map((b) => <option key={b.code} value={b.code}>{b.code} · {b.name}</option>)}
        </select>
      </label>
      {lectures.length > 0 && (
        <div className="offering-group"><h4>Lectures</h4>{lectures.map((o) => <OfferingRow key={o.id} o={o} state={state} update={update} taking={taking?.has(o.id)} />)}</div>
      )}
      {sections.length > 0 && (
        <div className="offering-group"><h4>Sections</h4>{sections.map((o) => <OfferingRow key={o.id} o={o} state={state} update={update} taking={taking?.has(o.id)} />)}</div>
      )}
      {layout === 'dialog' && fce}
    </div>
  )
}

function Group({ g, index, props, patch, remove }: { g: ChoiceGroup; index: number; props: Props; patch: (f: (g: ChoiceGroup) => ChoiceGroup) => void; remove: () => void }) {
  const { catalog, state, update, colorOf, slotCounts, detailFor, detailStatusFor, semester, expanded, onExpand, fcesFor, fceStatusFor } = props
  const drag = useRowDrag((from, to) => patch((x) => ({ ...x, options: move(x.options, from, to) })))
  const [adding, setAdding] = useState(g.options.length === 0)
  return (
    <div className="group-inline">
      <div className="group-row">
        <span className="bracket" aria-hidden="true">{'{'}</span>
        <span className="pick">
          <span>pick</span>
          <input className="num-input" type="number" min={0} max={Math.max(1, g.options.length)} value={g.pick} aria-label={`How many to pick from group ${index + 1}`}
            style={{ width: 36, textAlign: 'center' }} onChange={(e) => patch((x) => ({ ...x, pick: Math.max(0, Math.min(x.options.length || 1, Number(e.target.value) || 0)) }))} />
          <span>of {g.options.length}</span>
        </span>
        <span className="ops">
          <button className={`btn ghost sm${g.ranked ? ' on' : ''}`} role="switch" aria-checked={!!g.ranked} title={g.ranked ? 'Options are ranked: drag to set preference' : 'Options are equal: click to rank them'}
            onClick={() => patch((x) => ({ ...x, ranked: !x.ranked }))}>
            <Icon name={g.ranked ? 'sliders' : 'equal'} size={12} /> {g.ranked ? 'Ranked' : 'Equal'}
          </button>
          <button className="icon-btn" title="Remove group" onClick={remove}><Icon name="x" size={13} /></button>
        </span>
      </div>
      <div className="group-options">
        {g.options.map((code, i) => (
          <div key={code} className={`drag-row${g.ranked ? drag.cls(i) : ''}`}>
            <CourseRow code={code} course={catalog.courses[code]} state={state} update={update} color={colorOf(code)} counts={slotCounts[code]}
              detail={detailFor(code)} detailStatus={detailStatusFor(code)} semester={semester} fces={fcesFor(code)} fceStatus={fceStatusFor(code)}
              open={expanded === code} onToggle={() => onExpand(expanded === code ? null : code)}
              rank={g.ranked ? i + 1 : undefined} dragProps={g.ranked ? drag.props(i) : undefined}
              onRemove={() => patch((x) => ({ ...x, options: x.options.filter((c) => c !== code), pick: Math.min(x.pick, Math.max(0, x.options.length - 1)) }))} />
          </div>
        ))}
        {adding ? (
          <CodeInput inline placeholder="add options to this group" onClose={() => setAdding(false)}
            onAdd={(codes) => patch((x) => ({ ...x, options: [...new Set([...x.options, ...codes])], pick: x.pick || 1 }))} />
        ) : (
          <button className="ghost-row" onClick={() => setAdding(true)}><Icon name="plus" size={12} /> add option</button>
        )}
      </div>
      <span className="bracket close" aria-hidden="true">{'}'}</span>
    </div>
  )
}

export function CoursePanel(props: Props) {
  const { catalog, state, update, colorOf, slotCounts, detailFor, detailStatusFor, semester, expanded, onExpand, fcesFor, fceStatusFor } = props
  const addRequired = (codes: string[]) => update((s) => ({ ...s, required: [...new Set([...s.required, ...codes])] }))
  const addGroup = () => update((s) => ({ ...s, groups: [...s.groups, { id: newId(), pick: 1, options: [] }] }))
  const patchGroup = (id: string, f: (g: ChoiceGroup) => ChoiceGroup) => update((s) => ({ ...s, groups: s.groups.map((g) => (g.id === id ? f(g) : g)) }))
  const empty = state.required.length === 0 && state.groups.length === 0

  return (
    <section className="section">
      <div className="section-head">
        <h2>Courses</h2>
        <span style={{ display: 'flex', gap: 2 }}>
          {empty ? (
            <button className="btn ghost sm" onClick={() => update((s) => ({ ...s, ...EXAMPLE, groups: EXAMPLE.groups.map((g) => ({ ...g, id: newId() })) }))}>Load example</button>
          ) : (
            <button className="btn ghost sm" onClick={() => update((s) => ({ ...s, required: [], groups: [], pinned: [], excluded: [] }))}>Clear</button>
          )}
          <button className="btn ghost sm" onClick={addGroup} title="Add a pick-N-of group"><Icon name="plus" size={13} /> Group</button>
        </span>
      </div>
      <div className="course-list">
        {state.required.map((code) => (
          <CourseRow key={code} code={code} course={catalog.courses[code]} state={state} update={update} color={colorOf(code)} counts={slotCounts[code]}
            detail={detailFor(code)} detailStatus={detailStatusFor(code)} semester={semester} fces={fcesFor(code)} fceStatus={fceStatusFor(code)}
            open={expanded === code} onToggle={() => onExpand(expanded === code ? null : code)}
            onRemove={() => update((s) => ({ ...s, required: s.required.filter((c) => c !== code) }))} />
        ))}
        {state.groups.map((g, i) => (
          <Group key={g.id} g={g} index={i} props={props} patch={(f) => patchGroup(g.id, f)} remove={() => update((s) => ({ ...s, groups: s.groups.filter((x) => x.id !== g.id) }))} />
        ))}
      </div>
      <CodeInput placeholder="add courses: 21-241, 18-213" onAdd={addRequired} />
      {state.groups.length === 0 && !empty && <p className="help">Need to take one of several? Add a group: it takes N of its courses, and can be Ranked to prefer some over others.</p>}
    </section>
  )
}
