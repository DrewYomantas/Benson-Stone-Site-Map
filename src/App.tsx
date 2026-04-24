import { useState, useCallback, useEffect } from 'react'
import { SidebarSearch } from './components/ui/SidebarSearch'
import { CampusMapCanvas } from './components/map/CampusMapCanvas'
import { EntityDetailPanel } from './components/ui/EntityDetailPanel'
import type { EntityType, FilterState } from './types'
import { getEntityById } from './data/benson'

const DEFAULT_FILTERS: FilterState = {
  buildings: true,
  yards: true,
  entrances: true,
  doors: false,
  verifiedOnly: false,
  needsReview: false,
}

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<EntityType | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [filters] = useState<FilterState>(DEFAULT_FILTERS)

  const handleSelect = useCallback((id: string, type: EntityType) => {
    setSelectedId((prev) => prev === id ? null : id)
    setSelectedType((prev) => prev === type && selectedId === id ? null : type)
  }, [selectedId])

  const handleDeselect = useCallback(() => {
    setSelectedId(null)
    setSelectedType(null)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleDeselect()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleDeselect])

  // Sync URL state
  useEffect(() => {
    if (selectedId) {
      window.history.replaceState(null, '', `?selected=${selectedId}`)
    } else {
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [selectedId])

  // Restore from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('selected')
    if (id) {
      const result = getEntityById(id)
      if (result) {
        setSelectedId(id)
        setSelectedType(result.type)
      }
    }
  }, [])

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#1a1a1a]">
      <SidebarSearch
        selectedId={selectedId}
        onSelect={handleSelect}
      />

      <CampusMapCanvas
        selectedId={selectedId}
        hoveredId={hoveredId}
        filters={filters}
        onHover={setHoveredId}
        onSelect={handleSelect}
        onDeselect={handleDeselect}
      />

      {selectedId && selectedType && (
        <EntityDetailPanel
          entityId={selectedId}
          entityType={selectedType}
          onClose={handleDeselect}
        />
      )}
    </div>
  )
}
