import { useEffect, useState } from 'react'
import type { ChoiceGroup, CriterionId, Ratings } from './engine/index.ts'
import { DEFAULT_ORDER } from './engine/index.ts'

export interface AppState {
  required: string[]
  groups: ChoiceGroup[]
  order: CriterionId[]
  ratings: Ratings
  excluded: string[]
  pinned: string[]
  pittsburghOnly: boolean
  includeMini: boolean
}

export const EXAMPLE: Pick<AppState, 'required' | 'groups'> = {
  required: ['21241', '18213', '15150', '49101'],
  groups: [{ id: 'g1', pick: 1, options: ['17200', '10335', '73102'] }],
}

export const INITIAL: AppState = {
  required: [],
  groups: [],
  order: [...DEFAULT_ORDER],
  ratings: {},
  excluded: [],
  pinned: [],
  pittsburghOnly: true,
  includeMini: true,
}

const KEY = 'schedule-optimiser.v1'

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return INITIAL
    const parsed = JSON.parse(raw) as Partial<AppState>
    const order = Array.isArray(parsed.order) && parsed.order.length === DEFAULT_ORDER.length && DEFAULT_ORDER.every((c) => parsed.order!.includes(c))
      ? parsed.order
      : [...DEFAULT_ORDER]
    return { ...INITIAL, ...parsed, order }
  } catch {
    return INITIAL
  }
}

export function usePersistentState(): [AppState, (f: (s: AppState) => AppState) => void] {
  const [state, setState] = useState<AppState>(load)
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* storage unavailable */ }
  }, [state])
  return [state, (f) => setState((s) => f(s))]
}

export function newId(): string {
  return Math.random().toString(36).slice(2, 8)
}
