import { useState } from 'react'
import type { CriterionId } from '../engine/index.ts'
import { CRITERIA } from '../engine/index.ts'
import { DORMS } from '../campus.ts'
import { Icon } from './Icon.tsx'

interface Props {
  order: CriterionId[]
  onChange: (order: CriterionId[]) => void
  pittsburghOnly: boolean
  includeMini: boolean
  onToggle: (key: 'pittsburghOnly' | 'includeMini') => void
  dorm: string | null
  onDorm: (dorm: string | null) => void
  availabilityMode: boolean
  hardCount: number
  onAvailabilityMode: (v: boolean) => void
}

export function move<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length || from === to) return list
  const next = [...list]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

/** Shared drag-to-reorder behaviour for a vertical list of rows. */
export function useRowDrag(onMove: (from: number, to: number) => void) {
  const [dragging, setDragging] = useState<number | null>(null)
  const [over, setOver] = useState<number | null>(null)
  const props = (i: number) => ({
    draggable: true,
    onDragStart: (e: React.DragEvent) => { setDragging(i); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(i)) },
    onDragOver: (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; if (over !== i) setOver(i) },
    onDragLeave: () => setOver(null),
    onDrop: (e: React.DragEvent) => { e.preventDefault(); if (dragging !== null) onMove(dragging, i); setDragging(null); setOver(null) },
    onDragEnd: () => { setDragging(null); setOver(null) },
  })
  const cls = (i: number) => `${dragging === i ? ' dragging' : ''}${over === i && dragging !== null && dragging !== i ? ' over' : ''}`
  return { props, cls }
}

export function CriteriaPanel({ order, onChange, pittsburghOnly, includeMini, onToggle, dorm, onDorm, availabilityMode, hardCount, onAvailabilityMode }: Props) {
  const drag = useRowDrag((from, to) => onChange(move(order, from, to)))
  return (
    <>
      <section className="section">
        <div className="section-head">
          <h2>Availability</h2>
          <span className="meta">{hardCount ? `${hardCount} open tier${hardCount === 1 ? '' : 's'}` : 'nothing marked hard or flexible'}</span>
        </div>
        <button className="toggle" style={{ width: '100%' }} role="switch" aria-checked={availabilityMode} onClick={() => onAvailabilityMode(!availabilityMode)}>
          <span>Maximise chances of getting in</span><span className="switch" aria-checked={availabilityMode} />
        </button>
        <p className="help">
          Mark courses as hard to get in their expanded row. With this on, the optimiser commits only to easy courses' sections and keeps every hard course's lecture and section options open, hardest first: plans are ordered by how many options stay open (guaranteed whatever you end up with in harder courses), and only then by the criteria below. An Equal group marked Flexible is one tier: every option's sections stay open and the plan maximises the total open across the group. With an SIO import, open seats count fully, waitlists half, closed sections a little.
        </p>
      </section>
      <section className="section">
        <div className="section-head">
          <h2>Ranking</h2>
          <span className="meta">drag rows to reorder</span>
        </div>
        <div className="criteria" role="list" aria-label="Ranking criteria in priority order">
          {order.map((id, i) => {
            const c = CRITERIA.find((x) => x.id === id)!
            return (
              <div key={id} role="listitem" className={`criterion${drag.cls(i)}`} {...drag.props(i)}>
                <span className="grip"><Icon name="grip" size={14} /></span>
                <span className="n num">{i + 1}</span>
                <span>
                  <div className="name">{c.name}</div>
                  <div className="dir">{c.direction}</div>
                </span>
                <span className="arrows">
                  <button className="icon-btn" title="Move up" aria-label={`Move ${c.name} up`} disabled={i === 0} onClick={() => onChange(move(order, i, i - 1))}><Icon name="up" size={12} /></button>
                  <button className="icon-btn" title="Move down" aria-label={`Move ${c.name} down`} disabled={i === order.length - 1} onClick={() => onChange(move(order, i, i + 1))}><Icon name="down" size={12} /></button>
                </span>
              </div>
            )
          })}
        </div>
        <p className="help">
          Strict priority: schedules are compared on the first criterion; near-ties fall through to the next. Unrated sections count as neutral.
        </p>
      </section>
      <section className="section">
        <div className="section-head"><h2>Walking</h2><span className="meta">estimate</span></div>
        <label className="row-field">
          <span>Start and end the day at</span>
          <select className="select" value={dorm ?? ''} onChange={(e) => onDorm(e.target.value || null)} aria-label="Dorm">
            <option value="">No dorm (classes only)</option>
            {DORMS.map((d) => <option key={d.code} value={d.code}>{d.name}</option>)}
          </select>
        </label>
        <p className="help">
          SOC has not published rooms for this semester, so each course is placed in its department's usual building. Change a course's building in its expanded row.
        </p>
      </section>
      <section className="section">
        <div className="section-head"><h2>Filters</h2></div>
        <button className="toggle" style={{ width: '100%' }} role="switch" aria-checked={pittsburghOnly} onClick={() => onToggle('pittsburghOnly')}>
          <span>Pittsburgh campus only</span><span className="switch" aria-checked={pittsburghOnly} />
        </button>
        <button className="toggle" style={{ width: '100%' }} role="switch" aria-checked={includeMini} onClick={() => onToggle('includeMini')}>
          <span>Include mini-semester sections</span><span className="switch" aria-checked={includeMini} />
        </button>
      </section>
    </>
  )
}
