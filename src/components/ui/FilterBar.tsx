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

const STATUS_TOGGLES: { key: keyof FilterState; label: string }[] = [
  { key: 'verifiedOnly', label: 'Verified only' },
  { key: 'needsReview', label: 'Needs Review' },
]

export function FilterBar({ filters, onChange }: Props) {
  const toggle = (key: keyof FilterState) => {
    onChange({ ...filters, [key]: !filters[key] })
  }

  return (
    <div className="space-y-3">
      <p className="text-[10px] uppercase tracking-widest font-mono" style={{ color: '#8b6847' }}>Map layers</p>
      <div className="flex flex-wrap gap-1.5">
        {TOGGLES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => toggle(key)}
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all duration-150"
            style={{
              background: filters[key] ? '#7b3f22' : 'rgba(255,255,255,0.36)',
              color: filters[key] ? '#fff8ed' : '#765434',
              borderColor: filters[key] ? 'rgba(123,63,34,0.6)' : 'rgba(122,82,48,0.18)',
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {STATUS_TOGGLES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => toggle(key)}
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all duration-150"
            style={{
              background: filters[key] ? '#314f2a' : 'rgba(255,255,255,0.28)',
              color: filters[key] ? '#f2ffe8' : '#765434',
              borderColor: filters[key] ? 'rgba(49,79,42,0.65)' : 'rgba(122,82,48,0.18)',
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
