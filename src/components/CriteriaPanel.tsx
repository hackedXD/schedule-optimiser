import { useState } from 'react'
import type { CriterionId } from '../engine/index.ts'
import { CRITERIA } from '../engine/index.ts'
import { Icon } from './Icon.tsx'

interface Props {
  order: CriterionId[]
  onChange: (order: CriterionId[]) => void
  pittsburghOnly: boolean
  includeMini: boolean
  onToggle: (key: 'pittsburghOnly' | 'includeMini') => void
}

function move(order: CriterionId[], from: number, to: number): CriterionId[] {
  if (to < 0 || to >= order.length || from === to) return order
  const next = [...order]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

export function CriteriaPanel({ order, onChange, pittsburghOnly, includeMini, onToggle }: Props) {
  const [dragging, setDragging] = useState<number | null>(null)
  const [over, setOver] = useState<number | null>(null)
  return (
    <>
      <section className="section">
        <div className="section-head">
          <h2>Ranking</h2>
          <span className="meta">drag to reorder</span>
        </div>
        <div className="criteria" role="list" aria-label="Ranking criteria in priority order">
          {order.map((id, i) => {
            const c = CRITERIA.find((x) => x.id === id)!
            return (
              <div key={id} role="listitem" className={`criterion${dragging === i ? ' dragging' : ''}${over === i && dragging !== null && dragging !== i ? ' over' : ''}`}
                draggable onDragStart={(e) => { setDragging(i); e.dataTransfer.effectAllowed = 'move' }}
                onDragOver={(e) => { e.preventDefault(); setOver(i) }}
                onDragLeave={() => setOver(null)}
                onDrop={(e) => { e.preventDefault(); if (dragging !== null) onChange(move(order, dragging, i)); setDragging(null); setOver(null) }}
                onDragEnd={() => { setDragging(null); setOver(null) }}>
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
        <p className="sans faint" style={{ margin: '10px 0 0', fontSize: 11, lineHeight: 1.5 }}>
          Strict priority: schedules are compared on the first criterion; near-ties fall through to the next. Unrated sections count as neutral.
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
