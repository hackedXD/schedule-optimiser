import type { CriterionId, RankedSchedule, Scores } from '../engine/index.ts'
import { CRITERIA, formatClock, formatDuration } from '../engine/index.ts'
import { Icon } from './Icon.tsx'

export function formatScore(id: CriterionId, s: Scores): { text: string; none: boolean; sub?: string } {
  switch (id) {
    case 'fce': return s.fce === null ? { text: '—', none: true } : { text: s.fce.toFixed(2), none: false, sub: `${s.rated}/${s.slots}` }
    case 'start': return { text: formatClock(Math.round(s.start)), none: false }
    case 'gap': return s.gap === Infinity ? { text: 'none', none: true } : { text: formatDuration(s.gap), none: false }
    case 'end': return { text: formatClock(Math.round(s.end)), none: false }
  }
}

interface Props {
  schedule: RankedSchedule | null
  total: number
  order: CriterionId[]
  onStep: (delta: number) => void
}

export function RankHead({ schedule, total, order, onStep }: Props) {
  return (
    <div className="rank-head">
      <div className="rank num">
        {schedule ? (<><span>#{schedule.rank}</span><span className="of">of {total.toLocaleString()}</span></>) : <span className="faint">No schedule</span>}
      </div>
      <div className="nav">
        <button className="icon-btn" title="Previous (↑)" aria-label="Previous schedule" disabled={!schedule || schedule.rank <= 1} onClick={() => onStep(-1)}><Icon name="chevronLeft" size={14} /></button>
        <button className="icon-btn" title="Next (↓)" aria-label="Next schedule" disabled={!schedule || schedule.rank >= total} onClick={() => onStep(1)}><Icon name="chevronRight" size={14} /></button>
      </div>
      <div className="readouts">
        {order.map((id, i) => {
          const c = CRITERIA.find((x) => x.id === id)!
          const v = schedule ? formatScore(id, schedule.scores) : { text: '—', none: true }
          const title = id === 'fce' ? (schedule && schedule.scores.rated ? `Mean manual FCE rating: ${schedule.scores.rated} of ${schedule.scores.slots} sections rated, the rest neutral` : 'Mean manual FCE rating over sections (none rated yet)') : id === 'start' ? 'Mean first-class start across days with classes' : id === 'gap' ? 'Shortest break between consecutive classes in the week' : 'Mean last-class end across days with classes'
          return (
            <div className={`readout${i === 0 ? ' lead' : ''}`} key={id} title={title}>
              <span className="k"><span className="pri num">{i + 1}</span>{c.short}</span>
              <span className={`v num${v.none ? ' none' : ''}`}>{v.text}{v.sub && <span className="sub">{v.sub}</span>}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
