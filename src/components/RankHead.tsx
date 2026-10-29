import type { CriterionId, Plan, RankedSchedule, Scores } from '../engine/index.ts'
import { CRITERIA, displayCode, formatClock, formatDuration } from '../engine/index.ts'
import { Icon } from './Icon.tsx'

export function formatScore(id: CriterionId, s: Scores): { text: string; none: boolean; sub?: string } {
  switch (id) {
    case 'fce': return s.fce === null ? { text: '—', none: true } : { text: s.fce.toFixed(2), none: false, sub: `${s.rated}/${s.slots}` }
    case 'start': return { text: formatClock(Math.round(s.start)), none: false }
    case 'gap': return s.gap === Infinity ? { text: 'none', none: true } : { text: formatDuration(s.gap), none: false }
    case 'end': return { text: formatClock(Math.round(s.end)), none: false }
    case 'path': return s.path === null ? { text: '—', none: true } : { text: `${(s.path / 1000).toFixed(1)} km`, none: false }
  }
}

/** Short forms for the results list columns. */
export function formatScoreCompact(id: CriterionId, s: Scores): { text: string; none: boolean } {
  const clock = (m: number) => formatClock(Math.round(m)).replace(':00', '').replace(' AM', 'a').replace(' PM', 'p')
  switch (id) {
    case 'fce': return s.fce === null ? { text: '—', none: true } : { text: s.fce.toFixed(1), none: false }
    case 'start': return { text: clock(s.start), none: false }
    case 'end': return { text: clock(s.end), none: false }
    case 'gap': return s.gap === Infinity ? { text: '—', none: true } : { text: s.gap >= 60 ? `${Math.floor(s.gap / 60)}h${s.gap % 60 ? String(Math.round(s.gap % 60)).padStart(2, '0') : ''}` : `${Math.round(s.gap)}m`, none: false }
    case 'path': return s.path === null ? { text: '—', none: true } : { text: `${(s.path / 1000).toFixed(1)}k`, none: false }
  }
}

export const SCORE_TITLES: Record<CriterionId, string> = {
  fce: 'Mean manual FCE rating over sections; unrated sections count as neutral',
  start: 'Mean first-class start across days with classes',
  gap: 'Shortest break between consecutive classes in the week',
  end: 'Mean last-class end across days with classes',
  path: 'Estimated walking per week between buildings (department estimate unless you set a building), from and to your dorm when set',
}

interface Props {
  schedule: RankedSchedule | null
  total: number
  order: CriterionId[]
  onStep: (delta: number) => void
  plan?: Plan | null
}

export function RankHead({ schedule, total, order, onStep, plan }: Props) {
  return (
    <div className="rank-head">
      <div className="rank num">
        {schedule ? (<><span>#{schedule.rank}</span><span className="of">of {total.toLocaleString()}</span></>) : <span className="faint">No schedule</span>}
      </div>
      <div className="nav">
        <button className="icon-btn" title="Previous (k / ↑)" aria-label="Previous schedule" disabled={!schedule || schedule.rank <= 1} onClick={() => onStep(-1)}><Icon name="chevronLeft" size={14} /></button>
        <button className="icon-btn" title="Next (j / ↓)" aria-label="Next schedule" disabled={!schedule || schedule.rank >= total} onClick={() => onStep(1)}><Icon name="chevronRight" size={14} /></button>
      </div>
      <div className="readouts">
        {plan && plan.open.map((o) => (
          <div className="readout lead open" key={o.course} title={`${displayCode(o.course)}: ${o.guaranteed.toFixed(1)} of ${o.total} lecture+section options guaranteed open${o.best !== o.guaranteed ? `, up to ${o.best.toFixed(1)} depending on harder courses` : ''}`}>
            <span className="k"><span className="pri num">∗</span>OPEN {displayCode(o.course)}</span>
            <span className="v num">{Math.round(o.guaranteed)}<span className="sub">of {o.total}</span></span>
          </div>
        ))}
        {order.map((id, i) => {
          const c = CRITERIA.find((x) => x.id === id)!
          const v = schedule ? formatScore(id, schedule.scores) : { text: '—', none: true }
          return (
            <div className={`readout${i === 0 && !plan ? ' lead' : ''}`} key={id} title={SCORE_TITLES[id]}>
              <span className="k"><span className="pri num">{i + 1}</span>{c.short}</span>
              <span className={`v num${v.none ? ' none' : ''}`}>{v.text}{v.sub && <span className="sub">{v.sub}</span>}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
