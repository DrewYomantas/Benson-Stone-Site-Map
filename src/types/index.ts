export type VerificationStatus = 'Verified' | 'Partially Verified' | 'Unverified' | 'Needs Review'

export type EntityType = 'building' | 'yard' | 'entrance' | 'door'

export interface InteriorZone {
  id: string
  buildingId: string
  displayName: string
  status: VerificationStatus
  notes: string
  clickable: boolean
  verified: boolean
}

export interface Building {
  id: string
  number: number
  displayName: string
  mapLabel: string
  status: VerificationStatus
  publicFacing: boolean
  primaryUse: string
  relatedYardIds: string[]
  relatedDoorIds: string[]
  notes: string
  verifiedBy: string | null
  verifiedOn: string | null
  hasInteriorMap: boolean
  interiorZones: InteriorZone[]
}

export interface Yard {
  id: string
  number: number
  displayName: string
  mapLabel: string
  status: VerificationStatus
  relatedBuildingIds: string[]
  primaryUse: string
  accessNotes: string
  weatherNotes: string
  notes: string
  verifiedBy: string | null
  verifiedOn: string | null
}

export interface Entrance {
  id: string
  displayName: string
  type: 'Entrance' | 'Loading Dock' | 'Site Point'
  relatedBuildingId: string | null
  relatedYardId: string | null
  relatedDoorId: string | null
  customerFacing: boolean
  notes: string
  status: VerificationStatus
}

export interface Door {
  id: string
  number: string
  displayName: string
  buildingId: string | null
  yardId: string | null
  doorType: string
  entranceLabel: string | null
  useDescription: string
  publicAccess: boolean
  restrictedAccess: boolean
  notes: string
  status: VerificationStatus
  verifiedBy: string | null
  verifiedOn: string | null
}

export type MapEntity = Building | Yard | Entrance | Door

export interface HotspotPosition {
  x: number
  y: number
  w?: number
  h?: number
}

export interface Hotspot {
  entityId: string
  entityType: EntityType
  position: HotspotPosition
  label: string
  priority: 'high' | 'medium' | 'low'
}

export interface FilterState {
  buildings: boolean
  yards: boolean
  entrances: boolean
  doors: boolean
  verifiedOnly: boolean
  needsReview: boolean
}

export interface AppState {
  selectedEntityId: string | null
  selectedEntityType: EntityType | null
  hoveredEntityId: string | null
  searchQuery: string
  filters: FilterState
  exploringInterior: boolean
}
