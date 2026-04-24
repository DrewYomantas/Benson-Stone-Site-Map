import { useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapHotspot } from './MapHotspot'
import { Legend } from './Legend'
import { hotspots } from '../../data/benson/hotspots'
import type { EntityType, FilterState } from '../../types'

const MAP_IMAGE = '/map/benson-stone-map.jpg'
const MAP_PLACEHOLDER = false // real image at public/map/benson-stone-map.jpg

interface Props {
  selectedId: string | null
  hoveredId: string | null
  filters: FilterState
  onHover: (id: string | null) => void
  onSelect: (id: string, type: EntityType) => void
  onDeselect: () => void
}

function getVisibleHotspots(filters: FilterState) {
  return hotspots.filter((h) => {
    if (h.entityType === 'building' && !filters.buildings) return false
    if (h.entityType === 'yard' && !filters.yards) return false
    if (h.entityType === 'entrance' && !filters.entrances) return false
    if (h.entityType === 'door' && !filters.doors) return false
    return true
  })
}

export function CampusMapCanvas({
  selectedId,
  hoveredId,
  filters,
  onHover,
  onSelect,
  onDeselect,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const visibleHotspots = getVisibleHotspots(filters)
  const anySelected = selectedId !== null

  const selectedHotspot = hotspots.find((h) => h.entityId === selectedId)

  // Compute camera transform to focus on selected hotspot
  const getCameraTransform = () => {
    if (!selectedHotspot) return { x: 0, y: 0, scale: 1 }
    const { x, y } = selectedHotspot.position
    const scale = selectedHotspot.priority === 'high' ? 1.4 : selectedHotspot.priority === 'medium' ? 1.3 : 1.5

    // Translate so the selected hotspot moves toward center
    // (x,y are percentages of map image; we shift the map so hotspot is near center)
    const tx = (50 - x) * 0.6
    const ty = (50 - y) * 0.6

    return { x: `${tx}%`, y: `${ty}%`, scale }
  }

  const cam = getCameraTransform()

  const handleBackgroundClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-hotspot]')) return
    onDeselect()
  }, [onDeselect])

  return (
    <div
      ref={containerRef}
      className="flex-1 relative overflow-hidden bg-stone-950"
      onClick={handleBackgroundClick}
    >
      {/* Vignette overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 80px rgba(0,0,0,0.5)' }}
      />

      {/* Focus dimming overlay */}
      <AnimatePresence>
        {anySelected && (
          <motion.div
            className="absolute inset-0 z-[5] pointer-events-none bg-black/25"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Map + hotspots — animated camera */}
      <motion.div
        className="absolute inset-0 origin-center"
        animate={{ x: cam.x, y: cam.y, scale: cam.scale }}
        transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Map image */}
        <div className="absolute inset-0">
          {MAP_PLACEHOLDER ? (
            <div className="w-full h-full flex items-center justify-center bg-stone-900 relative">
              {/* Grid texture to hint at a map */}
              <div className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: 'linear-gradient(#c4a882 1px, transparent 1px), linear-gradient(90deg, #c4a882 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />
              <div className="text-center space-y-3 opacity-50">
                <p className="font-display text-3xl text-stone-400">Benson Stone Co.</p>
                <p className="font-mono text-xs text-stone-600 uppercase tracking-widest">
                  Drop map image at public/map/benson-stone-map.jpg
                </p>
                <p className="font-mono text-[10px] text-stone-700">
                  See README for PDF → JPG conversion instructions
                </p>
              </div>
            </div>
          ) : (
            <img
              src={MAP_IMAGE}
              alt="Benson Stone Campus Aerial Map"
              className="w-full h-full object-contain select-none"
              draggable={false}
            />
          )}
        </div>

        {/* Hotspot overlay */}
        <div className="absolute inset-0">
          {visibleHotspots.map((hs) => (
            <div key={hs.entityId} data-hotspot="true">
              <MapHotspot
                hotspot={hs}
                isSelected={selectedId === hs.entityId}
                isHovered={hoveredId === hs.entityId}
                anySelected={anySelected}
                onHover={onHover}
                onClick={onSelect}
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Legend — outside camera so it stays fixed */}
      <div className="absolute bottom-4 left-4 z-20">
        <Legend />
      </div>

      {/* Compass + address — top right */}
      <div className="absolute top-4 right-4 z-20 pointer-events-none">
        <div
          style={{
            backdropFilter: 'blur(8px)',
            background: 'rgba(26,26,26,0.80)',
            borderRadius: 10,
            border: '1px solid rgba(196,168,130,0.15)',
            padding: '8px 12px',
            textAlign: 'right',
          }}
        >
          <p style={{ fontSize: 11, fontFamily: 'Cormorant Garamond, serif', color: '#c4a882', fontWeight: 600, letterSpacing: '0.04em' }}>
            Benson Stone Co.
          </p>
          <p style={{ fontSize: 9, fontFamily: 'DM Mono, monospace', color: '#6b5f4a', marginTop: 2 }}>
            1100 Eleventh St · Rockford, IL 61104
          </p>
          <p style={{ fontSize: 9, fontFamily: 'DM Mono, monospace', color: '#4a4035', marginTop: 1 }}>
            2020 Customer Version
          </p>
        </div>
      </div>

      {/* Escape hint */}
      <AnimatePresence>
        {anySelected && (
          <motion.div
            className="absolute bottom-4 right-4 z-20 pointer-events-none"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
          >
            <div style={{
              backdropFilter: 'blur(6px)',
              background: 'rgba(26,26,26,0.75)',
              borderRadius: 8,
              border: '1px solid rgba(196,168,130,0.1)',
              padding: '5px 10px',
              fontSize: 10,
              fontFamily: 'DM Mono, monospace',
              color: '#6b5f4a',
            }}>
              Press Esc or click map to deselect
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
