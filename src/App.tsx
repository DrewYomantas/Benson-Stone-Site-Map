import { useState, useCallback, useEffect } from 'react'
import { SidebarSearch } from './components/ui/SidebarSearch'
import { CampusMapCanvas } from './components/map/CampusMapCanvas'
import { EntityDetailPanel } from './components/ui/EntityDetailPanel'
import type { EntityType, FilterState, ViewMode } from './types'
import { getEntityById, routePresets } from './data/benson'

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
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [exploringInterior, setExploringInterior] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('visit')
  const [activeRouteId, setActiveRouteId] = useState<string | null>('customer-arrival')

  const handleSelect = useCallback((id: string, type: EntityType) => {
    const isToggleOff = selectedId === id
    setSelectedId(isToggleOff ? null : id)
    setSelectedType(isToggleOff ? null : type)
    // Clear interior exploration when changing selection
    setExploringInterior(false)
  }, [selectedId])

  const handleDeselect = useCallback(() => {
    setSelectedId(null)
    setSelectedType(null)
    setExploringInterior(false)
  }, [])

  const handleToggleExplore = useCallback(() => {
    setExploringInterior((v) => !v)
  }, [])

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode)
    setActiveRouteId(null)
    setFilters((current) => ({
      ...current,
      doors: mode !== 'visit',
      entrances: true,
      verifiedOnly: false,
      needsReview: false,
    }))
  }, [])

  const handleRouteSelect = useCallback((routeId: string) => {
    const route = routePresets.find((item) => item.id === routeId)
    if (!route) return
    setActiveRouteId(routeId)
    setViewMode(route.viewMode)
    setFilters((current) => ({
      ...current,
      doors: route.viewMode !== 'visit' || route.highlights.some((id) => id.startsWith('D-')),
      entrances: true,
      verifiedOnly: false,
      needsReview: route.viewMode === 'verification',
    }))
    setSelectedId(route.targetEntityId)
    setSelectedType(route.targetEntityType)
    setExploringInterior(false)
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
    <div className="flex h-full w-full overflow-hidden max-md:flex-col" style={{ background: '#efe0c6' }}>
      <SidebarSearch
        selectedId={selectedId}
        filters={filters}
        viewMode={viewMode}
        activeRouteId={activeRouteId}
        onFiltersChange={setFilters}
        onViewModeChange={handleViewModeChange}
        onRouteSelect={handleRouteSelect}
        onSelect={handleSelect}
      />

      <CampusMapCanvas
        selectedId={selectedId}
        hoveredId={hoveredId}
        selectedType={selectedType}
        filters={filters}
        exploringInterior={exploringInterior}
        viewMode={viewMode}
        activeRouteId={activeRouteId}
        onHover={setHoveredId}
        onSelect={handleSelect}
        onDeselect={handleDeselect}
      />

      {selectedId && selectedType && (
        <EntityDetailPanel
          entityId={selectedId}
          entityType={selectedType}
          exploringInterior={exploringInterior}
          viewMode={viewMode}
          onToggleExplore={handleToggleExplore}
          onClose={handleDeselect}
        />
      )}
    </div>
  )
}
