import { useState, useEffect } from 'react'
import { FilterBar } from './FilterBar'
import { QuickJumpList } from './QuickJumpList'
import { search, getAllEntities } from '../../lib/search'
import { routePresets } from '../../data/benson'
import type { FilterState, EntityType, ViewMode } from '../../types'

interface Props {
  selectedId: string | null
  filters: FilterState
  viewMode: ViewMode
  activeRouteId: string | null
  onFiltersChange: (filters: FilterState) => void
  onViewModeChange: (mode: ViewMode) => void
  onRouteSelect: (routeId: string) => void
  onSelect: (id: string, type: EntityType) => void
}

const VIEW_MODES: { id: ViewMode; label: string; helper: string }[] = [
  { id: 'visit', label: 'Visit', helper: 'Customer entrances, showrooms, parking, and pickup.' },
  { id: 'operations', label: 'Ops', helper: 'Doors, receiving, contractor yards, and staff flow.' },
  { id: 'verification', label: 'Verify', helper: 'Field-check gaps, source notes, and photo needs.' },
]

export function SidebarSearch({
  selectedId,
  filters,
  viewMode,
  activeRouteId,
  onFiltersChange,
  onViewModeChange,
  onRouteSelect,
  onSelect,
}: Props) {
  const [query, setQuery] = useState('')
  const results = query.trim() ? search(query, filters) : getAllEntities(filters)
  const activeMode = VIEW_MODES.find((mode) => mode.id === viewMode) ?? VIEW_MODES[0]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setQuery('')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <aside
      className="w-[21rem] shrink-0 flex flex-col h-full border-r relative overflow-hidden max-md:h-[36vh] max-md:w-full max-md:border-r-0 max-md:border-b"
      style={{ background: 'linear-gradient(180deg, #fff7e8 0%, #f1dfbf 58%, #dcc49b 100%)', borderColor: 'rgba(122,82,48,0.24)' }}
    >
      <div className="absolute inset-0 opacity-[0.16] bg-[repeating-linear-gradient(45deg,#7d4b2b_0px,#7d4b2b_1px,transparent_1px,transparent_10px)] pointer-events-none" />
      <div className="absolute -left-24 top-12 h-56 w-56 rounded-full bg-amber-300/25 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full gap-4 p-5 max-md:gap-3 max-md:p-4">
        <div className="space-y-2 pt-2 max-md:pt-0">
          <div className="flex items-center gap-2">
            <div className="w-1 h-8 rounded-full bg-amber-600" />
            <h1 className="font-display text-3xl font-semibold leading-none tracking-wide" style={{ color: '#2b2117' }}>
              Benson Stone
            </h1>
          </div>
          <p className="text-[11px] font-mono uppercase tracking-[0.22em] pl-3" style={{ color: '#8b4e2f' }}>
            Everything for a Beautiful Home
          </p>
          <p className="text-[12px] pl-3 leading-relaxed max-md:hidden" style={{ color: '#6e5438' }}>
            Campus guide for showrooms, yards, loading, and field verification.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#8b6847' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search showrooms, yards, doors..."
            className="w-full rounded-2xl pl-9 pr-3 py-3 text-sm transition-all duration-150 focus:outline-none"
            style={{
              background: 'rgba(255,255,255,0.55)',
              border: '1px solid rgba(122,82,48,0.22)',
              color: '#2d2117',
              boxShadow: '0 14px 28px rgba(66, 42, 22, 0.08)',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: '#8b6847' }}
            >
              x
            </button>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-widest font-mono" style={{ color: '#8b6847' }}>View mode</p>
          <div className="grid grid-cols-3 gap-1.5">
            {VIEW_MODES.map((mode) => (
              <button
                key={mode.id}
                onClick={() => onViewModeChange(mode.id)}
                title={mode.helper}
                className="rounded-xl px-2.5 py-2 text-xs font-bold transition-all duration-150"
                style={{
                  color: viewMode === mode.id ? '#fff8ed' : '#765434',
                  background: viewMode === mode.id ? '#7b3f22' : 'rgba(255,255,255,0.44)',
                  border: `1px solid ${viewMode === mode.id ? 'rgba(123,63,34,0.6)' : 'rgba(122,82,48,0.18)'}`,
                }}
              >
                {mode.label}
              </button>
            ))}
          </div>
          <p className="text-[11px] leading-snug max-md:hidden" style={{ color: '#73573a' }}>
            {activeMode.helper}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-widest font-mono" style={{ color: '#8b6847' }}>Guided routes</p>
          <div className="grid grid-cols-1 gap-1.5 max-md:flex max-md:overflow-x-auto max-md:pb-1">
            {routePresets.map((route) => (
              <button
                key={route.id}
                onClick={() => onRouteSelect(route.id)}
                className="group rounded-xl px-3 py-2 text-left transition-all duration-150 max-md:min-w-[168px]"
                style={{
                  background: activeRouteId === route.id ? 'rgba(123,63,34,0.95)' : 'rgba(255,255,255,0.38)',
                  border: `1px solid ${activeRouteId === route.id ? route.accent : 'rgba(122,82,48,0.16)'}`,
                  color: activeRouteId === route.id ? '#fff8ed' : '#2d2117',
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold">{route.label}</span>
                  <span className="h-2 w-2 rounded-full" style={{ background: route.accent }} />
                </div>
                <span className="mt-0.5 block text-[10px] leading-snug opacity-70">{route.description}</span>
              </button>
            ))}
          </div>
        </div>

        <FilterBar filters={filters} onChange={onFiltersChange} />

        <div className="border-t max-md:hidden" style={{ borderColor: 'rgba(122,82,48,0.18)' }} />

        <div className="flex-1 overflow-hidden flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-widest font-mono" style={{ color: '#8b6847' }}>
              {query ? 'Results' : 'All locations'}
            </p>
            <span className="text-[10px] font-mono" style={{ color: '#8b6847' }}>{results.length}</span>
          </div>
          <QuickJumpList items={results} selectedId={selectedId} onSelect={onSelect} />
        </div>

        <div className="border-t pt-3 max-md:hidden" style={{ borderColor: 'rgba(122,82,48,0.18)' }}>
          <p className="text-[10px] font-mono" style={{ color: '#8b6847' }}>
            Campus Operations Map | 1100 Eleventh St
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: '#8b6847' }}>
            <a href="https://www.bensonstone.com" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-stone-900">
              bensonstone.com
            </a>
            {' | '}815-227-2000
          </p>
        </div>
      </div>
    </aside>
  )
}
