import { useEffect, useState } from 'react'
import type { Plan, RankedSchedule } from '../engine/index.ts'
import { displayCode } from '../engine/index.ts'
import { Icon } from './Icon.tsx'

interface Props {
  schedule: RankedSchedule | null
  colorOf: (code: string) => { fg: string }
  plan?: Plan | null
}

export function registerLines(s: RankedSchedule): { course: string; parts: { kind: 'lecture' | 'section'; labels: string[] }[] }[] {
  return s.courses.map((course) => ({
    course,
    parts: s.slots.filter((sl) => sl.course === course).sort((a, b) => (a.kind === b.kind ? 0 : a.kind === 'lecture' ? -1 : 1)).map((sl) => ({ kind: sl.kind, labels: sl.offerings.map((o) => o.label) })),
  }))
}

export function Register({ schedule, colorOf, plan }: Props) {
  const [copied, setCopied] = useState(false)
  useEffect(() => { if (!copied) return; const t = setTimeout(() => setCopied(false), 1600); return () => clearTimeout(t) }, [copied])
  if (!schedule) return <div className="register"><span className="label">Register</span><span className="faint">Pick a schedule to see its codes</span></div>
  const openCourses = new Set(plan?.open.map((o) => o.course) ?? [])
  const lines = registerLines(schedule).filter((l) => !openCourses.has(l.course))
  const optionText = (opt: Plan['open'][number]['options'][number]) => opt.offerings.map((o) => (o.kind === 'lecture' ? o.label.replace('Lec ', 'L').replace('Lec', 'L') : o.label)).join('+')
  const seatTag = (opt: Plan['open'][number]['options'][number]) => opt.seat?.state === 'available' ? 'open' : opt.seat?.state === 'waitlist' ? `wait${opt.seat.waitlist != null ? ' ' + opt.seat.waitlist : ''}` : opt.seat?.state === 'closed' ? 'closed' : ''
  const openLines = (plan?.open ?? []).map((oc) => ({ course: oc.course, options: [...oc.options].sort((a, b) => b.weight - a.weight) }))
  const text = [
    ...lines.map((l) => `${displayCode(l.course)}  ${l.parts.map((p) => (p.kind === 'lecture' ? p.labels[0] : `Sec ${p.labels.join('/')}`)).join('  ')}`),
    ...openLines.map((l) => `${displayCode(l.course)}  any of: ${l.options.map((o) => optionText(o) + (seatTag(o) ? ` (${seatTag(o)})` : '')).join(', ')}`),
  ].join('\n')
  const copy = async () => { try { await navigator.clipboard.writeText(text); setCopied(true) } catch { /* clipboard unavailable */ } }
  return (
    <div className="register">
      <span className="label">Register</span>
      {lines.map((l) => (
        <span className="reg-item" key={l.course} style={{ '--c-fg': colorOf(l.course).fg } as React.CSSProperties}>
          <span className="code">{displayCode(l.course)}</span>
          {l.parts.map((p, i) => (
            <span key={i}>
              <span className="sep">·</span>{' '}
              {p.kind === 'lecture' ? p.labels[0] : <>Sec {p.labels[0]}{p.labels.length > 1 && <span className="alt" title="Interchangeable sections: identical times"> /{p.labels.slice(1).join('/')}</span>}</>}
            </span>
          ))}
        </span>
      ))}
      {openLines.map((l) => (
        <span className="reg-item open" key={l.course} style={{ '--c-fg': colorOf(l.course).fg } as React.CSSProperties} title={`${displayCode(l.course)}: try these in order at registration\n${l.options.map((o) => optionText(o) + (seatTag(o) ? ` (${seatTag(o)})` : '')).join('\n')}`}>
          <span className="code">{displayCode(l.course)}</span>
          <span className="sep">·</span> <span className="alt">any of</span>{' '}
          {l.options.slice(0, 6).map((o, i) => <span key={i} className={`opt ${o.seat?.state ?? ''}`}>{optionText(o)}{seatTag(o) && <small> {seatTag(o)}</small>}</span>)}
          {l.options.length > 6 && <span className="alt">+{l.options.length - 6}</span>}
        </span>
      ))}
      <button className={`btn sm copy${copied ? ' primary' : ''}`} onClick={copy} title="Copy the codes as text">
        <Icon name={copied ? 'check' : 'copy'} size={13} /> {copied ? 'Copied' : 'Copy codes'}
      </button>
    </div>
  )
}
