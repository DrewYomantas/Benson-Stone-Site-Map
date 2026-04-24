import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { SceneLighting } from './SceneLighting'
import { GroundPlane } from './GroundPlane'
import { BuildingMesh } from './BuildingMesh'
import { YardSurface } from './YardSurface'
import { EntranceMarker } from './EntranceMarker'
import { CameraRig } from './CameraRig'
import {
  scene3dBuildings,
  scene3dYards,
  scene3dEntrances,
  DEFAULT_CAM_POS,
} from '../../data/benson/scene3d'
import type { EntityType, FilterState } from '../../types'

interface Props {
  selectedId: string | null
  hoveredId: string | null
  selectedType: EntityType | null
  filters: FilterState
  exploringInterior: boolean
  showReferenceMap: boolean
  resetSignal: number
  onHover: (id: string | null) => void
  onSelect: (id: string, type: EntityType) => void
  onDeselect: () => void
}

export function CampusScene({
  selectedId,
  hoveredId,
  selectedType,
  filters,
  exploringInterior,
  showReferenceMap,
  resetSignal,
  onHover,
  onSelect,
  onDeselect,
}: Props) {
  const anySelected = selectedId !== null

  return (
    <Canvas
      camera={{
        position: DEFAULT_CAM_POS,
        fov: 44,
        near: 0.1,
        far: 220,
      }}
      shadows="soft"
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false }}
      style={{ background: '#1a1814' }}
      onPointerMissed={onDeselect}
    >
      {/* Depth fog — adds spatial depth, matches dark BG */}
      <fog attach="fog" args={['#1a1814', 55, 110]} />

      <SceneLighting />

      {/* Ground + optional reference map overlay */}
      <Suspense fallback={null}>
        <GroundPlane showReferenceMap={showReferenceMap} />
      </Suspense>

      {/* Buildings */}
      {filters.buildings &&
        scene3dBuildings.map((bld) => (
          <BuildingMesh
            key={bld.id}
            data={bld}
            isSelected={selectedId === bld.id}
            isHovered={hoveredId === bld.id}
            anySelected={anySelected}
            exploringInterior={exploringInterior && selectedId === bld.id}
            onHover={onHover}
            onClick={onSelect}
          />
        ))}

      {/* Yards */}
      {filters.yards &&
        scene3dYards.map((yrd) => (
          <YardSurface
            key={yrd.id}
            data={yrd}
            isSelected={selectedId === yrd.id}
            isHovered={hoveredId === yrd.id}
            anySelected={anySelected}
            onHover={onHover}
            onClick={onSelect}
          />
        ))}

      {/* Entrances */}
      {filters.entrances &&
        scene3dEntrances.map((ent) => (
          <EntranceMarker
            key={ent.id}
            data={ent}
            isSelected={selectedId === ent.id}
            isHovered={hoveredId === ent.id}
            anySelected={anySelected}
            onHover={onHover}
            onClick={onSelect}
          />
        ))}

      {/* Camera controller */}
      <CameraRig
        selectedId={selectedId}
        selectedType={selectedType}
        resetSignal={resetSignal}
      />
    </Canvas>
  )
}
