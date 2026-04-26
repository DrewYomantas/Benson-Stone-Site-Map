import { useEffect, useMemo } from 'react'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { CAMPUS_WORLD, getFootprintBounds, scene3dSiteSurfaces, type FootprintPoint, type SiteSurface3D } from '../../data/benson/scene3d'

const STREET_LINES = [
  { label: '10th Ave', position: [0, 0.03, 9.15] as const, width: 44, depth: 1.2, color: '#c8b79a' },
  { label: 'Parmalee St', position: [12.7, 0.035, 0.8] as const, width: 1.1, depth: 21, color: '#c8b79a' },
  { label: '10th St', position: [-10.9, 0.035, -4.2] as const, width: 1.0, depth: 31, color: '#bda984' },
]

const RAIL_POINTS = [
  new THREE.Vector3(-24, 0.06, -14.8),
  new THREE.Vector3(-13, 0.06, -12.2),
  new THREE.Vector3(-2, 0.06, -9.2),
  new THREE.Vector3(10, 0.06, -5.6),
  new THREE.Vector3(24, 0.06, -1.8),
]

function getCenter(points: FootprintPoint[]) {
  const bounds = getFootprintBounds(points)
  return [(bounds.minX + bounds.maxX) / 2, (bounds.minZ + bounds.maxZ) / 2] as const
}

function buildShapeGeometry(points: FootprintPoint[]) {
  const [cx, cz] = getCenter(points)
  const shape = new THREE.Shape()
  points.forEach(([x, z], index) => {
    if (index === 0) shape.moveTo(x - cx, -(z - cz))
    else shape.lineTo(x - cx, -(z - cz))
  })
  shape.closePath()
  const geometry = new THREE.ShapeGeometry(shape)
  geometry.rotateX(-Math.PI / 2)
  return { geometry, center: [cx, cz] as const }
}

function ParkingStripes({ surface }: { surface: SiteSurface3D }) {
  const bounds = useMemo(() => getFootprintBounds(surface.footprint), [surface.footprint])
  const lines = useMemo(() => {
    const result: [THREE.Vector3, THREE.Vector3][] = []
    const width = bounds.maxX - bounds.minX
    const count = Math.max(5, Math.floor(width / 1.45))
    for (let index = 0; index < count; index += 1) {
      const x = bounds.minX + 0.7 + index * 1.35
      result.push([
        new THREE.Vector3(x, 0.09, bounds.minZ + 0.45),
        new THREE.Vector3(x - 0.6, 0.09, bounds.maxZ - 0.45),
      ])
    }
    return result
  }, [bounds.maxX, bounds.maxZ, bounds.minX, bounds.minZ])

  if (surface.kind !== 'parking' || !surface.stripeColor) return null

  return (
    <>
      {lines.map((points, index) => (
        <Line key={`${surface.id}-${index}`} points={points} color={surface.stripeColor} transparent opacity={0.78} lineWidth={1.05} />
      ))}
    </>
  )
}

function SiteSurface({ surface }: { surface: SiteSurface3D }) {
  const built = useMemo(() => buildShapeGeometry(surface.footprint), [surface.footprint])
  const borderGeometry = useMemo(() => new THREE.EdgesGeometry(built.geometry, 20), [built.geometry])

  useEffect(() => () => {
    built.geometry.dispose()
    borderGeometry.dispose()
  }, [borderGeometry, built.geometry])

  return (
    <group position={[built.center[0], 0, built.center[1]]}>
      <mesh geometry={built.geometry} position={[0, 0.035, 0]} receiveShadow>
        <meshStandardMaterial
          color={surface.color}
          roughness={surface.kind === 'contractor' ? 0.86 : 0.76}
          metalness={0.01}
          transparent
          opacity={surface.opacity}
        />
      </mesh>

      {surface.borderColor && (
        <lineSegments geometry={borderGeometry} position={[0, 0.085, 0]}>
          <lineBasicMaterial color={surface.borderColor} transparent opacity={0.82} />
        </lineSegments>
      )}

      <ParkingStripes surface={surface} />
    </group>
  )
}

