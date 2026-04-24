import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { Building3D } from '../../data/benson/scene3d'
import type { EntityType } from '../../types'

const ROOF_THICKNESS = 0.18
const LIFT_HOVER = 0.35
const LIFT_SELECT = 0.5
const ROOF_EXPLORE_LIFT = 3.2

interface Props {
  data: Building3D
  isSelected: boolean
  isHovered: boolean
  anySelected: boolean
  exploringInterior: boolean
  onHover: (id: string | null) => void
  onClick: (id: string, type: EntityType) => void
}

export function BuildingMesh({
  data,
  isSelected,
  isHovered,
  anySelected,
  exploringInterior,
  onHover,
  onClick,
}: Props) {
  const groupRef = useRef<THREE.Group>(null!)
  const roofRef = useRef<THREE.Mesh>(null!)
  const wallMatRef = useRef<THREE.MeshStandardMaterial>(null!)

  const roofRestY = data.height / 2 + ROOF_THICKNESS / 2

  useFrame(() => {
    if (!groupRef.current) return

    // Lift group on hover/select
    const targetLift = isSelected ? LIFT_SELECT : isHovered ? LIFT_HOVER : 0
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetLift,
      0.09
    )

    // Roof lifts on interior exploration
    if (roofRef.current) {
      const targetRoofY = roofRestY + (exploringInterior ? ROOF_EXPLORE_LIFT : 0)
      roofRef.current.position.y = THREE.MathUtils.lerp(
        roofRef.current.position.y,
        targetRoofY,
        0.055
      )
    }

    // Wall opacity fades on interior exploration
    if (wallMatRef.current) {
      const targetOpacity = exploringInterior ? 0.14 : 1.0
      const newOpacity = THREE.MathUtils.lerp(wallMatRef.current.opacity, targetOpacity, 0.055)
      wallMatRef.current.opacity = newOpacity
      wallMatRef.current.transparent = newOpacity < 0.98
      wallMatRef.current.needsUpdate = true
    }
  })

  const dimmed = anySelected && !isSelected && !isHovered
  const emissiveColor = isSelected ? '#b88c30' : isHovered ? '#7a6020' : '#000000'
  const emissiveIntensity = isSelected ? 0.18 : isHovered ? 0.09 : 0

  return (
    <group
      ref={groupRef}
      position={[data.x, 0, data.z]}
      onClick={(e) => { e.stopPropagation(); onClick(data.id, 'building') }}
      onPointerOver={(e) => { e.stopPropagation(); onHover(data.id) }}
      onPointerOut={() => onHover(null)}
    >
      {/* ── Building body ───────────────────────────────────── */}
      <mesh
        position={[0, data.height / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[data.width, data.height, data.depth]} />
        <meshStandardMaterial
          ref={wallMatRef}
          color={data.wallColor}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
          roughness={0.72}
          metalness={0.04}
        />
      </mesh>

      {/* ── Roof cap ─────────────────────────────────────────── */}
      <mesh
        ref={roofRef}
        position={[0, roofRestY, 0]}
        castShadow
      >
        <boxGeometry args={[data.width + 0.18, ROOF_THICKNESS, data.depth + 0.18]} />
        <meshStandardMaterial
          color={data.roofColor}
          roughness={0.82}
          metalness={0.08}
          emissive={isSelected ? '#c49030' : '#000000'}
          emissiveIntensity={isSelected ? 0.06 : 0}
        />
      </mesh>

      {/* ── Interior floor (visible during cutaway) ──────────── */}
      {exploringInterior && (
        <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[data.width - 0.25, data.depth - 0.25]} />
          <meshStandardMaterial color="#2a2620" roughness={0.95} />
        </mesh>
      )}

      {/* ── Interior "not yet mapped" label ──────────────────── */}
      {exploringInterior && (
        <Html
          position={[0, 1.2, 0]}
          center
          style={{ pointerEvents: 'none' }}
        >
          <div style={{
            background: 'rgba(20,16,10,0.88)',
            border: '1px solid rgba(196,160,80,0.3)',
            borderRadius: 5,
            padding: '5px 10px',
            textAlign: 'center',
            minWidth: 140,
          }}>
            <div style={{
              fontSize: 9,
              fontFamily: 'DM Mono, monospace',
              color: '#c4a050',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 3,
            }}>
              Interior — not yet mapped
            </div>
            <div style={{
              fontSize: 9,
              fontFamily: 'DM Mono, monospace',
              color: '#5a5040',
              letterSpacing: '0.03em',
            }}>
              On-site verification required
            </div>
          </div>
        </Html>
      )}

      {/* ── Building label ────────────────────────────────────── */}
      <Html
        position={[0, data.height + 0.7, 0]}
        center
        distanceFactor={18}
        style={{ pointerEvents: 'none' }}
      >
        <div style={{
          background: isSelected
            ? 'rgba(196,150,48,0.94)'
            : 'rgba(18,16,12,0.86)',
          color: isSelected ? '#14100a' : '#c8b898',
          padding: '2px 9px',
          borderRadius: 4,
          fontSize: 11,
          fontFamily: 'DM Mono, monospace',
          fontWeight: isSelected ? 700 : 400,
          border: `1px solid ${isSelected ? 'rgba(196,150,48,0.55)' : 'rgba(200,184,152,0.12)'}`,
          whiteSpace: 'nowrap',
          userSelect: 'none',
          opacity: dimmed ? 0.22 : 1,
          transition: 'opacity 0.25s',
          letterSpacing: '0.05em',
        }}>
          {data.label}
        </div>
      </Html>
    </group>
  )
}
