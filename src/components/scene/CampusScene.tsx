import { Canvas } from '@react-three/fiber'
import { SceneLighting } from './SceneLighting'
import { GroundPlane } from './GroundPlane'
import { BuildingMesh } from './BuildingMesh'
import { YardSurface } from './YardSurface'
import { EntranceMarker } from './EntranceMarker'
import { DoorMarker } from './DoorMarker'
import { CameraRig } from './CameraRig'
import { RouteOverlay } from './RouteOverlay'
import {
  scene3dBuildings,
  scene3dYards,
  scene3dEntrances,
  scene3dDoors,
  DEFAULT_CAM_POS,
} from '../../data/benson/scene3d'
import type { EntityType, FilterState, VerificationStatus } from '../../types'
import type { RoutePreset } from '../../data/benson'

interface Props {
  selectedId: string | null
  hoveredId: string | null
  selectedType: EntityType | null
  filters: FilterState
  exploringInterior: boolean
  viewMode: 'visit' | 'operations' | 'verification'
  activeRoute: RoutePreset | null
  resetSignal: number
  onHover: (id: string | null) => void
  onSelect: (id: string, type: EntityType) => void
  onDeselect: () => void
}

function matchesVerification(status: VerificationStatus, filters: FilterState) {
  if (filters.verifiedOnly && status !== 'Verified' && status !== 'Partially Verified') return false
  if (filters.needsReview && status !== 'Needs Review' && status !== 'Unverified') return false
  return true
}

export function CampusScene({
  selectedId,
  hoveredId,
  selectedType,
  filters,
  exploringInterior,
  viewMode,
  activeRoute,
  resetSignal,
  onHover,
  onSelect,
  onDeselect,
}: Props) {
  const anySelected = selectedId !== null
  const visibleBuildings = scene3dBuildings.filter((item) => matchesVerification(item.verificationStatus, filters))
  const visibleYards = scene3dYards.filter((item) => matchesVerification(item.verificationStatus, filters))
  const visibleEntrances = scene3dEntrances.filter((item) => matchesVerification(item.verificationStatus, filters))
  const visibleDoors = scene3dDoors.filter((item) => matchesVerification(item.verificationStatus, filters))
  const routeHighlights = new Set(activeRoute?.highlights ?? [])

  return (
    <Canvas
      camera={{
        position: DEFAULT_CAM_POS,
        fov: 42,
        near: 0.1,
        far: 240,
      }}
      shadows="soft"
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false }}
      style={{ background: '#2f3028' }}
      onPointerMissed={onDeselect}
    >
      <fog attach="fog" args={['#2f3028', 68, 138]} />

      <SceneLighting />
      <GroundPlane />
      <RouteOverlay route={activeRoute} />

      {filters.buildings &&
        visibleBuildings.map((building) => (
          <BuildingMesh
            key={building.id}
            data={building}
            isSelected={selectedId === building.id || routeHighlights.has(building.id)}
            isHovered={hoveredId === building.id}
            anySelected={anySelected}
            exploringInterior={exploringInterior && selectedId === building.id}
            onHover={onHover}
            onClick={onSelect}
          />
        ))}

      {filters.yards &&
        visibleYards.map((yard) => (
          <YardSurface
            key={yard.id}
            data={yard}
            isSelected={selectedId === yard.id || routeHighlights.has(yard.id)}
            isHovered={hoveredId === yard.id}
            anySelected={anySelected}
            onHover={onHover}
            onClick={onSelect}
          />
        ))}

      {filters.entrances &&
        visibleEntrances.map((entrance) => (
          <EntranceMarker
            key={entrance.id}
            data={entrance}
            isSelected={selectedId === entrance.id || routeHighlights.has(entrance.id)}
            isHovered={hoveredId === entrance.id}
            anySelected={anySelected}
            onHover={onHover}
            onClick={onSelect}
          />
        ))}

      {filters.doors &&
        visibleDoors.map((door) => (
          <DoorMarker
            key={door.id}
            data={door}
            isSelected={selectedId === door.id || routeHighlights.has(door.id)}
            isHovered={hoveredId === door.id}
            anySelected={anySelected}
            onHover={onHover}
            onClick={onSelect}
          />
        ))}

      <CameraRig selectedId={selectedId} selectedType={selectedType} resetSignal={resetSignal} viewMode={viewMode} />
    </Canvas>
  )
}
