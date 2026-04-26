import { useCallback, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CampusScene } from '../scene/CampusScene'
import { getEntityById, routePresets } from '../../data/benson'
import type { EntityType, FilterState, ViewMode } from '../../types'

interface Props {
  selectedId: string | null
  hoveredId: string | null
  selectedType: EntityType | null
  filters: FilterState
  exploringInterior: boolean
  viewMode: ViewMode
  activeRouteId: string | null
  onHover: (id: string | null) => void
  onSelect: (id: string, type: EntityType) => void
  onDeselect: () => void
}

function IconReset() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
}

function IconLegend() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="4" height="4" rx="1" />
      <line x1="11" y1="5" x2="21" y2="5" />
      <rect x="3" y="10" width="4" height="4" rx="1" />
      <line x1="11" y1="12" x2="21" y2="12" />
      <rect x="3" y="17" width="4" height="4" rx="1" />
      <line x1="11" y1="19" x2="21" y2="19" />
    </svg>
  )
}

function LegendPanel() {
  const items = [
    { color: '#a86c47', border: '#f2dba7', label: 'Brick / stone campus buildings', shape: 'square' },
    { color: '#9c8257', border: '#dfc27b', label: 'Stone yards and work areas', shape: 'square' },
    { color: '#575a5d', border: '#f2ead8', label: 'Drives, aprons, and parking', shape: 'square' },
    { color: '#5f9dc2', border: '#5f9dc2', label: 'Customer entrance', shape: 'diamond' },
    { color: '#c17745', border: '#c17745', label: 'Loading / receiving', shape: 'diamond' },
    { color: '#c93632', border: '#ffb3a8', label: 'Printed door number', shape: 'circle' },
  ]

  return (
    <div
      style={{
        background: 'rgba(20,18,14,0.9)',
        border: '1px solid rgba(196,184,152,0.12)',
        borderRadius: 10,
        backdropFilter: 'blur(10px)',
        padding: '12px 14px',
        minWidth: 200,
      }}
    >
      <p style={{ fontSize: 9, fontFamily: 'DM Mono, monospace', color: '#6b5f4a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
        Legend
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {items.map((item) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 14,
                height: 14,
                background: item.color,
                border: `2px solid ${item.border}`,
                borderRadius: item.shape === 'diamond' ? '2px' : item.shape === 'circle' ? '50%' : 3,
                transform: item.shape === 'diamond' ? 'rotate(45deg)' : 'none',
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', color: '#a09080', letterSpacing: '0.03em' }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Breadcrumb({ label, type }: { label: string; type: EntityType }) {
  const typeLabels: Record<EntityType, string> = {
    building: 'Building',
    yard: 'Yard',
    entrance: 'Entrance',
    door: 'Door',
  }
  const typeColors: Record<EntityType, string> = {
    building: '#c4a050',
    yard: '#6aaa50',
    entrance: '#4a8ab0',
    door: '#8a8880',
  }

  return (
    <div
      style={{
        background: 'rgba(20,18,14,0.88)',
        border: '1px solid rgba(196,184,152,0.12)',
        borderRadius: 7,
        backdropFilter: 'blur(8px)',
        padding: '5px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <span style={{ fontSize: 9, fontFamily: 'DM Mono, monospace', color: typeColors[type], textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {typeLabels[type]}
      </span>
      <span style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', color: '#c4b898', letterSpacing: '0.03em' }}>{label}</span>
    </div>
  )
}

function IconBtn({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void
  active?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 32,
        height: 32,
        borderRadius: 7,
        border: `1px solid ${active ? 'rgba(196,160,80,0.5)' : 'rgba(196,184,152,0.12)'}`,
        background: active ? 'rgba(196,160,80,0.18)' : 'rgba(20,18,14,0.82)',
        color: active ? '#c4a050' : '#8a7a60',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        backdropFilter: 'blur(8px)',
        transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  )
}

export function CampusMapCanvas({
  selectedId,
  hoveredId,
  selectedType,
  filters,
  exploringInterior,
  viewMode,
  activeRouteId,
  onHover,
  onSelect,
  onDeselect,
}: Props) {
  const [showLegend, setShowLegend] = useState(false)
  const [resetSignal, setResetSignal] = useState(0)
  const activeRoute = routePresets.find((route) => route.id === activeRouteId) ?? null

  const selectedLabel = useMemo(() => {
    if (!selectedId) return null
    return getEntityById(selectedId)?.entity.displayName ?? selectedId
  }, [selectedId])

  const handleReset = useCallback(() => {
    setResetSignal((value) => value + 1)
  }, [])

  return (
    <div className="relative min-h-0 flex-1 overflow-hidden" style={{ background: '#d5c299' }}>
      <div className="absolute inset-0">
        <CampusScene
          selectedId={selectedId}
          hoveredId={hoveredId}
          selectedType={selectedType}
          filters={filters}
          exploringInterior={exploringInterior}
          viewMode={viewMode}
          activeRoute={activeRoute}
          resetSignal={resetSignal}
          onHover={onHover}
          onSelect={onSelect}
          onDeselect={onDeselect}
        />
      </div>

      <div className="absolute left-5 right-5 top-4 z-20 pointer-events-none flex items-start justify-between gap-3 max-md:left-3 max-md:right-3 max-md:top-3">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
          style={{
            backdropFilter: 'blur(14px)',
            background: 'linear-gradient(135deg, rgba(255,248,237,0.92), rgba(231,202,151,0.72))',
            borderRadius: 18,
            border: '1px solid rgba(122,82,48,0.18)',
            padding: '12px 16px',
            boxShadow: '0 18px 42px rgba(66,42,22,0.16)',
            maxWidth: 470,
          }}
        >
          <p style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', color: '#8b4e2f', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 4 }}>
            {viewMode === 'visit' ? 'Visit mode' : viewMode === 'operations' ? 'Operations mode' : 'Verification mode'}
          </p>
          <p style={{ fontSize: 22, fontFamily: 'Cormorant Garamond, serif', color: '#2b2117', fontWeight: 700, lineHeight: 1.05 }}>
            {activeRoute ? activeRoute.label : 'Benson Stone Campus Guide'}
          </p>
          <p style={{ fontSize: 12, color: '#6e5438', marginTop: 5, lineHeight: 1.35 }}>
            {activeRoute ? activeRoute.description : 'Explore showrooms, yards, loading, doors, and verification notes in one polished 3D map.'}
          </p>
        </motion.div>

        <div
          className="max-md:hidden"
          style={{
            backdropFilter: 'blur(10px)',
            background: 'rgba(43,33,23,0.88)',
            borderRadius: 14,
            border: '1px solid rgba(255,236,203,0.18)',
            padding: '10px 14px',
            textAlign: 'right',
            maxWidth: 190,
          }}
        >
          <p style={{ fontSize: 11, fontFamily: 'Cormorant Garamond, serif', color: '#c4a882', fontWeight: 600, letterSpacing: '0.04em' }}>
            Benson Stone Co.
          </p>
          <p style={{ fontSize: 9, fontFamily: 'DM Mono, monospace', color: '#6b5f4a', marginTop: 2, letterSpacing: '0.02em' }}>
            1100 Eleventh St | Rockford, IL 61104
          </p>
          <p style={{ fontSize: 9, fontFamily: 'DM Mono, monospace', color: '#4a4035', marginTop: 1 }}>
            Campus Operations Map | 3D Site Plan
          </p>
        </div>
      </div>

      <AnimatePresence>
        {selectedLabel && selectedType && (
          <motion.div
            className="absolute top-4 z-20 pointer-events-none"
            style={{ left: '50%', transform: 'translateX(-50%)' }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            <Breadcrumb label={selectedLabel} type={selectedType} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-4 left-4 z-20 flex flex-col gap-2 max-md:bottom-2 max-md:left-2">
        <AnimatePresence>
          {showLegend && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.2 }}>
              <LegendPanel />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-2">
          <IconBtn onClick={() => setShowLegend((value) => !value)} active={showLegend} title="Toggle legend">
            <IconLegend />
          </IconBtn>
          <IconBtn onClick={handleReset} title="Reset camera view">
            <IconReset />
          </IconBtn>
        </div>
      </div>

      <AnimatePresence>
        {selectedId ? (
          <motion.div className="absolute bottom-4 right-4 z-20 pointer-events-none max-md:bottom-2 max-md:right-2" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}>
            <div
              style={{
                backdropFilter: 'blur(6px)',
                background: 'rgba(20,18,14,0.78)',
                borderRadius: 7,
                border: '1px solid rgba(196,184,152,0.1)',
                padding: '5px 11px',
                fontSize: 10,
                fontFamily: 'DM Mono, monospace',
                color: '#5a4f3a',
              }}
            >
              Esc to deselect | drag to orbit | scroll to zoom
            </div>
          </motion.div>
        ) : (
          <motion.div className="absolute bottom-4 right-4 z-20 pointer-events-none max-md:bottom-2 max-md:right-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div
              style={{
                backdropFilter: 'blur(6px)',
                background: 'rgba(20,18,14,0.6)',
                borderRadius: 7,
                border: '1px solid rgba(196,184,152,0.06)',
                padding: '5px 11px',
                fontSize: 10,
                fontFamily: 'DM Mono, monospace',
                color: '#3a332a',
                maxWidth: 190,
              }}
            >
              Click a building, yard, entrance, or door | drag to orbit | scroll to zoom
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
