import { useRef } from 'react'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Door3D } from '../../data/benson/scene3d'
import type { EntityType } from '../../types'

interface Props {
  data: Door3D
  isSelected: boolean
  isHovered: boolean
  anySelected: boolean
  onHover: (id: string | null) => void
  onClick: (id: string, type: EntityType) => void
}

export function DoorMarker({
  data,
  isSelected,
  isHovered,
  anySelected,
  onHover,
  onClick,
}: Props) {
  const markerRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    if (!markerRef.current) return
    const targetY = isSelected ? 0.58 : isHovered ? 0.42 : 0.28
    markerRef.current.position.y = THREE.MathUtils.lerp(markerRef.current.position.y, targetY, 0.12)
    const pulse = isSelected ? 1 + Math.sin(clock.elapsedTime * 3) * 0.08 : isHovered ? 1.08 : 1
    markerRef.current.scale.setScalar(pulse)
  })

  const dimmed = anySelected && !isSelected && !isHovered

  return (
    <group
      position={[data.x, 0, data.z]}
      onClick={(event) => {
        event.stopPropagation()
        onClick(data.id, 'door')
      }}
      onPointerOver={(event) => {
        event.stopPropagation()
        onHover(data.id)
      }}
      onPointerOut={() => onHover(null)}
    >
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
        <ringGeometry args={[0.2, 0.32, 28]} />
        <meshBasicMaterial color="#d4483d" transparent opacity={dimmed ? 0.12 : 0.34} />
      </mesh>

      <mesh ref={markerRef} position={[0, 0.28, 0]} castShadow>
        <cylinderGeometry args={[0.26, 0.26, 0.12, 28]} />
        <meshStandardMaterial
          color={isSelected ? '#ff6b5d' : '#c93632'}
          roughness={0.48}
          metalness={0.08}
          emissive="#8c1f1c"
          emissiveIntensity={isSelected ? 0.45 : isHovered ? 0.25 : 0.08}
          transparent
          opacity={dimmed ? 0.24 : 1}
        />
      </mesh>

      {(isSelected || isHovered || !anySelected) && (
        <Html position={[0, 0.72, 0]} center distanceFactor={17} style={{ pointerEvents: 'none' }}>
          <div
            style={{
              minWidth: 24,
              height: 22,
              padding: '0 6px',
              borderRadius: 11,
              background: isSelected ? '#f35f52' : 'rgba(185,48,43,0.95)',
              border: '1px solid rgba(255,225,210,0.45)',
              color: '#fff5eb',
              fontSize: 10,
              fontFamily: 'DM Mono, monospace',
              fontWeight: 700,
              lineHeight: '20px',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
              opacity: dimmed ? 0.2 : 1,
            }}
          >
            {data.number}
          </div>
        </Html>
      )}
    </group>
  )
}
