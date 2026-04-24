import { useCallback, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CampusScene } from '../scene/CampusScene'
import { getEntityById } from '../../data/benson'
import type { EntityType, FilterState } from '../../types'

interface Props {
  selectedId: string | null
  hoveredId: string | null
  selectedType: EntityType | null
  filters: FilterState
  exploringInterior: boolean
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

function IconMap() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" y1="3" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="21" />
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
    { color: '#7d5f4a', border: '#d3a75a', label: 'Verified footprint massing', shape: 'square' },
    { color: '#5d564a', border: '#8a7a5f', label: 'Yard boundary / work area', shape: 'square' },
    { color: '#35383b', border: '#9f9684', label: 'Roads and parking', shape: 'square' },
    { color: '#5f9dc2', border: '#5f9dc2', label: 'Customer entrance', shape: 'diamond' },
    { color: '#c17745', border: '#c17745', label: 'Loading / receiving', shape: 'diamond' },
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
                borderRadius: item.shape === 'diamond' ? '2px' : 3,
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
  onHover,
  onSelect,
  onDeselect,
}: Props) {
  const [showRefMap, setShowRefMap] = useState(false)
  const [showLegend, setShowLegend] = useState(false)
  const [resetSignal, setResetSignal] = useState(0)

  const selectedLabel = useMemo(() => {
    if (!selectedId) return null
    return getEntityById(selectedId)?.entity.displayName ?? selectedId
  }, [selectedId])

  const handleReset = useCallback(() => {
    setResetSignal((value) => value + 1)
  }, [])

  return (
    <div className="relative flex-1 overflow-hidden" style={{ background: '#1a1814' }}>
      <div className="absolute inset-0">
        <CampusScene
          selectedId={selectedId}
          hoveredId={hoveredId}
          selectedType={selectedType}
          filters={filters}
          exploringInterior={exploringInterior}
          showReferenceMap={showRefMap}
          resetSignal={resetSignal}
          onHover={onHover}
          onSelect={onSelect}
          onDeselect={onDeselect}
        />
      </div>

      <div className="absolute right-4 top-4 z-20 pointer-events-none">
        <div
          style={{
            backdropFilter: 'blur(10px)',
            background: 'rgba(20,18,14,0.82)',
            borderRadius: 10,
            border: '1px solid rgba(196,168,130,0.14)',
            padding: '8px 13px',
            textAlign: 'right',
          }}
        >
          <p style={{ fontSize: 11, fontFamily: 'Cormorant Garamond, serif', color: '#c4a882', fontWeight: 600, letterSpacing: '0.04em' }}>
            Benson Stone Co.
          </p>
          <p style={{ fontSize: 9, fontFamily: 'DM Mono, monospace', color: '#6b5f4a', marginTop: 2, letterSpacing: '0.02em' }}>
            1100 Eleventh St | Rockford, IL 61104
          </p>
          <p style={{ fontSize: 9, fontFamily: 'DM Mono, monospace', color: '#4a4035', marginTop: 1 }}>
            Campus Operations Map | Reference-driven 3D
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

      <div className="absolute bottom-4 left-4 z-20 flex flex-col gap-2">
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
          <IconBtn onClick={() => setShowRefMap((value) => !value)} active={showRefMap} title="Toggle reference underlay">
            <IconMap />
          </IconBtn>
          <IconBtn onClick={handleReset} title="Reset camera view">
            <IconReset />
          </IconBtn>
        </div>
      </div>

      <AnimatePresence>
        {selectedId ? (
          <motion.div className="absolute bottom-4 right-4 z-20 pointer-events-none" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}>
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
          <motion.div className="absolute bottom-4 right-4 z-20 pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
              }}
            >
              Click a building, yard, or entrance | drag to orbit | scroll to zoom
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
