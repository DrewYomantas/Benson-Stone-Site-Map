import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line, Html } from '@react-three/drei'
import * as THREE from 'three'
import type { RoutePreset } from '../../data/benson'

interface Props {
  route: RoutePreset | null
}

export function RouteOverlay({ route }: Props) {
  const markerRef = useRef<THREE.Mesh>(null!)
  const points = useMemo(() => {
    if (!route) return []
    return route.points.map(([x, z]) => new THREE.Vector3(x, 0.32, z))
  }, [route])

  useFrame(({ clock }) => {
    if (!markerRef.current || points.length === 0) return
    const pulse = 1 + Math.sin(clock.elapsedTime * 4) * 0.12
    markerRef.current.scale.setScalar(pulse)
    markerRef.current.rotation.y += 0.018
  })

  if (!route || points.length === 0) return null
  const destination = points[points.length - 1]

  return (
    <group>
      <Line points={points} color={route.accent} transparent opacity={0.95} lineWidth={3} />
      <Line points={points.map((point) => point.clone().add(new THREE.Vector3(0, 0.02, 0)))} color="#fff1c8" transparent opacity={0.42} lineWidth={7} />

      {points.map((point, index) => (
        <mesh key={`${route.id}-${index}`} position={[point.x, point.y + 0.03, point.z]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.18, 0.3, 32]} />
          <meshBasicMaterial color={route.accent} transparent opacity={index === points.length - 1 ? 0.82 : 0.45} side={THREE.DoubleSide} />
        </mesh>
      ))}

      <mesh ref={markerRef} position={[destination.x, 0.72, destination.z]} castShadow>
        <octahedronGeometry args={[0.42, 0]} />
        <meshStandardMaterial color={route.accent} emissive={route.accent} emissiveIntensity={0.28} roughness={0.48} metalness={0.12} />
      </mesh>

      <Html position={[destination.x, 1.45, destination.z]} center style={{ pointerEvents: 'none' }}>
        <div
          style={{
            background: 'rgba(43,33,23,0.92)',
            border: `1px solid ${route.accent}`,
            color: '#fff8ed',
            borderRadius: 999,
            padding: '5px 10px',
            fontFamily: 'DM Mono, monospace',
            fontSize: 10,
            whiteSpace: 'nowrap',
            boxShadow: '0 10px 30px rgba(0,0,0,0.24)',
          }}
        >
          {route.label}
        </div>
      </Html>
    </group>
  )
}
