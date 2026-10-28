import type { Catalog, Day, RankedSchedule } from '../engine/index.ts'
import { DAY_SHORT, WEEKDAYS, dayBlocks, displayCode, formatClock } from '../engine/index.ts'

interface Props {
  schedule: RankedSchedule | null
  catalog: Catalog
  colorOf: (code: string) => { fg: string; bg: string; border: string }
}

export function WeekGrid({ schedule, catalog, colorOf }: Props) {
  const blocks = schedule ? dayBlocks(schedule) : []
  const extraDays = (['S', 'U'] as Day[]).filter((d) => blocks.some((b) => b.day === d))
  const days: Day[] = [...(extraDays.includes('U') ? (['U'] as Day[]) : []), ...WEEKDAYS, ...(extraDays.includes('S') ? (['S'] as Day[]) : [])]
  const earliest = Math.min(8 * 60, ...blocks.map((b) => b.start))
  const latest = Math.max(21 * 60, ...blocks.map((b) => b.end))
  const startH = Math.floor(earliest / 60)
  const endH = Math.ceil(latest / 60)
  const span = (endH - startH) * 60
  const pct = (min: number) => ((min - startH * 60) / span) * 100
  const hours = Array.from({ length: endH - startH + 1 }, (_, i) => startH + i)

  return (
    <div className="week" style={{ '--days': days.length } as React.CSSProperties} role="region" aria-label={schedule ? `Weekly grid for schedule ${schedule.rank}` : 'Empty weekly grid'}>
      <div className="corner" />
      {days.map((d) => <div className="dayhead" key={d}>{DAY_SHORT[d]}</div>)}
      <div className="axis">
        {hours.map((h) => h !== startH && h !== endH && <span className="h" key={h} style={{ top: `${pct(h * 60)}%` }}>{formatClock(h * 60, { compact: true })}</span>)}
      </div>
      {days.map((d) => (
        <div className="day" key={d}>
          {hours.map((h) => h !== startH && h !== endH && <div className="rule" key={h} style={{ top: `${pct(h * 60)}%` }} />)}
          {blocks.filter((b) => b.day === d).map((b, i) => {
            const o = b.slot.offerings[0]
            const c = colorOf(o.course)
            const short = b.end - b.start < 45
            const long = b.end - b.start >= 75
            const course = catalog.courses[o.course]
            return (
              <div key={`${o.id}-${i}`} className={`block${short ? ' short' : ''}${b.slot.mini ? ' mini' : ''}`} data-mini={b.slot.mini ? `m${b.slot.mini}` : undefined}
                style={{ top: `calc(${pct(b.start)}% + 1px)`, height: `calc(${pct(b.end) - pct(b.start)}% - 2px)`, '--c-fg': c.fg, '--c-bg': c.bg, '--c-border': c.border } as React.CSSProperties}
                title={`${displayCode(o.course)} ${o.label} · ${formatClock(b.start)}–${formatClock(b.end)}${course ? ` · ${course.title}` : ''}`}>
                <div className="code"><span>{displayCode(o.course)}</span><span className="lbl">{b.slot.kind === 'section' ? `Sec ${b.slot.offerings.map((x) => x.label).join('/')}` : o.label}</span></div>
                <div className="time">{formatClock(b.start)}–{formatClock(b.end)}</div>
                {course && long && <div className="title">{course.title}</div>}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
