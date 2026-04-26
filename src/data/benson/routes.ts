import type { EntityType, ViewMode } from '../../types'

export interface RoutePreset {
  id: string
  label: string
  description: string
  viewMode: ViewMode
  accent: string
  targetEntityId: string
  targetEntityType: EntityType
  points: [number, number][]
  highlights: string[]
}

export const routePresets: RoutePreset[] = [
  {
    id: 'customer-arrival',
    label: 'Customer Arrival',
    description: 'Parking to the east showroom entrances and customer loading.',
    viewMode: 'visit',
    accent: '#5f9dc2',
    targetEntityId: 'ENT-NORTH',
    targetEntityType: 'entrance',
    points: [
      [25, 4.8],
      [20.8, 3.8],
      [18.6, 2.4],
      [16.8, 1.1],
    ],
    highlights: ['BLD-01', 'ENT-NORTH', 'ENT-SOUTH', 'LOAD-CUST-S'],
  },
  {
    id: 'shipping-receiving',
    label: 'Shipping / Receiving',
    description: 'South apron, receiving entrance, and dock approach.',
    viewMode: 'operations',
    accent: '#c17745',
    targetEntityId: 'ENT-SHIPREC',
    targetEntityType: 'entrance',
    points: [
      [18.8, 9.8],
      [17.0, 8.2],
      [15.8, 6.6],
      [15.1, 5.2],
    ],
    highlights: ['BLD-01', 'ENT-SHIPREC', 'D-01-11'],
  },
  {
    id: 'contractor-pickup',
    label: 'Contractor Pickup',
    description: 'Central yard, scale house, and material staging.',
    viewMode: 'operations',
    accent: '#dfc27b',
    targetEntityId: 'YRD-01',
    targetEntityType: 'yard',
    points: [
      [18.6, 7.8],
      [13.5, 6.8],
      [9.4, 5.6],
      [6.0, 5.4],
    ],
    highlights: ['YRD-01', 'SITE-SCALE', 'BLD-06', 'BLD-07'],
  },
  {
    id: 'showroom-visit',
    label: 'Showroom Visit',
    description: 'Granite showroom approach and east public campus.',
    viewMode: 'visit',
    accent: '#d3a75a',
    targetEntityId: 'ENT-GRANITE',
    targetEntityType: 'entrance',
    points: [
      [17.8, 3.3],
      [13.6, 0.8],
      [9.4, -2.0],
      [5.0, -4.4],
    ],
    highlights: ['BLD-02', 'ENT-GRANITE', 'BLD-01'],
  },
  {
    id: 'needs-verification',
    label: 'Needs Verification',
    description: 'Unverified support buildings and field-check priorities.',
    viewMode: 'verification',
    accent: '#d88946',
    targetEntityId: 'BLD-05',
    targetEntityType: 'building',
    points: [
      [-8.0, 1.2],
      [-5.5, -0.4],
      [-5.2, -3.7],
      [-1.0, 4.3],
      [2.0, 11.0],
    ],
    highlights: ['BLD-05', 'BLD-06', 'BLD-07', 'BLD-10'],
  },
]
