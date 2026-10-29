import type { Catalog, Day, Plan, RankedSchedule } from '../engine/index.ts'
import { DAY_SHORT, WEEKDAYS, dayBlocks, displayCode, formatClock } from '../engine/index.ts'

interface Props {
  schedule: RankedSchedule | null
  catalog: Catalog
  colorOf: (code: string) => { fg: string; bg: string; border: string }
  /** Called with the course code when a block is clicked. */
  onBlockClick?: (course: string) => void
  /** Availability mode: hard courses' open options are drawn as ghosts behind the preferred pick. */
  plan?: Plan | null
}

export function WeekGrid({ schedule, catalog, colorOf, onBlockClick, plan }: Props) {
  const blocks = schedule ? dayBlocks(schedule) : []
  // Ghost blocks: every open option of each hard course, merged by time so identical-time sections share one ghost.
  const ghosts = new Map<string, { day: Day; start: number; end: number; course: string; labels: string[]; weight: number }>()
  if (plan) {
    const preferredIds = new Set(schedule?.slots.flatMap((s) => s.offerings.map((o) => o.id)) ?? [])
    for (const oc of plan.open) for (const opt of oc.options) {
      if (opt.offerings.every((o) => preferredIds.has(o.id))) continue
      for (const sl of opt.slots) for (const m of sl.meetings) for (const d of m.days) {
        const key = `${oc.course}|${d}|${m.start}|${m.end}`
        const label = sl.kind === 'section' ? sl.offerings.map((o) => o.label).join('/') : sl.offerings[0].label
        const g = ghosts.get(key) ?? { day: d, start: m.start, end: m.end, course: oc.course, labels: [], weight: 0 }
        if (!g.labels.includes(label)) g.labels.push(label)
        g.weight = Math.max(g.weight, opt.weight)
        ghosts.set(key, g)
      }
    }
  }
  const ghostList = [...ghosts.values()]
  const extraDays = (['S', 'U'] as Day[]).filter((d) => blocks.some((b) => b.day === d))
  const days: Day[] = [...(extraDays.includes('U') ? (['U'] as Day[]) : []), ...WEEKDAYS, ...(extraDays.includes('S') ? (['S'] as Day[]) : [])]
  const earliest = Math.min(8 * 60, ...blocks.map((b) => b.start), ...ghostList.map((g) => g.start))
  const latest = Math.max(21 * 60, ...blocks.map((b) => b.end), ...ghostList.map((g) => g.end))
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
          {ghostList.filter((g) => g.day === d).map((g) => {
            const c = colorOf(g.course)
            return (
              <div key={`${g.course}-${g.start}-${g.end}`} className="ghost" title={`${displayCode(g.course)} open option${g.labels.length > 1 ? 's' : ''}: ${g.labels.join(', ')} · ${formatClock(g.start)}–${formatClock(g.end)}`}
                style={{ top: `calc(${pct(g.start)}% + 1px)`, height: `calc(${pct(g.end) - pct(g.start)}% - 2px)`, '--c-fg': c.fg, '--c-border': c.border, opacity: 0.45 + 0.55 * g.weight } as React.CSSProperties}>
                <span>{g.labels.length > 3 ? `${g.labels.slice(0, 3).join(' ')} +${g.labels.length - 3}` : g.labels.join(' ')}</span>
              </div>
            )
          })}
          {blocks.filter((b) => b.day === d).map((b, i) => {
            const o = b.slot.offerings[0]
            const c = colorOf(o.course)
            const short = b.end - b.start < 45
            const long = b.end - b.start >= 75
            const course = catalog.courses[o.course]
            return (
              <button key={`${o.id}-${i}`} type="button" className={`block${short ? ' short' : ''}${b.slot.mini ? ' mini' : ''}`} data-mini={b.slot.mini ? `m${b.slot.mini}` : undefined}
                onClick={() => onBlockClick?.(o.course)} aria-label={`${displayCode(o.course)} ${o.label}: show course details`}
                style={{ top: `calc(${pct(b.start)}% + 1px)`, height: `calc(${pct(b.end) - pct(b.start)}% - 2px)`, '--c-fg': c.fg, '--c-bg': c.bg, '--c-border': c.border } as React.CSSProperties}
                title={`${displayCode(o.course)} ${o.label} · ${formatClock(b.start)}–${formatClock(b.end)}${course ? ` · ${course.title}` : ''} — click for details`}>
                <div className="code"><span>{displayCode(o.course)}</span><span className="lbl">{b.slot.kind === 'section' ? `Sec ${b.slot.offerings.map((x) => x.label).join('/')}` : o.label}</span></div>
                <div className="time">{formatClock(b.start)}–{formatClock(b.end)}</div>
                {course && long && <div className="title">{course.title}</div>}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
