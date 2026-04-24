import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { Entrance3D } from '../../data/benson/scene3d'
import type { EntityType } from '../../types'

interface Props {
  data: Entrance3D
  isSelected: boolean
  isHovered: boolean
  anySelected: boolean
  onHover: (id: string | null) => void
  onClick: (id: string, type: EntityType) => void
}

export function EntranceMarker({
  data,
  isSelected,
  isHovered,
  anySelected,
  onHover,
  onClick,
}: Props) {
  const poleRef = useRef<THREE.Mesh>(null!)
  const capRef = useRef<THREE.Mesh>(null!)

  useFrame(() => {
    if (!capRef.current) return
    const targetY = isSelected ? 1.0 : isHovered ? 0.75 : 0.5
    capRef.current.position.y = THREE.MathUtils.lerp(capRef.current.position.y, targetY, 0.1)
    // Pulsing scale on selected
    if (isSelected) {
      const s = 1 + Math.sin(Date.now() * 0.003) * 0.08
      capRef.current.scale.setScalar(s)
    } else {
      capRef.current.scale.setScalar(1)
    }
  })

  const dimmed = anySelected && !isSelected && !isHovered

  // Customer-facing = sky blue; operational = slate; scale house = warm amber
  const isScaleHouse = data.id === 'SITE-SCALE'
  const markerColor = isScaleHouse
    ? '#c4a050'
    : data.customerFacing
      ? '#4a8ab0'
      : '#7a8898'

  const labelColor = isScaleHouse
    ? '#c4a050'
    : data.customerFacing
      ? '#6aaad8'
      : '#8a9aaa'

  return (
    <group
      position={[data.x, 0, data.z]}
      onClick={(e) => { e.stopPropagation(); onClick(data.id, 'entrance') }}
      onPointerOver={(e) => { e.stopPropagation(); onHover(data.id) }}
      onPointerOut={() => onHover(null)}
    >
      {/* Slim pole */}
      <mesh ref={poleRef} position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.09, 0.6, 8]} />
        <meshStandardMaterial
          color={markerColor}
          roughness={0.5}
          metalness={0.3}
          emissive={isSelected ? markerColor : '#000000'}
          emissiveIntensity={isSelected ? 0.3 : 0}
          opacity={dimmed ? 0.25 : 1}
          transparent={dimmed}
        />
      </mesh>

      {/* Diamond cap */}
      <mesh ref={capRef} position={[0, 0.5, 0]} castShadow>
        <octahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial
          color={markerColor}
          roughness={0.4}
          metalness={0.35}
          emissive={isSelected ? markerColor : isHovered ? markerColor : '#000000'}
          emissiveIntensity={isSelected ? 0.55 : isHovered ? 0.25 : 0}
          opacity={dimmed ? 0.25 : 1}
          transparent={dimmed}
        />
      </mesh>

      {/* Label — shown on hover or always for high-vis entrances */}
      {(isHovered || isSelected || !anySelected) && (
        <Html
          position={[0, 1.4, 0]}
          center
          distanceFactor={18}
          style={{ pointerEvents: 'none' }}
        >
          <div style={{
            background: isSelected
              ? 'rgba(74,138,176,0.92)'
              : 'rgba(14,12,10,0.84)',
            color: isSelected ? '#f0f8ff' : labelColor,
            padding: '2px 7px',
            borderRadius: 4,
            fontSize: 9,
            fontFamily: 'DM Mono, monospace',
            fontWeight: isSelected ? 600 : 400,
            border: `1px solid ${isSelected ? 'rgba(74,138,176,0.5)' : `${labelColor}22`}`,
            whiteSpace: 'nowrap',
            userSelect: 'none',
            opacity: dimmed ? 0.18 : 1,
            transition: 'opacity 0.2s',
            letterSpacing: '0.03em',
          }}>
            {data.label}
          </div>
        </Html>
      )}
    </group>
  )
}
