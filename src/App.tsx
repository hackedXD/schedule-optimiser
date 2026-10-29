import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Catalog, CourseDetail, FceRecord, Request, Staffing, TermSchedule } from './engine/index.ts'
import { conflictingPairs, displayCode, latestStaffing, pairingsFrom, parseSocHtml, rank, seasonOf, semesterCode, solve, staffingFromSio } from './engine/index.ts'
import { PLACES, defaultBuilding } from './campus.ts'
import { courseColor } from './colors.ts'
import { usePersistentState } from './state.ts'
import { TopBar } from './components/TopBar.tsx'
import { CoursePanel } from './components/CoursePanel.tsx'
import { CriteriaPanel } from './components/CriteriaPanel.tsx'
import { WeekGrid } from './components/WeekGrid.tsx'
import { RankHead } from './components/RankHead.tsx'
import { Register } from './components/Register.tsx'
import { ResultsList } from './components/ResultsList.tsx'
import { Icon } from './components/Icon.tsx'
import { CourseDialog } from './components/CourseDialog.tsx'
import { SioImportDialog } from './components/SioImportDialog.tsx'

const PITTSBURGH = 'Pittsburgh, Pennsylvania'
const EMPTY_CATALOG: Catalog = { semester: '', runDate: '', courses: {} }

