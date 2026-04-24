import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import {
  scene3dBuildings,
  scene3dYards,
  scene3dEntrances,
  DEFAULT_CAM_POS,
  DEFAULT_CAM_LOOK,
} from '../../data/benson/scene3d'
import type { EntityType } from '../../types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Controls = any

interface Props {
  selectedId: string | null
  selectedType: EntityType | null
  resetSignal: number  // increment to trigger camera reset
}

export function CameraRig({ selectedId, selectedType, resetSignal }: Props) {
  const { camera } = useThree()
  const controlsRef = useRef<Controls>(null!)
  const targetPos = useRef(new THREE.Vector3(...DEFAULT_CAM_POS))
  const targetLook = useRef(new THREE.Vector3(...DEFAULT_CAM_LOOK))
  const isAnimating = useRef(false)

  // Update camera targets when selection changes
  useEffect(() => {
    if (selectedId) {
      const allEntities = [
        ...scene3dBuildings,
        ...scene3dYards,
        ...scene3dEntrances,
      ]
      const e = allEntities.find((e) => e.id === selectedId)
      if (e) {
        const isBuilding = selectedType === 'building'
        const bld = scene3dBuildings.find((b) => b.id === selectedId)
        const h = isBuilding && bld ? bld.height : 0

        // Offset camera position to give a 3/4 view from slightly above
        const dx = isBuilding ? 8 : 6
        const dz = isBuilding ? 7 : 5
        const dy = isBuilding ? 13 : 9

        targetPos.current.set(e.x + dx, dy, e.z + dz)
        targetLook.current.set(e.x, h * 0.4, e.z)
        isAnimating.current = true
      }
    } else {
      targetPos.current.set(...DEFAULT_CAM_POS)
      targetLook.current.set(...DEFAULT_CAM_LOOK)
      isAnimating.current = true
    }
  }, [selectedId, selectedType])

  // Reset signal (from button press)
  useEffect(() => {
    if (resetSignal > 0) {
      targetPos.current.set(...DEFAULT_CAM_POS)
      targetLook.current.set(...DEFAULT_CAM_LOOK)
      isAnimating.current = true
    }
  }, [resetSignal])

  useFrame(() => {
    if (!controlsRef.current) return
    if (!isAnimating.current) return

    const posLerp = 0.04
    const lookLerp = 0.05

    camera.position.lerp(targetPos.current, posLerp)
    const ctrl = controlsRef.current
    ctrl.target.lerp(targetLook.current, lookLerp)
    ctrl.update()

    // Stop animating when close enough
    const posDist = camera.position.distanceTo(targetPos.current)
    const lookDist = ctrl.target.distanceTo(targetLook.current)
    if (posDist < 0.02 && lookDist < 0.02) {
      isAnimating.current = false
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      minDistance={4}
      maxDistance={75}
      minPolarAngle={0.12}
      maxPolarAngle={Math.PI / 2.1}
      makeDefault
    />
  )
}
