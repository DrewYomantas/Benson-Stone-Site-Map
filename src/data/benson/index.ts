export { buildings } from './buildings'
export { yards } from './yards'
export { entrances } from './entrances'
export { doors } from './doors'
export { hotspots } from './hotspots'

import { buildings } from './buildings'
import { yards } from './yards'
import { entrances } from './entrances'
import { doors } from './doors'
import type { Building, Yard, Entrance, Door, MapEntity, EntityType } from '../../types'

export function getEntityById(id: string): { entity: MapEntity; type: EntityType } | null {
  const building = buildings.find((b) => b.id === id)
  if (building) return { entity: building, type: 'building' }

  const yard = yards.find((y) => y.id === id)
  if (yard) return { entity: yard, type: 'yard' }

  const entrance = entrances.find((e) => e.id === id)
  if (entrance) return { entity: entrance, type: 'entrance' }

  const door = doors.find((d) => d.id === id)
  if (door) return { entity: door, type: 'door' }

  return null
}

export function getBuildingById(id: string): Building | undefined {
  return buildings.find((b) => b.id === id)
}

export function getYardById(id: string): Yard | undefined {
  return yards.find((y) => y.id === id)
}

export function getEntranceById(id: string): Entrance | undefined {
  return entrances.find((e) => e.id === id)
}

export function getDoorById(id: string): Door | undefined {
  return doors.find((d) => d.id === id)
}
