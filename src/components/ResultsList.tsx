import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CriterionId, RankedSchedule } from '../engine/index.ts'
import { CRITERIA, displayCode } from '../engine/index.ts'
import { formatScore, formatScoreCompact } from './RankHead.tsx'

interface Props {
  ranked: RankedSchedule[]
  order: CriterionId[]
  selectedId: string | null
  onSelect: (id: string) => void
  colorOf: (code: string) => { fg: string }
  truncated: boolean
  explored: number
}

const PAGE = 150

export function ResultsList({ ranked, order, selectedId, onSelect, colorOf, truncated }: Props) {
  const [limit, setLimit] = useState(PAGE)
  const listRef = useRef<HTMLDivElement>(null)
  const positions = useRef(new Map<string, number>())
  const [moved, setMoved] = useState<Set<string>>(new Set())
  const orderKey = order.join(',')
  const prevOrder = useRef(orderKey)

  useEffect(() => { setLimit(PAGE) }, [ranked.length])

  // FLIP: animate rows from their previous position when the ranking order changes.
  useLayoutEffect(() => {
    const el = listRef.current
    if (!el) return
    const rows = [...el.querySelectorAll<HTMLElement>('[data-id]')]
    const changed = prevOrder.current !== orderKey
    prevOrder.current = orderKey
    const next = new Map<string, number>()
    const nowMoved = new Set<string>()
    for (const r of rows) {
      const id = r.dataset.id!
      const top = r.getBoundingClientRect().top
      next.set(id, top)
      const before = positions.current.get(id)
      if (changed && before !== undefined && Math.abs(before - top) > 1) {
        nowMoved.add(id)
        if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
          r.animate([{ transform: `translateY(${before - top}px)` }, { transform: 'translateY(0)' }], { duration: 320, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' })
        }
      }
    }
    positions.current = next
    if (changed) setMoved(nowMoved)
  }, [ranked, orderKey, limit])

  useEffect(() => {
    if (!selectedId) return
    const row = listRef.current?.querySelector<HTMLElement>(`[data-id="${CSS.escape(selectedId)}"]`)
    row?.scrollIntoView({ block: 'nearest' })
  }, [selectedId])

  const visible = ranked.slice(0, limit)
  return (
    <>
      <div className="results-head">
        <h2>Schedules</h2>
        <span className="count num">{ranked.length.toLocaleString()}</span>
      </div>
      <div className="results-cols" aria-hidden="true" style={{ gridTemplateColumns: `34px repeat(${order.length}, minmax(0, 1fr))` }}>
        <span />
        {order.map((id, i) => <span className={`c${i === 0 ? ' lead' : ''}`} key={id}>{CRITERIA.find((c) => c.id === id)!.short}</span>)}
      </div>
      <div className="results" ref={listRef} role="listbox" aria-label="Ranked schedules">
        {visible.map((s) => (
          <button key={s.id} data-id={s.id} role="option" aria-selected={s.id === selectedId}
            className={`result${s.id === selectedId ? ' selected' : ''}${moved.has(s.id) ? ' moved' : ''}`} onClick={() => onSelect(s.id)}
            style={{ gridTemplateColumns: `34px repeat(${order.length}, minmax(0, 1fr))` }}>
            <span className="r num">{s.rank}</span>
            {order.map((id, i) => { const v = formatScoreCompact(id, s.scores); const full = formatScore(id, s.scores); return <span key={id} className={`v num${i === 0 ? ' lead' : ''}${v.none ? ' none' : ''}`} title={`${full.text}${full.sub ? ` (${full.sub} rated)` : ''}`}>{v.text}</span> })}
            <span className="codes">
              {s.courses.map((c) => {
                const parts = s.slots.filter((sl) => sl.course === c).sort((a, b) => (a.kind === b.kind ? 0 : a.kind === 'lecture' ? -1 : 1))
                const codes = parts.map((p) => (p.kind === 'lecture' ? p.offerings[0].label.replace('Lec', 'L').replace(' ', '') : p.offerings[0].label)).join('·')
                return <span key={c} title={`${displayCode(c)} ${codes}`}><i className="sw" style={{ background: colorOf(c).fg }} />{codes}</span>
              })}
            </span>
          </button>
        ))}
        {ranked.length > limit && (
          <div className="more"><button className="btn ghost sm" onClick={() => setLimit(limit + PAGE * 2)}>Show {Math.min(PAGE * 2, ranked.length - limit)} more</button></div>
        )}
      </div>
      {truncated && (
        <div className="results-foot"><b>Stopped at {ranked.length.toLocaleString()}.</b> Too many combinations to list them all. Pin a lecture or exclude sections to narrow it.</div>
      )}
    </>
  )
}
