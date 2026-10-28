import { useState, type KeyboardEvent } from 'react'
import type { Catalog, ChoiceGroup, Course, CourseDetail, Offering, Ratings } from '../engine/index.ts'
import { displayCode, formatMeeting, formatMeetingCompact, normaliseCode } from '../engine/index.ts'
import { Icon } from './Icon.tsx'
import type { AppState } from '../state.ts'
import { EXAMPLE, newId } from '../state.ts'

interface Props {
  catalog: Catalog
  state: AppState
  update: (f: (s: AppState) => AppState) => void
  colorOf: (code: string) => { fg: string; bg: string; border: string }
  slotCounts: Record<string, { lectures: number; sections: number; paired?: boolean }>
  detailFor: (code: string) => CourseDetail | undefined
  detailStatusFor: (code: string) => 'loading' | 'missing' | 'unavailable' | undefined
}

function About({ detail, status, code }: { detail: CourseDetail | undefined; status: 'loading' | 'missing' | 'unavailable' | undefined; code: string }) {
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
      {detail.description && (
        <>
          <p className={`desc${more || !long ? '' : ' clamp'}`}>{detail.description}</p>
          {long && <button className="more" aria-expanded={more} onClick={() => setMore(!more)}>{more ? 'Show less' : 'Show more'}</button>}
        </>
      )}
      <dl>
        {detail.prerequisites && <><dt>Prereq</dt><dd>{detail.prerequisites}</dd></>}
        {detail.corequisites && <><dt>Coreq</dt><dd>{detail.corequisites}</dd></>}
        {detail.crossListed && <><dt>Cross-listed</dt><dd>{detail.crossListed}</dd></>}
        {detail.notes && <><dt>Notes</dt><dd>{detail.notes}</dd></>}
        {detail.specialPermission && <><dt>Permission</dt><dd>Special permission required</dd></>}
        {detail.urls.length > 0 && <><dt>Links</dt><dd>{detail.urls.map((u) => <a key={u} href={u} target="_blank" rel="noreferrer">{u.replace(/^https?:\/\//, '')}</a>)}</dd></>}
      </dl>
    </div>
  )
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

function CodeInput({ placeholder, onAdd }: { placeholder: string; onAdd: (codes: string[]) => void }) {
  const [text, setText] = useState('')
  const [bad, setBad] = useState<string[]>([])
  const commit = () => {
    const { codes, bad } = parseCodes(text)
    setBad(bad)
    if (codes.length) onAdd(codes)
    setText(bad.join(', '))
  }
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') { e.preventDefault(); commit() } }
  return (
    <div className={`field${bad.length ? ' invalid' : ''}`}>
      <Icon name="plus" size={13} className="faint" />
      <input value={text} placeholder={placeholder} aria-label={placeholder} spellCheck={false}
        onChange={(e) => { setText(e.target.value); if (bad.length) setBad([]) }} onKeyDown={onKey} onBlur={() => { if (text.trim()) commit() }} />
      {bad.length ? <span className="hint" style={{ color: 'var(--danger)' }}>not a course code</span> : text.trim() ? <span className="hint"><Icon name="enter" size={12} /></span> : null}
    </div>
  )
}

function RatingInput({ value, onChange, title }: { value: number | undefined; onChange: (v: number | undefined) => void; title: string }) {
  return (
    <input className="num-input" type="number" min={1} max={5} step={0.1} inputMode="decimal" placeholder="—" title={title} aria-label={title}
      value={value ?? ''} onChange={(e) => { const v = e.target.value === '' ? undefined : Math.min(5, Math.max(1, Number(e.target.value))); onChange(v) }} />
  )
}

function OfferingRow({ o, state, update }: { o: Offering; state: AppState; update: Props['update'] }) {
  const pinned = state.pinned.includes(o.id)
  const excluded = state.excluded.includes(o.id)
  const toggle = (key: 'pinned' | 'excluded', other: 'pinned' | 'excluded') => update((s) => {
    const has = s[key].includes(o.id)
    return { ...s, [key]: has ? s[key].filter((x) => x !== o.id) : [...s[key], o.id], [other]: s[other].filter((x) => x !== o.id) }
  })
  return (
    <div className={`offering${excluded ? ' excluded' : ''}`}>
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

function CourseRow({ code, course, state, update, color, counts, onRemove, detail, detailStatus }: {
  code: string; course: Course | undefined; state: AppState; update: Props['update']
  color: { fg: string }; counts?: { lectures: number; sections: number; paired?: boolean }; onRemove: () => void
  detail: CourseDetail | undefined; detailStatus: 'loading' | 'missing' | 'unavailable' | undefined
}) {
  const [open, setOpen] = useState(false)
  const lectures = course?.offerings.filter((o) => o.kind === 'lecture') ?? []
  const sections = course?.offerings.filter((o) => o.kind === 'section') ?? []
  const noTimes = course && counts && counts.lectures + counts.sections === 0
  const pinnedHere = state.pinned.filter((id) => id.startsWith(`${code}:`)).length
  const excludedHere = state.excluded.filter((id) => id.startsWith(`${code}:`)).length
  return (
    <div className={`course${open ? ' open' : ''}`}>
      <div className="course-row">
        <span className="swatch" style={{ background: course ? color.fg : 'var(--danger)' }} />
        <span className="code">{displayCode(code)}</span>
        {course ? (
          <span className="title sans" title={course.title}>{course.title}</span>
        ) : (
          <span className="title"><span className="tag danger">not in this semester</span></span>
        )}
        <span className="ops">
          {course && (pinnedHere || excludedHere) ? (
            <span className="counts">
              {pinnedHere ? <span className="tag accent">{pinnedHere} pin</span> : null}
              {excludedHere ? <span className="tag" style={{ marginLeft: 4 }}>{excludedHere} out</span> : null}
            </span>
          ) : null}
          {course && noTimes ? <span className="tag warn">no times</span> : null}
          {course && (
            <button className={`icon-btn${open ? ' on' : ''}`} aria-expanded={open} title={`${lectures.length} lecture${lectures.length === 1 ? '' : 's'}, ${sections.length} section${sections.length === 1 ? '' : 's'}: ratings, pin, exclude`} onClick={() => setOpen(!open)}>
              <Icon name={open ? 'chevronDown' : 'chevronRight'} size={13} />
            </button>
          )}
          <button className="icon-btn" title={`Remove ${displayCode(code)}`} onClick={onRemove}><Icon name="x" size={13} /></button>
        </span>
      </div>
      {open && course && (
        <div className="course-detail">
          <About detail={detail} status={detailStatus} code={code} />
          <div className="rate-all">
            <span>Rate all</span>
            <span className="counts">{lectures.length ? `${lectures.length} lec` : ''}{lectures.length && sections.length ? ' · ' : ''}{sections.length ? `${sections.length} sec` : ''}{counts?.paired ? <span className="tag ok" style={{ marginLeft: 6 }} title="Sections are only paired with the lecture SOC lists them under">paired</span> : null}</span>
            <RatingInput value={state.ratings[code]} title={`FCE rating for all of ${displayCode(code)}`}
              onChange={(v) => update((s) => { const r: Ratings = { ...s.ratings }; if (v === undefined) delete r[code]; else r[code] = v; return { ...s, ratings: r } })} />
          </div>
          {lectures.length > 0 && (
            <div className="offering-group"><h4>Lectures</h4>{lectures.map((o) => <OfferingRow key={o.id} o={o} state={state} update={update} />)}</div>
          )}
          {sections.length > 0 && (
            <div className="offering-group"><h4>Sections</h4>{sections.map((o) => <OfferingRow key={o.id} o={o} state={state} update={update} />)}</div>
          )}
        </div>
      )}
    </div>
  )
}

export function CoursePanel({ catalog, state, update, colorOf, slotCounts, detailFor, detailStatusFor }: Props) {
  const addRequired = (codes: string[]) => update((s) => ({ ...s, required: [...new Set([...s.required, ...codes])] }))
  const addGroup = () => update((s) => ({ ...s, groups: [...s.groups, { id: newId(), pick: 1, options: [] }] }))
  const patchGroup = (id: string, f: (g: ChoiceGroup) => ChoiceGroup) => update((s) => ({ ...s, groups: s.groups.map((g) => (g.id === id ? f(g) : g)) }))
  const empty = state.required.length === 0 && state.groups.length === 0

  return (
    <>
      <section className="section">
        <div className="section-head">
          <h2>Courses</h2>
          {empty ? (
            <button className="btn ghost sm" onClick={() => update((s) => ({ ...s, ...EXAMPLE, groups: EXAMPLE.groups.map((g) => ({ ...g, id: newId() })) }))}>Load example</button>
          ) : (
            <button className="btn ghost sm" onClick={() => update((s) => ({ ...s, required: [], groups: [], pinned: [], excluded: [] }))}>Clear</button>
          )}
        </div>
        <div className="course-list">
          {state.required.map((code) => (
            <CourseRow key={code} code={code} course={catalog.courses[code]} state={state} update={update} color={colorOf(code)} counts={slotCounts[code]} detail={detailFor(code)} detailStatus={detailStatusFor(code)}
              onRemove={() => update((s) => ({ ...s, required: s.required.filter((c) => c !== code) }))} />
          ))}
        </div>
        <CodeInput placeholder="Add courses, e.g. 21-241, 18-213" onAdd={addRequired} />
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Pick from</h2>
          <button className="btn ghost sm" onClick={addGroup}><Icon name="plus" size={13} /> Group</button>
        </div>
        {state.groups.length === 0 && <p className="sans faint" style={{ margin: '0 0 4px', fontSize: 11.5, lineHeight: 1.5 }}>A group takes N of its courses, e.g. pick 1 of 17-200, 10-335, 73-102.</p>}
        {state.groups.map((g) => (
          <div className="group" key={g.id}>
            <div className="group-head">
              <span className="pick">
                <span>pick</span>
                <input className="num-input" type="number" min={0} max={Math.max(1, g.options.length)} value={g.pick} aria-label="How many to pick"
                  style={{ width: 40, textAlign: 'center' }} onChange={(e) => patchGroup(g.id, (x) => ({ ...x, pick: Math.max(0, Math.min(x.options.length || 1, Number(e.target.value) || 0)) }))} />
                <span>of {g.options.length}</span>
              </span>
              <span style={{ flex: 1 }} />
              <button className="icon-btn" title="Remove group" onClick={() => update((s) => ({ ...s, groups: s.groups.filter((x) => x.id !== g.id) }))}><Icon name="x" size={13} /></button>
            </div>
            <div className="course-list">
              {g.options.map((code) => (
                <CourseRow key={code} code={code} course={catalog.courses[code]} state={state} update={update} color={colorOf(code)} counts={slotCounts[code]} detail={detailFor(code)} detailStatus={detailStatusFor(code)}
                  onRemove={() => patchGroup(g.id, (x) => ({ ...x, options: x.options.filter((c) => c !== code), pick: Math.min(x.pick, Math.max(0, x.options.length - 1)) }))} />
              ))}
            </div>
            <CodeInput placeholder="Add options" onAdd={(codes) => patchGroup(g.id, (x) => ({ ...x, options: [...new Set([...x.options, ...codes])], pick: x.pick || 1 }))} />
          </div>
        ))}
      </section>
    </>
  )
}
