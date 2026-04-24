import { useState, useEffect } from 'react'
import { FilterBar } from './FilterBar'
import { QuickJumpList } from './QuickJumpList'
import { search, getAllEntities } from '../../lib/search'
import type { FilterState, EntityType } from '../../types'

interface Props {
  selectedId: string | null
  onSelect: (id: string, type: EntityType) => void
}

const DEFAULT_FILTERS: FilterState = {
  buildings: true,
  yards: true,
  entrances: true,
  doors: false,
  verifiedOnly: false,
  needsReview: false,
}

export function SidebarSearch({ selectedId, onSelect }: Props) {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)

  const results = query.trim()
    ? search(query, filters)
    : getAllEntities(filters)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setQuery('')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <aside className="w-72 shrink-0 flex flex-col h-full border-r border-stone-800/60 bg-charcoal-dark relative overflow-hidden">
      {/* Subtle texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[repeating-linear-gradient(45deg,#c4a882_0px,#c4a882_1px,transparent_1px,transparent_8px)] pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full p-5 gap-5">
        {/* Header */}
        <div className="space-y-1 pt-2">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 rounded-full bg-amber-500/80" />
            <h1 className="font-display text-xl font-semibold text-stone-100 leading-tight tracking-wide">
              Benson Stone
            </h1>
          </div>
          <p className="text-[11px] font-mono text-stone-500 uppercase tracking-widest pl-3">
            Campus Operations Map
          </p>
          <p className="text-[11px] text-stone-600 pl-3 mt-1 leading-relaxed">
            1100 Eleventh St · Rockford, IL 61104
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 text-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search buildings, yards, doors…"
            className="w-full bg-stone-900/80 border border-stone-700/50 rounded-lg pl-9 pr-3 py-2.5 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-amber-600/60 focus:bg-stone-900 transition-all duration-150"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filters */}
        <FilterBar filters={filters} onChange={setFilters} />

        {/* Divider */}
        <div className="border-t border-stone-800/60" />

        {/* Results */}
        <div className="flex-1 overflow-hidden flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-widest text-stone-500 font-mono">
              {query ? 'Results' : 'All locations'}
            </p>
            <span className="text-[10px] font-mono text-stone-600">{results.length}</span>
          </div>
          <QuickJumpList items={results} selectedId={selectedId} onSelect={onSelect} />
        </div>

        {/* Footer */}
        <div className="border-t border-stone-800/40 pt-3">
          <p className="text-[10px] text-stone-700 font-mono">
            V1 Truth Map · 2020 aerial base
          </p>
          <p className="text-[10px] text-stone-700 mt-0.5">
            <a href="https://www.bensonstone.com" target="_blank" rel="noopener noreferrer" className="hover:text-stone-500 transition-colors">
              bensonstone.com
            </a>
            {' · '}815-227-2000
          </p>
        </div>
      </div>
    </aside>
  )
}
