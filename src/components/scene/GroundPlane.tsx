import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

// The campus footprint in world units
const GROUND_W = 80
const GROUND_D = 60
const MAP_W = 50
const MAP_D = 35

interface Props {
  showReferenceMap: boolean
}

// Loads and shows the aerial map image as a semi-transparent ground overlay.
// Wrapped in Suspense by parent so texture loading doesn't block the scene.
function MapOverlay({ showReferenceMap }: Props) {
  const texture = useTexture('/map/benson-stone-map.jpg')
  const matRef = useRef<THREE.MeshBasicMaterial>(null!)

  useFrame(() => {
    if (!matRef.current) return
    const target = showReferenceMap ? 0.45 : 0
    matRef.current.opacity = THREE.MathUtils.lerp(matRef.current.opacity, target, 0.06)
    matRef.current.needsUpdate = true
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]}>
      <planeGeometry args={[MAP_W, MAP_D]} />
      <meshBasicMaterial
        ref={matRef}
        map={texture}
        transparent
        opacity={0}
        depthWrite={false}
      />
    </mesh>
  )
}

export function GroundPlane({ showReferenceMap }: Props) {
  return (
    <group>
      {/* Main dark ground surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[GROUND_W, GROUND_D]} />
        <meshStandardMaterial color="#1c1a16" roughness={0.92} metalness={0.0} />
      </mesh>

      {/* Subtle site boundary inset — slightly lighter to define the campus */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.09, 0]} receiveShadow>
        <planeGeometry args={[MAP_W + 4, MAP_D + 4]} />
        <meshStandardMaterial color="#22201a" roughness={0.95} />
      </mesh>

      {/* Reference map overlay — fades in/out */}
      <MapOverlay showReferenceMap={showReferenceMap} />
    </group>
  )
}
