import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { Yard3D } from '../../data/benson/scene3d'
import type { EntityType } from '../../types'

interface Props {
  data: Yard3D
  isSelected: boolean
  isHovered: boolean
  anySelected: boolean
  onHover: (id: string | null) => void
  onClick: (id: string, type: EntityType) => void
}

export function YardSurface({
  data,
  isSelected,
  isHovered,
  anySelected,
  onHover,
  onClick,
}: Props) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const borderRef = useRef<THREE.Mesh>(null!)

  useFrame(() => {
    if (!meshRef.current) return
    // Subtle lift on hover/select
    const targetY = isSelected ? 0.04 : isHovered ? 0.02 : 0
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.1)
    if (borderRef.current) borderRef.current.position.y = meshRef.current.position.y - 0.005
  })

  const dimmed = anySelected && !isSelected && !isHovered

  return (
    <group
      onClick={(e) => { e.stopPropagation(); onClick(data.id, 'yard') }}
      onPointerOver={(e) => { e.stopPropagation(); onHover(data.id) }}
      onPointerOut={() => onHover(null)}
    >
      {/* Border frame — slightly larger than surface */}
      <mesh
        ref={borderRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[data.x, -0.005, data.z]}
        receiveShadow
      >
        <planeGeometry args={[data.width + 0.25, data.depth + 0.25]} />
        <meshStandardMaterial
          color={isSelected ? '#c4a050' : isHovered ? '#8a7850' : data.borderColor}
          roughness={0.9}
          opacity={dimmed ? 0.3 : 1}
          transparent={dimmed}
        />
      </mesh>

      {/* Main yard surface */}
      <mesh
        ref={meshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[data.x, 0, data.z]}
        receiveShadow
      >
        <planeGeometry args={[data.width, data.depth]} />
        <meshStandardMaterial
          color={data.surfaceColor}
          roughness={0.95}
          emissive={isSelected ? '#5a4820' : isHovered ? '#3a3015' : '#000000'}
          emissiveIntensity={isSelected ? 0.12 : isHovered ? 0.06 : 0}
          opacity={dimmed ? 0.3 : 1}
          transparent={dimmed}
        />
      </mesh>

      {/* Yard label */}
      <Html
        position={[data.x, 0.5, data.z]}
        center
        distanceFactor={18}
        style={{ pointerEvents: 'none' }}
      >
        <div style={{
          background: isSelected
            ? 'rgba(160,200,120,0.88)'
            : 'rgba(18,16,12,0.82)',
          color: isSelected ? '#0a1408' : '#a0b890',
          padding: '2px 8px',
          borderRadius: 4,
          fontSize: 10,
          fontFamily: 'DM Mono, monospace',
          fontWeight: isSelected ? 600 : 400,
          border: `1px solid ${isSelected ? 'rgba(140,190,100,0.5)' : 'rgba(140,180,100,0.12)'}`,
          whiteSpace: 'nowrap',
          userSelect: 'none',
          opacity: dimmed ? 0.2 : 1,
          transition: 'opacity 0.25s',
          letterSpacing: '0.04em',
        }}>
          {data.label}
        </div>
      </Html>
    </group>
  )
}
