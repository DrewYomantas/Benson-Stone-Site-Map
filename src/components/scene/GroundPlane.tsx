import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { CAMPUS_WORLD, getFootprintBounds, scene3dSiteSurfaces, type FootprintPoint, type SiteSurface3D } from '../../data/benson/scene3d'

interface Props {
  showReferenceMap: boolean
}

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

function ReferenceOverlay({ showReferenceMap }: Props) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null)
  const [failed, setFailed] = useState(false)
  const materialRef = useRef<THREE.MeshBasicMaterial>(null!)

  useEffect(() => {
    let active = true
    const loader = new THREE.TextureLoader()
    loader.load(
      CAMPUS_WORLD.referenceImage,
      (loaded) => {
        if (!active) return
        loaded.colorSpace = THREE.SRGBColorSpace
        loaded.wrapS = THREE.ClampToEdgeWrapping
        loaded.wrapT = THREE.ClampToEdgeWrapping
        setTexture(loaded)
      },
      undefined,
      () => {
        if (!active) return
        setFailed(true)
      }
    )
    return () => {
      active = false
    }
  }, [])

  useFrame(() => {
    if (!materialRef.current) return
    const target = showReferenceMap && texture && !failed ? 0.32 : 0
    materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, target, 0.08)
  })

  if (!texture || failed) return null

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
      <planeGeometry args={[CAMPUS_WORLD.campusWidth, CAMPUS_WORLD.campusDepth]} />
      <meshBasicMaterial
        ref={materialRef}
        map={texture}
        transparent
        opacity={0}
        depthWrite={false}
        color="#cbd3d8"
      />
    </mesh>
  )
}

function ParkingStripes({ surface }: { surface: SiteSurface3D }) {
  const bounds = useMemo(() => getFootprintBounds(surface.footprint), [surface.footprint])
  const lines = useMemo(() => {
    const result: [THREE.Vector3, THREE.Vector3][] = []
    const width = bounds.maxX - bounds.minX
    const count = Math.max(4, Math.floor(width / 1.7))
    for (let index = 0; index < count; index += 1) {
      const x = bounds.minX + 0.9 + index * 1.5
      result.push([
        new THREE.Vector3(x, 0.02, bounds.minZ + 0.8),
        new THREE.Vector3(x - 0.8, 0.02, bounds.maxZ - 0.7),
      ])
    }
    return result
  }, [bounds.maxX, bounds.maxZ, bounds.minX, bounds.minZ])

  if (surface.kind !== 'parking' || !surface.stripeColor) return null

  return (
    <>
      {lines.map((points, index) => (
        <Line key={`${surface.id}-${index}`} points={points} color={surface.stripeColor} transparent opacity={0.45} lineWidth={0.9} />
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
      <mesh geometry={built.geometry} position={[0, 0.01, 0]} receiveShadow>
        <meshStandardMaterial
          color={surface.color}
          roughness={surface.kind === 'contractor' ? 0.95 : 0.9}
          metalness={0.02}
          transparent
          opacity={surface.opacity}
        />
      </mesh>

      {surface.borderColor && (
        <lineSegments geometry={borderGeometry} position={[0, 0.04, 0]}>
          <lineBasicMaterial color={surface.borderColor} transparent opacity={0.55} />
        </lineSegments>
      )}

      <ParkingStripes surface={surface} />
    </group>
  )
}

export function GroundPlane({ showReferenceMap }: Props) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 0]} receiveShadow>
        <planeGeometry args={[CAMPUS_WORLD.groundWidth, CAMPUS_WORLD.groundDepth]} />
        <meshStandardMaterial color="#171613" roughness={0.98} metalness={0} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.11, 0]} receiveShadow>
        <planeGeometry args={[CAMPUS_WORLD.campusWidth + 8, CAMPUS_WORLD.campusDepth + 8]} />
        <meshStandardMaterial color="#211d18" roughness={0.97} metalness={0} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.105, 0]} receiveShadow>
        <planeGeometry args={[CAMPUS_WORLD.campusWidth + 1.2, CAMPUS_WORLD.campusDepth + 1.2]} />
        <meshStandardMaterial color="#261f18" roughness={0.95} metalness={0.01} />
      </mesh>

      {scene3dSiteSurfaces.map((surface) => (
        <SiteSurface key={surface.id} surface={surface} />
      ))}

      <ReferenceOverlay showReferenceMap={showReferenceMap} />
    </group>
  )
}
