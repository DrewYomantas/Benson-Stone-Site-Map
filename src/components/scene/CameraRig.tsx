import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import {
  scene3dBuildings,
  scene3dYards,
  scene3dEntrances,
  scene3dDoors,
  DEFAULT_CAM_POS,
  DEFAULT_CAM_LOOK,
  getFootprintBounds,
} from '../../data/benson/scene3d'
import type { EntityType } from '../../types'

interface Props {
  selectedId: string | null
  selectedType: EntityType | null
  resetSignal: number
}

function getSelectionTarget(selectedId: string, selectedType: EntityType | null) {
  if (selectedType === 'building') {
    const building = scene3dBuildings.find((item) => item.id === selectedId)
    if (!building) return null
    const bounds = getFootprintBounds(building.footprint)
    const span = Math.max(bounds.maxX - bounds.minX, bounds.maxZ - bounds.minZ)
    return {
      look: new THREE.Vector3(building.x, building.height * 0.42, building.z),
      pos: new THREE.Vector3(building.x + span * 1.3, Math.max(10, building.height * 2.6), building.z + span * 1.2),
    }
  }

  if (selectedType === 'yard') {
    const yard = scene3dYards.find((item) => item.id === selectedId)
    if (!yard) return null
    const bounds = getFootprintBounds(yard.footprint)
    const span = Math.max(bounds.maxX - bounds.minX, bounds.maxZ - bounds.minZ)
    return {
      look: new THREE.Vector3(yard.x, 0.2, yard.z),
      pos: new THREE.Vector3(yard.x + span * 1.5, Math.max(8, span * 1.4), yard.z + span * 1.1),
    }
  }

  const entrance = scene3dEntrances.find((item) => item.id === selectedId)
  if (entrance) {
    return {
      look: new THREE.Vector3(entrance.x, 0.45, entrance.z),
      pos: new THREE.Vector3(entrance.x + 6, 8, entrance.z + 5),
    }
  }

  const door = scene3dDoors.find((item) => item.id === selectedId)
  if (!door) return null

  return {
    look: new THREE.Vector3(door.x, 0.35, door.z),
    pos: new THREE.Vector3(door.x + 5.5, 7.5, door.z + 4.6),
  }
}

export function CameraRig({ selectedId, selectedType, resetSignal }: Props) {
  const { camera } = useThree()
  const controlsRef = useRef<any>(null)
  const targetPos = useRef(new THREE.Vector3(...DEFAULT_CAM_POS))
  const targetLook = useRef(new THREE.Vector3(...DEFAULT_CAM_LOOK))
  const isAnimating = useRef(false)

  useEffect(() => {
    if (!selectedId) {
      targetPos.current.set(...DEFAULT_CAM_POS)
      targetLook.current.set(...DEFAULT_CAM_LOOK)
      isAnimating.current = true
      return
    }

    const target = getSelectionTarget(selectedId, selectedType)
    if (!target) return

    targetPos.current.copy(target.pos)
    targetLook.current.copy(target.look)
    isAnimating.current = true
  }, [selectedId, selectedType])

  useEffect(() => {
    if (resetSignal === 0) return
    targetPos.current.set(...DEFAULT_CAM_POS)
    targetLook.current.set(...DEFAULT_CAM_LOOK)
    isAnimating.current = true
  }, [resetSignal])

  useFrame(() => {
    const controls = controlsRef.current
    if (!controls || !isAnimating.current) return

    camera.position.lerp(targetPos.current, 0.05)
    controls.target.lerp(targetLook.current, 0.06)
    controls.update()

    if (camera.position.distanceTo(targetPos.current) < 0.03 && controls.target.distanceTo(targetLook.current) < 0.03) {
      isAnimating.current = false
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      minDistance={4}
      maxDistance={82}
      minPolarAngle={0.16}
      maxPolarAngle={Math.PI / 2.08}
      makeDefault
    />
  )
}
