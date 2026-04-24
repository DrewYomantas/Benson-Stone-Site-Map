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
  referenceImage: '/reference/benson-campus-reference.png',
}

export const DEFAULT_CAM_POS: [number, number, number] = [24, 24, 26]
export const DEFAULT_CAM_LOOK: [number, number, number] = [1, 0, 0]

export const scene3dBuildings: Building3D[] = [
  withBounds({
    id: 'BLD-01',
    label: 'Building #1',
    footprint: [
      [10.8, -2.2],
      [19.8, -2.2],
      [19.8, 3.7],
      [15.2, 3.7],
      [15.2, 1.6],
      [12.4, 1.6],
      [12.4, 4.4],
      [10.8, 4.4],
    ],
    height: 5.2,
    wallColor: '#7d5f4a',
    roofColor: '#5a5451',
    wallMaterial: 'stone',
    roofMaterial: 'membrane',
    labelPosition: [16.8, 1.1],
    verificationStatus: 'Partially Verified',
    sourceNotes: ['Old site map', 'Google/satellite reference', 'Benson Stone public website'],
    operationalNotes: ['Primary east-side public building mass is confirmed; exact department lines still need walk-through validation.'],
    useTags: ['showroom', 'customer-service', 'shipping'],
  }),
  withBounds({
    id: 'BLD-02',
    label: 'Building #2',
    footprint: [
      [-4.9, -9.6],
      [0.8, -10.4],
      [2.6, -8.5],
      [2.0, -5.2],
      [0.4, -2.7],
      [-4.6, -2.1],
      [-6.4, -3.8],
      [-6.9, -7.4],
    ],
    height: 4.4,
    wallColor: '#8b6a58',
    roofColor: '#534b47',
    wallMaterial: 'brick',
    roofMaterial: 'metal',
    labelPosition: [-1.9, -6.2],
    verificationStatus: 'Partially Verified',
    sourceNotes: ['Old site map', 'Google/satellite reference'],
    operationalNotes: ['South-west diagonal footprint is inferred from overhead imagery; showroom entry location is approximate.'],
    useTags: ['showroom', 'granite', 'customer'],
  }),
  withBounds({
    id: 'BLD-03',
    label: 'Building #3',
    footprint: [
      [-19.1, -16.3],
      [-14.2, -16.3],
      [-13.6, -14.1],
      [-14.6, -11.9],
      [-19.1, -11.9],
    ],
    height: 3.5,
    wallColor: '#78624e',
    roofColor: '#4a4542',
    wallMaterial: 'brick',
    roofMaterial: 'metal',
    labelPosition: [-16.6, -13.9],
    verificationStatus: 'Partially Verified',
    sourceNotes: ['Old site map', 'Google/satellite reference'],
    operationalNotes: ['North-west shop/service structure footprint refined from roofline shape, but door counts still need field check.'],
    useTags: ['warehouse', 'service'],
  }),
  withBounds({
    id: 'BLD-04',
    label: 'Building #4',
    footprint: [
      [-18.2, -9.4],
      [-13.4, -9.4],
      [-13.0, -7.4],
      [-13.6, -5.6],
      [-18.4, -5.6],
    ],
    height: 3.1,
    wallColor: '#6c5747',
    roofColor: '#4d4844',
    wallMaterial: 'brick',
    roofMaterial: 'metal',
    labelPosition: [-15.8, -7.6],
    verificationStatus: 'Partially Verified',
    sourceNotes: ['Old site map', 'Google/satellite reference'],
    operationalNotes: ['Roof shape suggests a slightly skewed service building rather than a pure rectangle.'],
    useTags: ['service', 'warehouse'],
  }),
  withBounds({
    id: 'BLD-05',
    label: 'Building #5',
    footprint: [
      [-10.8, -1.9],
      [-6.5, -1.9],
      [-6.5, 0.8],
      [-8.0, 0.8],
      [-8.0, 1.9],
      [-10.8, 1.9],
    ],
    height: 2.7,
    wallColor: '#756352',
    roofColor: '#4f4a45',
    wallMaterial: 'stone',
    roofMaterial: 'membrane',
    labelPosition: [-8.7, 0.1],
    verificationStatus: 'Unverified',
    sourceNotes: ['Old site map', 'Google/satellite reference'],
    operationalNotes: ['Likely small support structure; footprint has a north-side step visible in aerial reference.'],
    useTags: ['support'],
  }),
  withBounds({
    id: 'BLD-06',
    label: 'Building #6',
    footprint: [
      [-13.8, 2.6],
      [-8.7, 2.6],
      [-8.2, 4.1],
      [-8.8, 5.8],
      [-13.8, 5.8],
    ],
    height: 2.5,
    wallColor: '#6f5d4d',
    roofColor: '#57504b',
    wallMaterial: 'brick',
    roofMaterial: 'metal',
    labelPosition: [-11.1, 4.2],
    verificationStatus: 'Unverified',
    sourceNotes: ['Old site map', 'Google/satellite reference'],
    operationalNotes: ['Central-west small building footprint tightened to match visible roof taper.'],
    useTags: ['warehouse', 'yard-support'],
  }),
  withBounds({
    id: 'BLD-07',
    label: 'Building #7',
    footprint: [
      [-7.5, 2.7],
      [-2.3, 2.7],
      [-1.8, 4.0],
      [-2.2, 5.9],
      [-7.5, 5.9],
    ],
    height: 2.4,
    wallColor: '#7d6651',
    roofColor: '#544c47',
    wallMaterial: 'brick',
    roofMaterial: 'metal',
    labelPosition: [-4.9, 4.3],
    verificationStatus: 'Unverified',
    sourceNotes: ['Old site map', 'Google/satellite reference'],
    operationalNotes: ['Paired west-yard structure; exact use still needs confirmation on-site.'],
    useTags: ['warehouse', 'yard-support'],
  }),
  withBounds({
    id: 'BLD-08',
    label: 'Building #8',
    footprint: [
      [-4.1, 6.3],
      [1.2, 6.3],
      [1.8, 8.1],
      [1.2, 10.4],
      [-4.1, 10.4],
    ],
    height: 2.9,
    wallColor: '#836956',
    roofColor: '#4d4844',
    wallMaterial: 'brick',
    roofMaterial: 'metal',
    labelPosition: [-1.4, 8.4],
    verificationStatus: 'Partially Verified',
    sourceNotes: ['Old site map', 'Google/satellite reference'],
    operationalNotes: ['Southern structure appears deeper at the center than the old hotspot rectangle indicated.'],
    useTags: ['warehouse', 'yard-access'],
  }),
  withBounds({
    id: 'BLD-10',
    label: 'Building #10',
    footprint: [
      [-8.5, -5.1],
      [-4.2, -5.1],
      [-3.6, -3.6],
      [-4.1, -1.8],
      [-8.5, -1.8],
    ],
    height: 2.3,
    wallColor: '#715d4f',
    roofColor: '#4a4541',
    wallMaterial: 'stone',
    roofMaterial: 'metal',
    labelPosition: [-6.2, -3.3],
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
      [-0.2, 2.8],
      [5.9, 2.8],
      [6.4, 6.2],
      [4.6, 7.4],
      [0.3, 7.4],
      [-0.4, 5.2],
    ],
    surfaceColor: '#5d564a',
    borderColor: '#85755d',
    labelPosition: [3.1, 5.3],
    verificationStatus: 'Partially Verified',
    sourceNotes: ['Old site map', 'Google/satellite reference'],
    operationalNotes: ['Central yard footprint based on open paved pocket between west building groups.'],
    useTags: ['contractor-yard', 'loading'],
  }),
  withBounds({
    id: 'YRD-02',
    label: 'Yard #2',
    footprint: [
      [-0.8, 8.0],
      [5.5, 8.0],
      [6.1, 11.2],
      [0.1, 11.2],
      [-0.9, 9.6],
    ],
    surfaceColor: '#61584b',
    borderColor: '#8a7a5f',
    labelPosition: [2.4, 9.8],
    verificationStatus: 'Partially Verified',
    sourceNotes: ['Old site map', 'Google/satellite reference'],
    operationalNotes: ['South yard remains approximate, but its southern boundary is more elongated than before.'],
    useTags: ['storage-yard', 'contractor-yard'],
  }),
  withBounds({
    id: 'YRD-03',
    label: 'Yard #3',
    footprint: [
      [-19.7, -11.0],
      [-14.4, -11.0],
      [-13.1, -9.2],
      [-13.0, -6.1],
      [-18.6, -6.1],
      [-19.9, -8.0],
    ],
    surfaceColor: '#555e4c',
    borderColor: '#7c8a69',
    labelPosition: [-16.4, -8.5],
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
      [8.8, -4.3],
      [23.2, -4.3],
      [23.2, 7.2],
      [8.8, 7.2],
    ],
    color: '#2f3133',
    opacity: 0.96,
  },
  {
    id: 'SURF-EAST-PARKING',
    label: 'Customer parking',
    kind: 'parking',
    footprint: [
      [15.3, -13.6],
      [23.8, -13.6],
      [23.8, -5.3],
      [13.9, -5.3],
    ],
    color: '#35383b',
    opacity: 0.88,
    stripeColor: '#9f9684',
  },
  {
    id: 'SURF-CENTRAL-DRIVE',
    label: 'Central drive',
    kind: 'driveway',
    footprint: [
      [-8.8, -1.2],
      [11.2, -1.2],
      [12.6, 1.1],
      [11.8, 3.4],
      [-8.8, 3.4],
    ],
    color: '#303235',
    opacity: 0.92,
  },
  {
    id: 'SURF-SOUTH-DRIVE',
    label: 'South drive',
    kind: 'driveway',
    footprint: [
      [-4.8, 5.3],
      [14.8, 5.3],
      [14.8, 8.1],
      [-3.2, 8.1],
    ],
    color: '#2d3032',
    opacity: 0.88,
  },
  {
    id: 'SURF-WEST-CONTRACTOR',
    label: 'Contractor/loading area',
    kind: 'contractor',
    footprint: [
      [-1.0, 1.9],
      [7.8, 1.9],
      [8.8, 8.4],
      [1.2, 8.4],
      [-0.8, 6.4],
    ],
    color: '#494237',
    opacity: 0.58,
    borderColor: '#8d7c60',
  },
  {
    id: 'SURF-NW-SERVICE',
    label: 'North-west service lane',
    kind: 'asphalt',
    footprint: [
      [-21.4, -17.9],
      [-11.9, -17.9],
      [-11.9, -10.6],
      [-13.3, -10.6],
      [-14.2, -12.8],
      [-21.4, -12.8],
    ],
    color: '#2e3032',
    opacity: 0.82,
  },
  {
    id: 'SURF-YARD-01-BOUNDARY',
    kind: 'yard-boundary',
    footprint: [
      [-0.5, 2.2],
      [6.5, 2.2],
      [7.4, 7.9],
      [0.0, 7.9],
      [-0.8, 5.8],
    ],
    color: '#8e7b5d',
    opacity: 0.08,
    borderColor: '#9f8965',
  },
  {
    id: 'SURF-YARD-03-BOUNDARY',
    kind: 'yard-boundary',
    footprint: [
      [-20.6, -11.7],
      [-13.5, -11.7],
      [-12.3, -9.0],
      [-12.2, -5.4],
      [-18.9, -5.4],
      [-20.6, -7.5],
    ],
    color: '#8e7b5d',
    opacity: 0.08,
    borderColor: '#9f8965',
  },
]

export const scene3dEntrances: Entrance3D[] = [
  {
    id: 'ENT-GRANITE',
    label: 'Granite Showroom',
    x: 4.3,
    z: -6.7,
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
    x: 20.5,
    z: -1.8,
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
    x: 19.0,
    z: 3.0,
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
    x: 14.2,
    z: 4.7,
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
    x: 12.2,
    z: 2.6,
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
    x: 5.5,
    z: 5.4,
    customerFacing: false,
    markerType: 'site-point',
    verificationStatus: 'Partially Verified',
    sourceNotes: ['Old site map', 'Google/satellite reference'],
    operationalNotes: ['Scale house marker sits at the north edge of Yard #1 and still needs field confirmation.'],
    useTags: ['site-point', 'operations'],
  },
]
