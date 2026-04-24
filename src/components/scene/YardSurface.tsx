import { useEffect, useMemo, useRef } from 'react'
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

function getCenter(points: Yard3D['footprint']) {
  const xs = points.map(([x]) => x)
  const zs = points.map(([, z]) => z)
  return [
    (Math.min(...xs) + Math.max(...xs)) / 2,
    (Math.min(...zs) + Math.max(...zs)) / 2,
  ] as const
}

function makeGeometry(points: Yard3D['footprint']) {
  const [cx, cz] = getCenter(points)
  const shape = new THREE.Shape()
  points.forEach(([x, z], index) => {
    if (index === 0) shape.moveTo(x - cx, -(z - cz))
    else shape.lineTo(x - cx, -(z - cz))
  })
  shape.closePath()
  const geometry = new THREE.ShapeGeometry(shape)
  geometry.rotateX(-Math.PI / 2)
  return geometry
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
  const center = useMemo(() => getCenter(data.footprint), [data.footprint])
  const geometry = useMemo(() => makeGeometry(data.footprint), [data.footprint])
  const borderGeometry = useMemo(() => new THREE.EdgesGeometry(geometry, 20), [geometry])

  useEffect(() => () => {
    geometry.dispose()
    borderGeometry.dispose()
  }, [borderGeometry, geometry])

  useFrame(() => {
    if (!meshRef.current) return
    const targetY = isSelected ? 0.06 : isHovered ? 0.03 : 0.01
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.1)
  })

  const dimmed = anySelected && !isSelected && !isHovered
  const labelPos = data.labelPosition ?? center

  return (
    <group
      position={[center[0], 0, center[1]]}
      onClick={(event) => {
        event.stopPropagation()
        onClick(data.id, 'yard')
      }}
      onPointerOver={(event) => {
        event.stopPropagation()
        onHover(data.id)
      }}
      onPointerOut={() => onHover(null)}
    >
      <mesh ref={meshRef} geometry={geometry} receiveShadow>
        <meshStandardMaterial
          color={data.surfaceColor}
          roughness={0.97}
          metalness={0.01}
          emissive={isSelected ? '#4e3818' : isHovered ? '#30210f' : '#000000'}
          emissiveIntensity={isSelected ? 0.14 : isHovered ? 0.08 : 0}
          opacity={dimmed ? 0.28 : 0.95}
          transparent
        />
      </mesh>

      <lineSegments geometry={borderGeometry} position={[0, 0.04, 0]}>
        <lineBasicMaterial color={isSelected ? '#d3b56f' : data.borderColor} transparent opacity={dimmed ? 0.3 : 0.85} />
      </lineSegments>

      <Html
        position={[labelPos[0] - center[0], 0.45, labelPos[1] - center[1]]}
        center
        distanceFactor={18}
        style={{ pointerEvents: 'none' }}
      >
        <div
          style={{
            background: isSelected ? 'rgba(160,200,120,0.88)' : 'rgba(18,16,12,0.82)',
            color: isSelected ? '#0a1408' : '#b3c596',
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
          }}
        >
          {data.label}
        </div>
      </Html>
    </group>
  )
}