function MaterialStacks() {
  const stacks = [
    [-18.4, -10.9], [-17.4, -10.6], [-16.4, -10.3], [-15.4, -10.0],
    [4.2, 5.1], [5.2, 5.1], [6.2, 5.1], [7.2, 5.1], [8.2, 5.1], [9.2, 5.1],
    [4.4, 6.6], [5.4, 6.6], [6.4, 6.6], [7.4, 6.6], [8.4, 6.6],
    [3.2, 13.0], [4.2, 13.0], [5.2, 13.0], [6.2, 13.0], [7.2, 13.0],
  ] as const

  return (
    <group>
      {stacks.map(([x, z], index) => (
        <mesh key={`${x}-${z}-${index}`} position={[x, 0.16, z]} castShadow receiveShadow>
          <boxGeometry args={[0.72, 0.22, 0.34]} />
          <meshStandardMaterial color={index % 3 === 0 ? '#d7d1c1' : index % 3 === 1 ? '#b9b09c' : '#8f897d'} roughness={0.82} />
        </mesh>
      ))}
    </group>
  )
}

function LandscapeDetails() {
  const trees = [
    [24.6, -1.6], [25.4, 1.0], [24.0, 5.8], [-24.4, -16.2], [-22.6, -17.0],
    [-24.6, 10.8], [-22.8, 12.4], [17.8, 13.6], [20.2, 12.8],
  ] as const
  const signs = [
    { label: 'Showrooms', x: 19.5, z: 3.5, color: '#5f9dc2' },
    { label: 'Granite', x: 8.8, z: -2.1, color: '#d3a75a' },
    { label: 'Yard Pickup', x: 7.9, z: 6.5, color: '#dfc27b' },
  ] as const

  return (
    <group>
      {trees.map(([x, z], index) => (
        <group key={`${x}-${z}`} position={[x, 0, z]}>
          <mesh position={[0, 0.42, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.11, 0.84, 8]} />
            <meshStandardMaterial color="#6d4a2d" roughness={0.85} />
          </mesh>
          <mesh position={[0, 1.02, 0]} castShadow>
            <sphereGeometry args={[0.58 + (index % 3) * 0.08, 12, 10]} />
            <meshStandardMaterial color={index % 2 === 0 ? '#52643b' : '#627444'} roughness={0.9} />
          </mesh>
        </group>
      ))}

      {signs.map((sign) => (
        <group key={sign.label} position={[sign.x, 0, sign.z]}>
          <mesh position={[0, 0.55, 0]} castShadow>
            <boxGeometry args={[0.08, 1.1, 0.08]} />
            <meshStandardMaterial color="#4a3424" roughness={0.78} />
          </mesh>
          <mesh position={[0, 1.22, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <boxGeometry args={[1.2, 0.38, 0.07]} />
            <meshStandardMaterial color={sign.color} roughness={0.66} metalness={0.04} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function StreetLabels() {
  return (
    <>
      {STREET_LINES.map((street) => (
        <group key={street.label} position={street.position}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[street.width, street.depth]} />
            <meshBasicMaterial color={street.color} transparent opacity={0.11} depthWrite={false} />
          </mesh>
        </group>
      ))}
      <Line points={RAIL_POINTS} color="#9b8366" transparent opacity={0.65} lineWidth={1.4} />
      <Line points={RAIL_POINTS.map((point) => point.clone().add(new THREE.Vector3(0, 0.01, 0.42)))} color="#9b8366" transparent opacity={0.45} lineWidth={1.2} />
    </>
  )
}

export function GroundPlane() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 0]} receiveShadow>
        <planeGeometry args={[CAMPUS_WORLD.groundWidth, CAMPUS_WORLD.groundDepth]} />
        <meshStandardMaterial color="#3d4037" roughness={0.96} metalness={0} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]} receiveShadow>
        <planeGeometry args={[CAMPUS_WORLD.campusWidth + 8, CAMPUS_WORLD.campusDepth + 8]} />
        <meshStandardMaterial color="#d4c5a6" roughness={0.92} metalness={0} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.055, 0]} receiveShadow>
        <planeGeometry args={[CAMPUS_WORLD.campusWidth + 1.8, CAMPUS_WORLD.campusDepth + 1.8]} />
        <meshStandardMaterial color="#b8a985" roughness={0.9} metalness={0} />
      </mesh>

      <StreetLabels />

      {scene3dSiteSurfaces.map((surface) => (
        <SiteSurface key={surface.id} surface={surface} />
      ))}

      <MaterialStacks />
      <LandscapeDetails />
    </group>
  )
}
