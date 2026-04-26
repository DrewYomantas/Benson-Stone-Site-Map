import type { VerificationStatus } from '../../types'

export type FootprintPoint = [number, number]

export interface SceneEntityMeta {
  id: string
  label: string
  labelPosition?: [number, number]
  verificationStatus: VerificationStatus
  sourceNotes: string[]
  operationalNotes: string[]
  useTags: string[]
}

export interface Building3D extends SceneEntityMeta {
  footprint: FootprintPoint[]
  height: number
  wallColor: string
  roofColor: string
  wallMaterial: 'brick' | 'stone' | 'metal'
  roofMaterial: 'metal' | 'membrane' | 'stone'
  x: number
  z: number
  width: number
  depth: number
}

export interface Yard3D extends SceneEntityMeta {
  footprint: FootprintPoint[]
  surfaceColor: string
  borderColor: string
  x: number
  z: number
  width: number
  depth: number
}

export interface Entrance3D extends SceneEntityMeta {
  x: number
  z: number
  customerFacing: boolean
  markerType: 'entrance' | 'dock' | 'site-point'
}

export interface Door3D extends SceneEntityMeta {
  x: number
  z: number
  number: string
  buildingId: string | null
  yardId: string | null
}

export interface SiteSurface3D {
  id: string
  label?: string
  kind: 'asphalt' | 'parking' | 'contractor' | 'driveway' | 'yard-boundary'
  footprint: FootprintPoint[]
  color: string
  opacity: number
  borderColor?: string
  stripeColor?: string
}

const withBounds = <T extends { footprint: FootprintPoint[] }>(entity: T) => {
  const bounds = getFootprintBounds(entity.footprint)
  return {
    ...entity,
    x: (bounds.minX + bounds.maxX) / 2,
    z: (bounds.minZ + bounds.maxZ) / 2,
    width: bounds.maxX - bounds.minX,
    depth: bounds.maxZ - bounds.minZ,
  }
}

export function getFootprintBounds(points: FootprintPoint[]) {
  const xs = points.map(([x]) => x)
  const zs = points.map(([, z]) => z)
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minZ: Math.min(...zs),
    maxZ: Math.max(...zs),
  }
}

export function getFootprintCenter(points: FootprintPoint[]): [number, number] {
  const { minX, maxX, minZ, maxZ } = getFootprintBounds(points)
  return [(minX + maxX) / 2, (minZ + maxZ) / 2]
}

export const CAMPUS_WORLD = {
  groundWidth: 88,
  groundDepth: 66,
  campusWidth: 54,
  campusDepth: 39,
}

export const DEFAULT_CAM_POS: [number, number, number] = [30, 27, 34]
export const DEFAULT_CAM_LOOK: [number, number, number] = [1.8, 0.2, 1.8]

