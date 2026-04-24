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
  const capRef = useRef<THREE.Mesh>(null!)
  const haloRef = useRef<THREE.Mesh>(null!)
  const pulseRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const pulse = 1 + Math.sin(clock.elapsedTime * 2.4) * 0.08
    if (capRef.current) {
      const targetY = isSelected ? 1.05 : isHovered ? 0.82 : 0.58
      capRef.current.position.y = THREE.MathUtils.lerp(capRef.current.position.y, targetY, 0.1)
      capRef.current.scale.setScalar(isSelected ? pulse : 1)
    }
    if (haloRef.current) {
      haloRef.current.scale.setScalar(isSelected ? 1.14 : isHovered ? 1.05 : 1)
    }
    if (pulseRef.current) {
      const scale = isSelected ? 1.15 + Math.sin(clock.elapsedTime * 3) * 0.08 : isHovered ? 1.02 : 0.92
      pulseRef.current.scale.set(scale, scale, scale)
    }
  })

  const dimmed = anySelected && !isSelected && !isHovered
  const isScaleHouse = data.markerType === 'site-point'
  const isDock = data.markerType === 'dock'
  const markerColor = isScaleHouse ? '#c4a050' : isDock ? '#c17745' : data.customerFacing ? '#5f9dc2' : '#7d8a98'
  const labelColor = isScaleHouse ? '#d5b56a' : isDock ? '#dd9b6a' : data.customerFacing ? '#86c3ea' : '#9aa7b4'

  return (
    <group
      position={[data.x, 0, data.z]}
      onClick={(event) => {
        event.stopPropagation()
        onClick(data.id, 'entrance')
      }}
      onPointerOver={(event) => {
        event.stopPropagation()
        onHover(data.id)
      }}
      onPointerOut={() => onHover(null)}
    >
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]} receiveShadow>
        <ringGeometry args={isDock ? [0.26, 0.38, 24] : [0.18, 0.28, 24]} />
        <meshBasicMaterial color={markerColor} transparent opacity={dimmed ? 0.18 : 0.35} />
      </mesh>

      <mesh ref={pulseRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.016, 0]}>
        <ringGeometry args={isDock ? [0.41, 0.47, 24] : [0.29, 0.34, 24]} />
        <meshBasicMaterial color={markerColor} transparent opacity={dimmed ? 0.08 : isSelected ? 0.28 : 0.12} />
      </mesh>

      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.07, 0.6, 10]} />
        <meshStandardMaterial color={markerColor} roughness={0.46} metalness={0.28} transparent opacity={dimmed ? 0.24 : 1} />
      </mesh>

      <mesh ref={haloRef} position={[0, 0.6, 0]} castShadow>
        <sphereGeometry args={[isDock ? 0.12 : 0.09, 18, 18]} />
        <meshStandardMaterial color="#f7eddc" emissive={markerColor} emissiveIntensity={isSelected ? 0.9 : isHovered ? 0.4 : 0.12} transparent opacity={dimmed ? 0.24 : 0.85} />
      </mesh>

      <mesh ref={capRef} position={[0, 0.58, 0]} castShadow>
        {isDock ? <boxGeometry args={[0.3, 0.18, 0.3]} /> : isScaleHouse ? <cylinderGeometry args={[0.12, 0.15, 0.22, 6]} /> : <octahedronGeometry args={[0.2, 0]} />}
        <meshStandardMaterial color={markerColor} roughness={0.4} metalness={0.34} emissive={markerColor} emissiveIntensity={isSelected ? 0.6 : isHovered ? 0.25 : 0} transparent opacity={dimmed ? 0.24 : 1} />
      </mesh>

      {(isHovered || isSelected || !anySelected) && (
        <Html position={[0, 1.45, 0]} center distanceFactor={18} style={{ pointerEvents: 'none' }}>
          <div
            style={{
              background: isSelected ? 'rgba(24,20,16,0.94)' : 'rgba(14,12,10,0.84)',
              color: labelColor,
              padding: '2px 7px',
              borderRadius: 4,
              fontSize: 9,
              fontFamily: 'DM Mono, monospace',
              fontWeight: isSelected ? 600 : 400,
              border: `1px solid ${isSelected ? `${markerColor}99` : `${labelColor}22`}`,
              whiteSpace: 'nowrap',
              userSelect: 'none',
              opacity: dimmed ? 0.18 : 1,
              transition: 'opacity 0.2s',
              letterSpacing: '0.03em',
            }}
          >
            {data.label}
          </div>
        </Html>
      )}
    </group>
  )
}
