import { motion } from 'framer-motion'
import type { Hotspot, EntityType } from '../../types'

interface Props {
  hotspot: Hotspot
  isSelected: boolean
  isHovered: boolean
  anySelected: boolean
  onHover: (id: string | null) => void
  onClick: (id: string, type: EntityType) => void
}

const SIZE: Record<string, { w: number; h: number; ring: number }> = {
  high: { w: 48, h: 32, ring: 6 },
  medium: { w: 36, h: 24, ring: 5 },
  low: { w: 22, h: 22, ring: 4 },
}

const TYPE_STYLE: Record<EntityType, { bg: string; border: string; text: string; glow: string; selectedBg: string }> = {
  building: {
    bg: 'rgba(139,90,43,0.85)',
    border: '#c4a882',
    text: '#faf8f4',
    glow: 'rgba(196,168,130,0.6)',
    selectedBg: 'rgba(200,140,60,0.95)',
  },
  yard: {
    bg: 'rgba(30,80,30,0.80)',
    border: '#5a9e5a',
    text: '#c8f0c8',
    glow: 'rgba(90,160,90,0.5)',
    selectedBg: 'rgba(45,110,45,0.95)',
  },
  entrance: {
    bg: 'rgba(20,70,110,0.85)',
    border: '#5aabde',
    text: '#c8eaf8',
    glow: 'rgba(90,170,220,0.5)',
    selectedBg: 'rgba(30,100,160,0.95)',
  },
  door: {
    bg: 'rgba(180,30,30,0.90)',
    border: '#ff6060',
    text: '#fff',
    glow: 'rgba(200,60,60,0.5)',
    selectedBg: 'rgba(200,50,50,0.98)',
  },
}

export function MapHotspot({ hotspot, isSelected, isHovered, anySelected, onHover, onClick }: Props) {
  const { entityId, entityType, position, label, priority } = hotspot
  const sz = SIZE[priority]
  const style = TYPE_STYLE[entityType]

  const dimmed = anySelected && !isSelected && !isHovered

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: isSelected ? 30 : isHovered ? 20 : priority === 'high' ? 10 : priority === 'medium' ? 5 : 2,
        cursor: 'pointer',
        userSelect: 'none',
      }}
      animate={{
        opacity: dimmed ? 0.3 : 1,
        scale: isSelected ? 1.25 : isHovered ? 1.15 : 1,
        filter: isSelected
          ? `drop-shadow(0 0 12px ${style.glow}) drop-shadow(0 4px 8px rgba(0,0,0,0.6))`
          : isHovered
          ? `drop-shadow(0 0 8px ${style.glow}) drop-shadow(0 3px 6px rgba(0,0,0,0.4))`
          : 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
      }}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      onHoverStart={() => onHover(entityId)}
      onHoverEnd={() => onHover(null)}
      onClick={() => onClick(entityId, entityType)}
    >
      {priority === 'high' || priority === 'medium' ? (
        // Box hotspot for buildings and yards
        <div
          style={{
            minWidth: sz.w,
            height: sz.h,
            background: isSelected ? style.selectedBg : style.bg,
            border: `1.5px solid ${style.border}`,
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 6px',
            backdropFilter: 'blur(4px)',
            boxShadow: isSelected
              ? `0 0 0 2px ${style.border}66, inset 0 1px 0 rgba(255,255,255,0.1)`
              : 'inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          <span style={{
            color: style.text,
            fontSize: priority === 'high' ? 11 : 10,
            fontFamily: 'DM Mono, monospace',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            letterSpacing: '0.04em',
          }}>
            {label}
          </span>
        </div>
      ) : (
        // Circle hotspot for doors
        <div
          style={{
            width: sz.w,
            height: sz.h,
            background: isSelected ? style.selectedBg : style.bg,
            border: `1.5px solid ${style.border}`,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(2px)',
          }}
        >
          <span style={{
            color: style.text,
            fontSize: 9,
            fontFamily: 'DM Mono, monospace',
            fontWeight: 500,
          }}>
            {label}
          </span>
        </div>
      )}

      {/* Selected pulse ring */}
      {isSelected && (
        <motion.div
          style={{
            position: 'absolute',
            inset: -sz.ring,
            borderRadius: priority === 'low' ? '50%' : 10,
            border: `1.5px solid ${style.border}`,
            pointerEvents: 'none',
          }}
          animate={{ opacity: [0.8, 0.2, 0.8], scale: [1, 1.08, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </motion.div>
  )
}