export const scene3dBuildings: Building3D[] = [
  withBounds({
    id: 'BLD-01',
    label: 'Building #1',
    footprint: [
      [14.2, -0.8],
      [22.9, -0.8],
      [22.9, 4.7],
      [19.4, 4.7],
      [18.5, 3.1],
      [15.0, 3.1],
      [14.2, 1.5],
    ],
    height: 5.2,
    wallColor: '#a86c47',
    roofColor: '#4c4740',
    wallMaterial: 'stone',
    roofMaterial: 'membrane',
    labelPosition: [19.0, 2.0],
    verificationStatus: 'Partially Verified',
    sourceNotes: ['Old site map', 'Google/satellite reference', 'Benson Stone public website'],
    operationalNotes: ['Primary east-side public building mass is confirmed; exact department lines still need walk-through validation.'],
    useTags: ['showroom', 'customer-service', 'shipping'],
  }),
  withBounds({
    id: 'BLD-02',
    label: 'Building #2',
    footprint: [
      [-5.8, -10.7],
      [0.4, -10.5],
      [4.6, -7.8],
      [6.2, -5.2],
      [4.9, -3.8],
      [-0.9, -5.0],
      [-6.2, -7.8],
    ],
    height: 4.4,
    wallColor: '#9b6243',
    roofColor: '#514b43',
    wallMaterial: 'brick',
    roofMaterial: 'metal',
    labelPosition: [0.4, -7.0],
    verificationStatus: 'Partially Verified',
    sourceNotes: ['Old site map', 'Google/satellite reference'],
    operationalNotes: ['South-west diagonal footprint is inferred from overhead imagery; showroom entry location is approximate.'],
    useTags: ['showroom', 'granite', 'customer'],
  }),
  withBounds({
    id: 'BLD-03',
    label: 'Building #3',
    footprint: [
      [-21.7, -17.0],
      [-12.4, -14.7],
      [-12.9, -12.7],
      [-22.1, -15.1],
    ],
    height: 3.5,
    wallColor: '#9b6a4f',
    roofColor: '#5c554b',
    wallMaterial: 'brick',
    roofMaterial: 'metal',
    labelPosition: [-17.3, -14.7],
    verificationStatus: 'Partially Verified',
    sourceNotes: ['Old site map', 'Google/satellite reference'],
    operationalNotes: ['North-west shop/service structure footprint refined from roofline shape, but door counts still need field check.'],
    useTags: ['warehouse', 'service'],
  }),
  withBounds({
    id: 'BLD-04',
    label: 'Building #4',
    footprint: [
      [-19.9, -11.2],
      [-12.6, -9.2],
      [-13.3, -7.1],
      [-20.8, -8.9],
    ],
    height: 3.1,
    wallColor: '#946246',
    roofColor: '#595248',
    wallMaterial: 'brick',
    roofMaterial: 'metal',
    labelPosition: [-16.9, -9.2],
    verificationStatus: 'Partially Verified',
    sourceNotes: ['Old site map', 'Google/satellite reference'],
    operationalNotes: ['Roof shape suggests a slightly skewed service building rather than a pure rectangle.'],
    useTags: ['service', 'warehouse'],
  }),
  withBounds({
    id: 'BLD-05',
    label: 'Building #5',
    footprint: [
      [-8.2, -1.7],
      [-2.9, -1.5],
      [-2.8, 1.9],
      [-8.6, 1.6],
    ],
    height: 2.7,
    wallColor: '#a57d61',
    roofColor: '#635b50',
    wallMaterial: 'stone',
    roofMaterial: 'membrane',
    labelPosition: [-5.8, 0.2],
    verificationStatus: 'Unverified',
    sourceNotes: ['Old site map', 'Google/satellite reference'],
    operationalNotes: ['Likely small support structure; footprint has a north-side step visible in aerial reference.'],
    useTags: ['support'],
  }),
  withBounds({
    id: 'BLD-06',
    label: 'Building #6',
    footprint: [
      [-7.9, 4.9],
      [-4.1, 5.0],
      [-4.1, 6.8],
      [-7.9, 6.8],
    ],
    height: 2.5,
    wallColor: '#9a7259',
    roofColor: '#5e574d',
    wallMaterial: 'brick',
    roofMaterial: 'metal',
    labelPosition: [-6.0, 5.9],
    verificationStatus: 'Unverified',
    sourceNotes: ['Old site map', 'Google/satellite reference'],
    operationalNotes: ['Central-west small building footprint tightened to match visible roof taper.'],
    useTags: ['warehouse', 'yard-support'],
  }),
  withBounds({
    id: 'BLD-07',
    label: 'Building #7',
    footprint: [
      [-3.7, 3.1],
      [1.6, 3.0],
      [1.9, 5.3],
      [-3.7, 5.4],
    ],
    height: 2.4,
    wallColor: '#a67654',
    roofColor: '#5c554b',
    wallMaterial: 'brick',
    roofMaterial: 'metal',
    labelPosition: [-1.0, 4.2],
    verificationStatus: 'Unverified',
    sourceNotes: ['Old site map', 'Google/satellite reference'],
    operationalNotes: ['Paired west-yard structure; exact use still needs confirmation on-site.'],
    useTags: ['warehouse', 'yard-support'],
  }),
  withBounds({
    id: 'BLD-08',
    label: 'Building #8',
    footprint: [
      [-1.5, 10.1],
      [5.6, 10.0],
      [5.7, 12.1],
      [-1.6, 12.3],
    ],
    height: 2.9,
    wallColor: '#a17052',
    roofColor: '#5d554b',
    wallMaterial: 'brick',
    roofMaterial: 'metal',
    labelPosition: [2.1, 11.1],
    verificationStatus: 'Partially Verified',
    sourceNotes: ['Old site map', 'Google/satellite reference'],
    operationalNotes: ['Southern structure appears deeper at the center than the old hotspot rectangle indicated.'],
    useTags: ['warehouse', 'yard-access'],
  }),
  withBounds({
    id: 'BLD-10',
    label: 'Building #10',
    footprint: [
      [-8.4, -5.5],
      [-3.1, -5.2],
      [-3.1, -2.9],
      [-8.4, -3.2],
    ],
    height: 2.3,
    wallColor: '#987057',
    roofColor: '#5d554b',
    wallMaterial: 'stone',
    roofMaterial: 'metal',
    labelPosition: [-5.7, -4.1],
    verificationStatus: 'Unverified',
    sourceNotes: ['Old site map', 'Google/satellite reference'],
    operationalNotes: ['Small infill structure between the west buildings; dimensions remain approximate.'],
    useTags: ['support', 'warehouse'],
  }),
]