export default function App() {
  const [state, update] = usePersistentState()
  const [bundled, setBundled] = useState<Catalog | null>(null)
  const [custom, setCustom] = useState<{ name: string; catalog: Catalog } | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [dialogCode, setDialogCode] = useState<string | null>(null)
  const [sioOpen, setSioOpen] = useState(false)
  const [details, setDetails] = useState<Record<string, CourseDetail>>({})
  const [detailStatus, setDetailStatus] = useState<Record<string, 'loading' | 'missing' | 'unavailable'>>({})
  const [fces, setFces] = useState<Record<string, FceRecord[]>>({})
  const [fceStatus, setFceStatus] = useState<Record<string, 'loading' | 'unavailable'>>({})
  const [schedules, setSchedules] = useState<Record<string, TermSchedule[]>>({})
  const [schedStatus, setSchedStatus] = useState<Record<string, 'loading' | 'unavailable'>>({})

  useEffect(() => {
    fetch('/data/soc.json').then((r) => { if (!r.ok) throw new Error(`${r.status}`); return r.json() })
      .then((c: Catalog) => setBundled(c))
      .catch(() => setLoadError('The bundled Schedule of Classes could not be loaded. Run `npm run ingest`, or load an export.'))
  }, [])

  // FCE history (ScottyLabs): bundled cache first, then the dev endpoint per course.
  useEffect(() => {
    fetch('/data/fces.json').then((r) => (r.ok ? r.json() : {})).then((cache: Record<string, { records: FceRecord[] }>) => {
      const byCode: Record<string, FceRecord[]> = {}
      for (const [code, v] of Object.entries(cache)) byCode[code] = v.records
      setFces((prev) => ({ ...byCode, ...prev }))
    }).catch(() => {})
  }, [])

  useEffect(() => {
    fetch('/data/schedules.json').then((r) => (r.ok ? r.json() : {})).then((cache: Record<string, { terms: TermSchedule[] }>) => {
      const byCode: Record<string, TermSchedule[]> = {}
      for (const [code, v] of Object.entries(cache)) byCode[code] = v.terms
      setSchedules((prev) => ({ ...byCode, ...prev }))
    }).catch(() => {})
  }, [])

  const catalog = custom?.catalog ?? bundled ?? EMPTY_CATALOG
  const loading = !bundled && !custom && !loadError
  const semester = semesterCode(catalog.semester)

  // Course details (description, prerequisites, lecture pairing): bundled cache first, then the dev endpoint per course.
  useEffect(() => {
    fetch('/data/details.json').then((r) => (r.ok ? r.json() : {})).then((cache: Record<string, CourseDetail>) => {
      const byCode: Record<string, CourseDetail> = {}
      for (const d of Object.values(cache)) byCode[`${semesterCode(d.semester) ?? ''}:${d.code}`] = d
      setDetails((prev) => ({ ...byCode, ...prev }))
    }).catch(() => {})
  }, [])

  const allCodes = useMemo(() => [...state.required, ...state.groups.flatMap((g) => g.options)], [state.required, state.groups])
  const detailFor = useCallback((code: string) => (semester ? details[`${semester}:${code}`] : undefined), [details, semester])

  useEffect(() => {
    if (!semester) return
    let cancelled = false
    const todo = allCodes.filter((c) => catalog.courses[c] && !details[`${semester}:${c}`] && !detailStatus[`${semester}:${c}`])
    if (!todo.length) return
    setDetailStatus((s) => ({ ...s, ...Object.fromEntries(todo.map((c) => [`${semester}:${c}`, 'loading' as const])) }))
    ;(async () => {
      for (const code of todo) {
        const key = `${semester}:${code}`
        try {
          const r = await fetch(`/api/detail?course=${code}&semester=${semester}`)
          if (cancelled) return
          if (r.ok) {
            const d = (await r.json()) as CourseDetail
            setDetails((prev) => ({ ...prev, [key]: d }))
            setDetailStatus((s) => { const n = { ...s }; delete n[key]; return n })
          } else {
            setDetailStatus((s) => ({ ...s, [key]: r.status === 404 && r.headers.get('content-type')?.includes('json') ? 'missing' : 'unavailable' }))
          }
        } catch {
          if (!cancelled) setDetailStatus((s) => ({ ...s, [key]: 'unavailable' }))
        }
      }
    })()
    return () => { cancelled = true }
  }, [allCodes, catalog, semester, details, detailStatus])

  useEffect(() => {
    let cancelled = false
    const todo = allCodes.filter((c) => catalog.courses[c] && !fces[c] && !fceStatus[c])
    if (!todo.length) return
    setFceStatus((s) => ({ ...s, ...Object.fromEntries(todo.map((c) => [c, 'loading' as const])) }))
    ;(async () => {
      for (const code of todo) {
        try {
          const r = await fetch(`/api/fce?course=${code}`)
          if (cancelled) return
          if (r.ok) {
            const recs = (await r.json()) as FceRecord[]
            setFces((prev) => ({ ...prev, [code]: recs }))
            setFceStatus((s) => { const n = { ...s }; delete n[code]; return n })
          } else setFceStatus((s) => ({ ...s, [code]: 'unavailable' }))
        } catch { if (!cancelled) setFceStatus((s) => ({ ...s, [code]: 'unavailable' })) }
      }
    })()
    return () => { cancelled = true }
  }, [allCodes, catalog, fces, fceStatus])

  useEffect(() => {
    let cancelled = false
    const todo = allCodes.filter((c) => catalog.courses[c] && !schedules[c] && !schedStatus[c])
    if (!todo.length) return
    setSchedStatus((s) => ({ ...s, ...Object.fromEntries(todo.map((c) => [c, 'loading' as const])) }))
    ;(async () => {
      for (const code of todo) {
        try {
          const r = await fetch(`/api/schedules?course=${code}`)
          if (cancelled) return
          if (r.ok) {
            const terms = (await r.json()) as TermSchedule[]
            setSchedules((prev) => ({ ...prev, [code]: terms }))
            setSchedStatus((s) => { const n = { ...s }; delete n[code]; return n })
          } else setSchedStatus((s) => ({ ...s, [code]: 'unavailable' }))
        } catch { if (!cancelled) setSchedStatus((s) => ({ ...s, [code]: 'unavailable' })) }
      }
    })()
    return () => { cancelled = true }
  }, [allCodes, catalog, schedules, schedStatus])

  const season = seasonOf(catalog.semester)
  const staffings = useMemo(() => {
    const m: Record<string, Staffing | null> = {}
    for (const [code, terms] of Object.entries(schedules)) m[code] = latestStaffing(terms, season)
    for (const [code, v] of Object.entries(state.sio)) m[code] = staffingFromSio(v.rows, `SIO · ${catalog.semester}`)
    return m
  }, [schedules, season, state.sio, catalog.semester])
  const staffingFor = useCallback((code: string) => staffings[code] ?? null, [staffings])

  const pairings = useMemo(() => {
    const m: Record<string, CourseDetail | undefined> = {}
    for (const c of allCodes) m[c] = detailFor(c)
    return pairingsFrom(m)
  }, [allCodes, detailFor])
  const colorOf = useCallback((code: string) => courseColor(Math.max(0, allCodes.indexOf(code))), [allCodes])

  const request: Request = useMemo(() => ({
    required: state.required, groups: state.groups, excluded: state.excluded, pinned: state.pinned,
    locations: state.pittsburghOnly ? [PITTSBURGH] : [], includeMini: state.includeMini,
  }), [state.required, state.groups, state.excluded, state.pinned, state.pittsburghOnly, state.includeMini])

  const result = useMemo(() => (allCodes.length ? solve(catalog, request, state.ratings, pairings) : null), [catalog, request, state.ratings, allCodes.length, pairings])
  const rankCtx = useMemo(() => ({
    ratings: state.ratings,
    groups: state.groups,
    buildingOf: (code: string) => {
      if (state.buildings[code]) return state.buildings[code]
      const st = staffings[code]
      const fromRooms = st ? [...Object.values(st.lectures), ...Object.values(st.sections)].map((x) => x.building).find((b) => b && PLACES[b]) : null
      return fromRooms ?? defaultBuilding(code)
    },
    dorm: state.dorm,
  }), [state.ratings, state.groups, state.buildings, state.dorm, staffings])
  const ranked = useMemo(() => (result ? rank(result.schedules, state.order, rankCtx) : []), [result, state.order, rankCtx])
  const total = ranked.length

  const selected = useMemo(() => ranked.find((s) => s.id === selectedId) ?? ranked[0] ?? null, [ranked, selectedId])
  useEffect(() => { if (selected && selected.id !== selectedId) setSelectedId(selected.id) }, [selected, selectedId])

  const step = useCallback((delta: number) => {
    if (!selected) return
    const next = ranked[selected.rank - 1 + delta]
    if (next) setSelectedId(next.id)
  }, [ranked, selected])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      if (e.key === 'ArrowDown' || e.key === 'j') { e.preventDefault(); step(1) }
      if (e.key === 'ArrowUp' || e.key === 'k') { e.preventDefault(); step(-1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [step])

  const onLoadFile = async (f: File) => {
    try {
      const text = await f.text()
      const c = parseSocHtml(text)
      if (Object.keys(c.courses).length === 0) throw new Error('empty')
      setCustom({ name: f.name, catalog: c })
      setLoadError(null)
    } catch {
      setLoadError(`${f.name} does not look like a CMU Schedule of Classes export.`)
    }
  }

  const pairs = useMemo(() => (result && result.schedules.length === 0 && allCodes.length > 1 ? conflictingPairs(catalog, [...new Set(allCodes)], request, state.ratings, pairings) : []), [result, allCodes, catalog, request, state.ratings, pairings])

  return (
    <div className="app">
      <TopBar semester={loading ? 'Loading…' : catalog.semester || 'No catalog'} runDate={catalog.runDate} source={custom ? custom.name : 'bundled export'}
        count={result ? total : null} onLoadFile={onLoadFile} onResetSource={() => setCustom(null)} custom={!!custom} onImportSio={() => setSioOpen(true)} />

      <aside className="panel left" aria-label="Inputs">
        {loadError && <div className="section"><div className="banner danger"><Icon name="alert" size={14} />{loadError}</div></div>}
        <CoursePanel catalog={catalog} state={state} update={update} colorOf={colorOf} slotCounts={result?.slotCounts ?? {}} detailFor={detailFor} detailStatusFor={(c) => (semester ? detailStatus[`${semester}:${c}`] : undefined)}
          semester={semester} expanded={expanded} onExpand={setExpanded} fcesFor={(c) => fces[c]} fceStatusFor={(c) => fceStatus[c]} staffingFor={staffingFor} />
        <CriteriaPanel order={state.order} onChange={(order) => update((s) => ({ ...s, order }))} pittsburghOnly={state.pittsburghOnly} includeMini={state.includeMini}
          onToggle={(k) => update((s) => ({ ...s, [k]: !s[k] }))} dorm={state.dorm} onDorm={(dorm) => update((s) => ({ ...s, dorm }))} />
      </aside>

      <main className="centre">
        <RankHead schedule={selected} total={total} order={state.order} onStep={step} />
        {loading ? (
          <div className="grid-wrap"><div className="skeleton" style={{ height: '100%', minHeight: 560, borderRadius: 10 }} /></div>
        ) : result && total === 0 ? (
          <div className="empty">
            <div className="box">
              <h3>No schedule fits</h3>
              {result.missing.length > 0 && <p>{result.missing.map(displayCode).join(', ')} {result.missing.length === 1 ? 'is' : 'are'} not offered this semester.</p>}
              {result.unplaceable.length > 0 && <p>{result.unplaceable.map(displayCode).join(', ')} {result.unplaceable.length === 1 ? 'has' : 'have'} no section with scheduled times after your filters.</p>}
              {pairs.length > 0 && (
                <div className="diag">
                  These pairs have no compatible lecture and section times:
                  <ul>{pairs.map(([a, b]) => <li key={a + b}><b style={{ color: 'var(--text-1)', fontWeight: 500 }}>{displayCode(a)}</b> and <b style={{ color: 'var(--text-1)', fontWeight: 500 }}>{displayCode(b)}</b></li>)}</ul>
                </div>
              )}
              {result.missing.length === 0 && result.unplaceable.length === 0 && pairs.length === 0 && <p>Every combination of the chosen sections overlaps somewhere. Try unpinning a lecture or removing an exclusion.</p>}
              {state.pittsburghOnly && <p className="faint">Pittsburgh-only is on. Turning it off adds other campuses.</p>}
            </div>
          </div>
        ) : !result ? (
          <div className="empty">
            <div className="box">
              <h3>Start with your courses</h3>
              <p>Add the courses you must take, then a group for any "pick one of" choice. Every conflict-free combination of lectures and sections is built and ranked by the criteria on the left, in the order you set.</p>
              <button className="btn primary" onClick={() => update((s) => ({ ...s, required: ['21241', '18213', '15150', '49101'], groups: [{ id: 'ex', pick: 1, options: ['17200', '10335', '73102'] }] }))}>
                Load the example: 21-241, 18-213, 15-150, 49-101 + pick 1 of 3
              </button>
            </div>
          </div>
        ) : (
          <div className="grid-wrap"><WeekGrid schedule={selected} catalog={catalog} colorOf={colorOf} onBlockClick={setDialogCode} /></div>
        )}
        <Register schedule={selected} colorOf={colorOf} />
      </main>

      <CourseDialog code={dialogCode} catalog={catalog} slots={selected && dialogCode ? selected.slots.filter((sl) => sl.course === dialogCode) : []}
        detail={dialogCode ? detailFor(dialogCode) : undefined} status={dialogCode && semester ? detailStatus[`${semester}:${dialogCode}`] : undefined}
        semester={semester} color={colorOf(dialogCode ?? '')} state={state} update={update} counts={dialogCode ? result?.slotCounts[dialogCode] : undefined}
        fces={dialogCode ? fces[dialogCode] : undefined} fceStatus={dialogCode ? fceStatus[dialogCode] : undefined} staffing={dialogCode ? staffingFor(dialogCode) : null}
        onClose={() => setDialogCode(null)} />

      <SioImportDialog open={sioOpen} catalog={catalog} codes={[...new Set(allCodes)]} onClose={() => setSioOpen(false)}
        onImport={(code, rows) => update((s) => ({ ...s, sio: { ...s.sio, [code]: { importedAt: new Date().toISOString(), rows } } }))} />

      <aside className="panel right" aria-label="Ranked schedules">
        <ResultsList ranked={ranked} order={state.order} selectedId={selected?.id ?? null} onSelect={setSelectedId} colorOf={colorOf} truncated={result?.truncated ?? false} explored={result?.explored ?? 0} />
      </aside>
    </div>
  )
}
