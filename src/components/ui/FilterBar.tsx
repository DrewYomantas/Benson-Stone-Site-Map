import type { FilterState } from '../../types'

interface Props {
  filters: FilterState
  onChange: (f: FilterState) => void
}

const TOGGLES: { key: keyof FilterState; label: string }[] = [
  { key: 'buildings', label: 'Buildings' },
  { key: 'yards', label: 'Yards' },
  { key: 'entrances', label: 'Entrances' },
  { key: 'doors', label: 'Doors' },
]

const STATUS_TOGGLES: { key: keyof FilterState; label: string; cls: string }[] = [
  { key: 'verifiedOnly', label: 'Verified only', cls: 'text-emerald-400 border-emerald-700/50 data-[active=true]:bg-emerald-900/50' },
  { key: 'needsReview', label: 'Needs Review', cls: 'text-red-400 border-red-700/50 data-[active=true]:bg-red-900/50' },
]

export function FilterBar({ filters, onChange }: Props) {
  const toggle = (key: keyof FilterState) => {
    onChange({ ...filters, [key]: !filters[key] })
  }

  return (
    <div className="space-y-3">
      <p className="text-[10px] uppercase tracking-widest text-stone-500 font-mono">Type filters</p>
      <div className="flex flex-wrap gap-1.5">
        {TOGGLES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => toggle(key)}
            data-active={filters[key]}
            className="px-2.5 py-1 rounded text-xs font-medium border transition-all duration-150
              border-stone-700 text-stone-400
              data-[active=true]:bg-amber-900/40 data-[active=true]:text-amber-300 data-[active=true]:border-amber-700/60
              hover:border-stone-500 hover:text-stone-300"
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {STATUS_TOGGLES.map(({ key, label, cls }) => (
          <button
            key={key}
            onClick={() => toggle(key)}
            data-active={filters[key]}
            className={`px-2.5 py-1 rounded text-xs font-medium border border-stone-700 text-stone-500 transition-all duration-150 hover:border-stone-500 ${cls}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