export const scene3dYards: Yard3D[] = [
  withBounds({
    id: 'YRD-01',
    label: 'Yard #1',
    footprint: [
      [3.1, 3.4],
      [13.8, 3.4],
      [14.0, 7.8],
      [2.9, 7.9],
    ],
    surfaceColor: '#9c8257',
    borderColor: '#dfc27b',
    labelPosition: [8.5, 5.7],
    verificationStatus: 'Partially Verified',
    sourceNotes: ['Old site map', 'Google/satellite reference'],
    operationalNotes: ['Central yard footprint based on open paved pocket between west building groups.'],
    useTags: ['contractor-yard', 'loading'],
  }),
  withBounds({
    id: 'YRD-02',
    label: 'Yard #2',
    footprint: [
      [2.4, 12.0],
      [9.4, 11.9],
      [9.7, 15.2],
      [2.5, 15.2],
    ],
    surfaceColor: '#a18a5f',
    borderColor: '#dfc27b',
    labelPosition: [6.0, 13.6],
    verificationStatus: 'Partially Verified',
    sourceNotes: ['Old site map', 'Google/satellite reference'],
    operationalNotes: ['South yard remains approximate, but its southern boundary is more elongated than before.'],
    useTags: ['storage-yard', 'contractor-yard'],
  }),
  withBounds({
    id: 'YRD-03',
    label: 'Yard #3',
    footprint: [
      [-20.6, -13.3],
      [-14.0, -11.7],
      [-14.9, -9.0],
      [-21.4, -10.5],
    ],
    surfaceColor: '#8b956f',
    borderColor: '#d8cf91',
    labelPosition: [-17.9, -11.2],
    verificationStatus: 'Partially Verified',
    sourceNotes: ['Old site map', 'Google/satellite reference'],
    operationalNotes: ['North-west working yard is bounded tighter to the adjacent shop buildings.'],
    useTags: ['service-yard', 'receiving'],
  }),
]

