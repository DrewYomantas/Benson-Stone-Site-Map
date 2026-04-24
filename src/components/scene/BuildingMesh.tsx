import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { Building3D } from '../../data/benson/scene3d'
import type { EntityType } from '../../types'

const ROOF_THICKNESS = 0.16
const LIFT_HOVER = 0.25
const LIFT_SELECT = 0.4
const ROOF_EXPLORE_LIFT = 3

interface Props {
  data: Building3D
  isSelected: boolean
  isHovered: boolean
  anySelected: boolean
  exploringInterior: boolean
  onHover: (id: string | null) => void
  onClick: (id: string, type: EntityType) => void
}

function makeShape(points: Building3D['footprint']) {
  const shape = new THREE.Shape()
  const [cx, cz] = dataCenter(points)
  points.forEach(([x, z], index) => {
    const px = x - cx
    const pz = z - cz
    if (index === 0) shape.moveTo(px, -pz)
    else shape.lineTo(px, -pz)
  })
  shape.closePath()
  return shape
}

function dataCenter(points: Building3D['footprint']) {
  const xs = points.map(([x]) => x)
  const zs = points.map(([, z]) => z)
  return [
    (Math.min(...xs) + Math.max(...xs)) / 2,
    (Math.min(...zs) + Math.max(...zs)) / 2,
  ] as const
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
  const roofMatRef = useRef<THREE.MeshStandardMaterial>(null!)
  const center = useMemo(() => dataCenter(data.footprint), [data.footprint])

  const shape = useMemo(() => makeShape(data.footprint), [data.footprint])
  const wallGeometry = useMemo(() => {
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: data.height,
      bevelEnabled: false,
    })
    geometry.rotateX(-Math.PI / 2)
    return geometry
  }, [data.height, shape])
  const roofGeometry = useMemo(() => {
    const geometry = new THREE.ShapeGeometry(shape)
    geometry.rotateX(-Math.PI / 2)
    return geometry
  }, [shape])
  const edgeGeometry = useMemo(() => new THREE.EdgesGeometry(wallGeometry, 30), [wallGeometry])

  useEffect(() => () => {
    wallGeometry.dispose()
    roofGeometry.dispose()
    edgeGeometry.dispose()
  }, [edgeGeometry, roofGeometry, wallGeometry])

  useFrame(() => {
    const group = groupRef.current
    if (!group) return

    const targetLift = isSelected ? LIFT_SELECT : isHovered ? LIFT_HOVER : 0
    group.position.y = THREE.MathUtils.lerp(group.position.y, targetLift, 0.09)

    if (roofRef.current) {
      const targetRoofY = data.height + ROOF_THICKNESS / 2 + (exploringInterior ? ROOF_EXPLORE_LIFT : 0)
      roofRef.current.position.y = THREE.MathUtils.lerp(roofRef.current.position.y, targetRoofY, 0.055)
    }

    if (wallMatRef.current) {
      const targetOpacity = exploringInterior ? 0.18 : 1
      const opacity = THREE.MathUtils.lerp(wallMatRef.current.opacity, targetOpacity, 0.055)
      wallMatRef.current.opacity = opacity
      wallMatRef.current.transparent = opacity < 0.98
    }

    if (roofMatRef.current) {
      roofMatRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        roofMatRef.current.emissiveIntensity,
        isSelected ? 0.08 : isHovered ? 0.04 : 0,
        0.12
      )
    }
  })

  const dimmed = anySelected && !isSelected && !isHovered
  const wallRoughness = data.wallMaterial === 'metal' ? 0.45 : data.wallMaterial === 'stone' ? 0.88 : 0.72
  const wallMetalness = data.wallMaterial === 'metal' ? 0.18 : 0.04
  const roofRoughness = data.roofMaterial === 'membrane' ? 0.94 : data.roofMaterial === 'stone' ? 0.82 : 0.58
  const roofMetalness = data.roofMaterial === 'metal' ? 0.24 : 0.08
  const labelPos = data.labelPosition ?? center

  return (
    <group
      ref={groupRef}
      position={[center[0], 0, center[1]]}
      onClick={(event) => {
        event.stopPropagation()
        onClick(data.id, 'building')
      }}
      onPointerOver={(event) => {
        event.stopPropagation()
        onHover(data.id)
      }}
      onPointerOut={() => onHover(null)}
    >
      <mesh geometry={wallGeometry} castShadow receiveShadow>
        <meshStandardMaterial
          ref={wallMatRef}
          color={data.wallColor}
          roughness={wallRoughness}
          metalness={wallMetalness}
          emissive={isSelected ? '#8b6524' : isHovered ? '#4d3511' : '#000000'}
          emissiveIntensity={isSelected ? 0.16 : isHovered ? 0.08 : 0}
          opacity={dimmed ? 0.35 : 1}
          transparent={dimmed}
        />
      </mesh>

      <lineSegments geometry={edgeGeometry} position={[0, 0.02, 0]}>
        <lineBasicMaterial color={isSelected ? '#d3a75a' : '#3a3027'} transparent opacity={dimmed ? 0.28 : 0.6} />
      </lineSegments>

      <mesh
        ref={roofRef}
        geometry={roofGeometry}
        position={[0, data.height + ROOF_THICKNESS / 2, 0]}
        castShadow
      >
        <meshStandardMaterial
          ref={roofMatRef}
          color={data.roofColor}
          roughness={roofRoughness}
          metalness={roofMetalness}
          emissive={isSelected ? '#b98a38' : isHovered ? '#5a4520' : '#000000'}
          transparent={dimmed}
          opacity={dimmed ? 0.35 : 1}
          polygonOffset
          polygonOffsetFactor={-1}
        />
      </mesh>

      {exploringInterior && (
        <mesh geometry={roofGeometry} position={[0, 0.04, 0]}>
          <meshStandardMaterial color="#2a261f" roughness={0.96} metalness={0.02} />
        </mesh>
      )}

      {exploringInterior && (
        <Html position={[0, 1.15, 0]} center style={{ pointerEvents: 'none' }}>
          <div
            style={{
              background: 'rgba(18,16,12,0.9)',
              border: '1px solid rgba(196,160,80,0.28)',
              borderRadius: 5,
              padding: '5px 10px',
              minWidth: 150,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 9,
                fontFamily: 'DM Mono, monospace',
                color: '#c4a050',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 3,
              }}
            >
              Interior not yet mapped
            </div>
            <div
              style={{
                fontSize: 9,
                fontFamily: 'DM Mono, monospace',
                color: '#675a48',
                letterSpacing: '0.03em',
              }}
            >
              On-site verification required
            </div>
          </div>
        </Html>
      )}

      <Html
        position={[labelPos[0] - center[0], data.height + 0.7, labelPos[1] - center[1]]}
        center
        distanceFactor={18}
        style={{ pointerEvents: 'none' }}
      >
        <div
          style={{
            background: isSelected ? 'rgba(196,150,48,0.94)' : 'rgba(18,16,12,0.84)',
            color: isSelected ? '#14100a' : '#d8c9b3',
            padding: '3px 9px',
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
          }}
        >
          {data.label}
        </div>
      </Html>
    </group>
  )
}
