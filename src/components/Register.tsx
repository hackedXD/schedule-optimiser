import { useEffect, useState } from 'react'
import type { RankedSchedule } from '../engine/index.ts'
import { displayCode } from '../engine/index.ts'
import { Icon } from './Icon.tsx'

interface Props {
  schedule: RankedSchedule | null
  colorOf: (code: string) => { fg: string }
}

export function registerLines(s: RankedSchedule): { course: string; parts: { kind: 'lecture' | 'section'; labels: string[] }[] }[] {
  return s.courses.map((course) => ({
    course,
    parts: s.slots.filter((sl) => sl.course === course).sort((a, b) => (a.kind === b.kind ? 0 : a.kind === 'lecture' ? -1 : 1)).map((sl) => ({ kind: sl.kind, labels: sl.offerings.map((o) => o.label) })),
  }))
}

export function Register({ schedule, colorOf }: Props) {
  const [copied, setCopied] = useState(false)
  useEffect(() => { if (!copied) return; const t = setTimeout(() => setCopied(false), 1600); return () => clearTimeout(t) }, [copied])
  if (!schedule) return <div className="register"><span className="label">Register</span><span className="faint">Pick a schedule to see its codes</span></div>
  const lines = registerLines(schedule)
  const text = lines.map((l) => `${displayCode(l.course)}  ${l.parts.map((p) => (p.kind === 'lecture' ? p.labels[0] : `Sec ${p.labels.join('/')}`)).join('  ')}`).join('\n')
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
      <button className={`btn sm copy${copied ? ' primary' : ''}`} onClick={copy} title="Copy the codes as text">
        <Icon name={copied ? 'check' : 'copy'} size={13} /> {copied ? 'Copied' : 'Copy codes'}
      </button>
    </div>
  )
}