export const scene3dSiteSurfaces: SiteSurface3D[] = [
  {
    id: 'SURF-EAST-APRON',
    label: 'East apron',
    kind: 'asphalt',
    footprint: [
      [10.6, -2.4],
      [25.0, -2.4],
      [25.1, 7.1],
      [10.2, 7.3],
    ],
    color: '#54575a',
    opacity: 0.98,
  },
  {
    id: 'SURF-EAST-PARKING',
    label: 'Customer parking',
    kind: 'parking',
    footprint: [
      [14.4, -7.5],
      [24.8, -7.5],
      [25.2, -2.5],
      [13.6, -2.7],
    ],
    color: '#5d6062',
    opacity: 0.95,
    stripeColor: '#f2ead8',
  },
  {
    id: 'SURF-CENTRAL-DRIVE',
    label: 'Central drive',
    kind: 'driveway',
    footprint: [
      [-10.3, -2.5],
      [13.4, -2.4],
      [14.0, 1.8],
      [-10.0, 2.4],
    ],
    color: '#505356',
    opacity: 0.96,
  },
  {
    id: 'SURF-SOUTH-DRIVE',
    label: 'South drive',
    kind: 'driveway',
    footprint: [
      [-3.8, 7.4],
      [16.0, 7.2],
      [16.1, 9.6],
      [-3.8, 9.7],
    ],
    color: '#575a5d',
    opacity: 0.94,
  },
  {
    id: 'SURF-WEST-CONTRACTOR',
    label: 'Contractor/loading area',
    kind: 'contractor',
    footprint: [
      [2.0, 2.6],
      [14.7, 2.4],
      [15.1, 8.5],
      [2.0, 8.8],
    ],
    color: '#806d49',
    opacity: 0.72,
    borderColor: '#d7b86a',
  },
  {
    id: 'SURF-NW-SERVICE',
    label: 'North-west service lane',
    kind: 'asphalt',
    footprint: [
      [-23.6, -17.9],
      [-10.8, -14.6],
      [-11.5, -11.7],
      [-24.1, -14.8],
    ],
    color: '#5a5c5f',
    opacity: 0.92,
  },
  {
    id: 'SURF-YARD-01-BOUNDARY',
    kind: 'yard-boundary',
    footprint: [
      [2.6, 3.0],
      [14.5, 3.0],
      [14.8, 8.3],
      [2.6, 8.4],
    ],
    color: '#d4b56f',
    opacity: 0.12,
    borderColor: '#f0ce7f',
  },
  {
    id: 'SURF-YARD-03-BOUNDARY',
    kind: 'yard-boundary',
    footprint: [
      [-21.2, -13.9],
      [-13.2, -12.2],
      [-14.0, -8.4],
      [-21.9, -10.0],
    ],
    color: '#d4b56f',
    opacity: 0.12,
    borderColor: '#f0ce7f',
  },
]

export const scene3dEntrances: Entrance3D[] = [
  {
    id: 'ENT-GRANITE',
    label: 'Granite Showroom',
    x: 7.1,
    z: -5.3,
    customerFacing: true,
    markerType: 'entrance',
    verificationStatus: 'Partially Verified',
    sourceNotes: ['Old site map', 'Google/satellite reference'],
    operationalNotes: ['Entrance marker set on the east edge of Building #2 pending door-level confirmation.'],
    useTags: ['showroom', 'customer'],
  },
  {
    id: 'ENT-NORTH',
    label: 'North Entrance',
    x: 23.4,
    z: 1.0,
    customerFacing: true,
    markerType: 'entrance',
    verificationStatus: 'Partially Verified',
    sourceNotes: ['Old site map', 'Google/satellite reference', 'Benson Stone public website'],
    operationalNotes: ['Customer-facing east facade entry; exact vestibule geometry still inferred.'],
    useTags: ['customer'],
  },
  {
    id: 'ENT-SOUTH',
    label: 'South Entrance',
    x: 21.2,
    z: 5.3,
    customerFacing: true,
    markerType: 'entrance',
    verificationStatus: 'Partially Verified',
    sourceNotes: ['Old site map', 'Google/satellite reference'],
    operationalNotes: ['South public entry location remains approximate.'],
    useTags: ['customer'],
  },
  {
    id: 'ENT-SHIPREC',
    label: 'Shipping / Receiving',
    x: 14.6,
    z: 5.9,
    customerFacing: false,
    markerType: 'dock',
    verificationStatus: 'Partially Verified',
    sourceNotes: ['Old site map', 'Google/satellite reference'],
    operationalNotes: ['Receiving position set on the recessed south apron; dock count still needs walk-through.'],
    useTags: ['receiving', 'shipping'],
  },
  {
    id: 'LOAD-CUST-S',
    label: 'Customer Loading',
    x: 14.3,
    z: 4.0,
    customerFacing: true,
    markerType: 'dock',
    verificationStatus: 'Partially Verified',
    sourceNotes: ['Old site map', 'Google/satellite reference'],
    operationalNotes: ['Customer pickup/loading marker aligned to the south-east apron.'],
    useTags: ['loading', 'customer'],
  },
  {
    id: 'SITE-SCALE',
    label: 'Scale House',
    x: 2.4,
    z: 4.9,
    customerFacing: false,
    markerType: 'site-point',
    verificationStatus: 'Partially Verified',
    sourceNotes: ['Old site map', 'Google/satellite reference'],
    operationalNotes: ['Scale house marker sits at the north edge of Yard #1 and still needs field confirmation.'],
    useTags: ['site-point', 'operations'],
  },
]

