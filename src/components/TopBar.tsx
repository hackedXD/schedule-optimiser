import { useRef } from 'react'
import { Icon } from './Icon.tsx'

interface Props {
  semester: string
  runDate: string
  source: string
  count: number | null
  onLoadFile: (f: File) => void
  onResetSource: () => void
  custom: boolean
}

export function TopBar({ semester, runDate, source, count, onLoadFile, onResetSource, custom }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  return (
    <header className="topbar">
      <div className="wordmark">
        <span className="mark"><Icon name="sliders" size={13} /></span>
        <span>Schedule Optimiser</span>
      </div>
      <div className="status">
        <span>{semester}</span>
        <span className="dot" />
        <span className="optional faint">{source}{runDate ? ` · run ${runDate}` : ''}</span>
        {count !== null && (<><span className="dot" /><span className="num">{count.toLocaleString()} {count === 1 ? 'schedule' : 'schedules'}</span></>)}
      </div>
      <div className="spacer" />
      {custom && (
        <button className="btn ghost sm" onClick={onResetSource} title="Go back to the bundled export">
          <Icon name="reset" size={13} /> Bundled export
        </button>
      )}
      <button className="btn sm" onClick={() => fileRef.current?.click()} title="Load a CMU Schedule of Classes HTML export">
        <Icon name="upload" size={13} /> Load export
      </button>
      <input ref={fileRef} type="file" accept=".html,.htm,text/html" className="sr-only" tabIndex={-1}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onLoadFile(f); e.target.value = '' }} />
    </header>
  )
}