export const scene3dDoors: Door3D[] = [
  {
    id: 'D-03-31',
    label: '31',
    number: '31',
    buildingId: 'BLD-03',
    yardId: 'YRD-03',
    x: -13.2,
    z: -12.6,
    verificationStatus: 'Partially Verified',
    sourceNotes: ['2020 customer map', 'Google/satellite reference'],
    operationalNotes: ['Printed near the Yard #3 edge between Buildings #3 and #4.'],
    useTags: ['door-number', 'service-yard'],
  },
  {
    id: 'D-02-25',
    label: '25',
    number: '25',
    buildingId: 'BLD-02',
    yardId: null,
    x: -5.2,
    z: -8.6,
    verificationStatus: 'Partially Verified',
    sourceNotes: ['2020 customer map', 'Google/satellite reference'],
    operationalNotes: ['West/north side of Building #2 on the printed customer map.'],
    useTags: ['door-number'],
  },
  {
    id: 'D-02-24',
    label: '24',
    number: '24',
    buildingId: 'BLD-02',
    yardId: null,
    x: -5.4,
    z: -6.9,
    verificationStatus: 'Partially Verified',
    sourceNotes: ['2020 customer map', 'Google/satellite reference'],
    operationalNotes: ['Stacked with Door 25 on Building #2 west edge.'],
    useTags: ['door-number'],
  },
  {
    id: 'D-02-23',
    label: '23',
    number: '23',
    buildingId: 'BLD-02',
    yardId: null,
    x: -4.4,
    z: -4.8,
    verificationStatus: 'Partially Verified',
    sourceNotes: ['2020 customer map', 'Google/satellite reference'],
    operationalNotes: ['Printed on the lower west side of Building #2.'],
    useTags: ['door-number'],
  },
  {
    id: 'D-02-26',
    label: '26',
    number: '26',
    buildingId: 'BLD-02',
    yardId: null,
    x: 0.3,
    z: -5.8,
    verificationStatus: 'Partially Verified',
    sourceNotes: ['2020 customer map', 'Google/satellite reference'],
    operationalNotes: ['Printed near the central roofline of Building #2.'],
    useTags: ['door-number'],
  },
  {
    id: 'D-10-104',
    label: '104',
    number: '104',
    buildingId: 'BLD-10',
    yardId: null,
    x: -8.9,
    z: -4.6,
    verificationStatus: 'Partially Verified',
    sourceNotes: ['2020 customer map', 'Google/satellite reference'],
    operationalNotes: ['Upper door number on Building #10 west edge.'],
    useTags: ['door-number'],
  },
  {
    id: 'D-10-103',
    label: '103',
    number: '103',
    buildingId: 'BLD-10',
    yardId: null,
    x: -8.9,
    z: -3.2,
    verificationStatus: 'Partially Verified',
    sourceNotes: ['2020 customer map', 'Google/satellite reference'],
    operationalNotes: ['Lower door number on Building #10 west edge.'],
    useTags: ['door-number'],
  },
  {
    id: 'D-05-101',
    label: '101',
    number: '101',
    buildingId: 'BLD-05',
    yardId: null,
    x: -2.5,
    z: -1.1,
    verificationStatus: 'Partially Verified',
    sourceNotes: ['2020 customer map', 'Google/satellite reference'],
    operationalNotes: ['Door number printed at the east end of Building #5.'],
    useTags: ['door-number'],
  },
  {
    id: 'D-05-102',
    label: '102',
    number: '102',
    buildingId: 'BLD-05',
    yardId: null,
    x: -3.3,
    z: 1.2,
    verificationStatus: 'Partially Verified',
    sourceNotes: ['2020 customer map', 'Google/satellite reference'],
    operationalNotes: ['Door number printed near the south-east side of Building #5.'],
    useTags: ['door-number'],
  },
  {
    id: 'D-05-51',
    label: '51',
    number: '51',
    buildingId: 'BLD-05',
    yardId: null,
    x: -6.4,
    z: 2.0,
    verificationStatus: 'Partially Verified',
    sourceNotes: ['2020 customer map', 'Google/satellite reference'],
    operationalNotes: ['Printed below the Building #5 label on the customer map.'],
    useTags: ['door-number'],
  },
  {
    id: 'D-07-71',
    label: '71',
    number: '71',
    buildingId: 'BLD-07',
    yardId: 'YRD-01',
    x: -0.8,
    z: 3.1,
    verificationStatus: 'Partially Verified',
    sourceNotes: ['2020 customer map', 'Google/satellite reference'],
    operationalNotes: ['Printed at the north edge of Building #7 near Yard #1.'],
    useTags: ['door-number', 'yard-access'],
  },
  {
    id: 'D-08-81',
    label: '81',
    number: '81',
    buildingId: 'BLD-08',
    yardId: 'YRD-02',
    x: 2.1,
    z: 12.0,
    verificationStatus: 'Partially Verified',
    sourceNotes: ['2020 customer map', 'Google/satellite reference'],
    operationalNotes: ['Printed on Building #8 near Yard #2.'],
    useTags: ['door-number', 'yard-access'],
  },
  {
    id: 'D-02-22',
    label: '22',
    number: '22',
    buildingId: 'BLD-02',
    yardId: null,
    x: 5.4,
    z: -2.4,
    verificationStatus: 'Partially Verified',
    sourceNotes: ['2020 customer map', 'Google/satellite reference'],
    operationalNotes: ['Printed near the east apron between Building #2 and the customer/loading area.'],
    useTags: ['door-number'],
  },
  {
    id: 'D-02-21',
    label: '21',
    number: '21',
    buildingId: 'BLD-02',
    yardId: null,
    x: 8.3,
    z: -2.3,
    verificationStatus: 'Partially Verified',
    sourceNotes: ['2020 customer map', 'Google/satellite reference'],
    operationalNotes: ['Printed east of Door 22 near the Granite Showroom approach.'],
    useTags: ['door-number'],
  },
  {
    id: 'D-01-15',
    label: '15',
    number: '15',
    buildingId: 'BLD-01',
    yardId: null,
    x: 14.1,
    z: 1.0,
    verificationStatus: 'Partially Verified',
    sourceNotes: ['2020 customer map', 'Google/satellite reference'],
    operationalNotes: ['Printed on the north-west corner of Building #1.'],
    useTags: ['door-number'],
  },
  {
    id: 'D-01-11',
    label: '11',
    number: '11',
    buildingId: 'BLD-01',
    yardId: 'YRD-01',
    x: 17.3,
    z: 4.3,
    verificationStatus: 'Partially Verified',
    sourceNotes: ['2020 customer map', 'Google/satellite reference'],
    operationalNotes: ['Printed next to the Customer Loading Dock label.'],
    useTags: ['door-number', 'customer-loading'],
  },
]
