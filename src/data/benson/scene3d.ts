// ─── 3D Scene Layout Data ─────────────────────────────────────────────────────
//
// All world coordinates derived from the 2020 aerial map hotspot percentages.
//
// Mapping formula:
//   worldX = (pctX / 100) * 50 − 25      (west–east, -25 … +25)
//   worldZ = (pctY / 100) * 35 − 17.5    (north–south, -17.5 … +17.5)
//   worldW = (pctW / 100) * 50
//   worldD = (pctH / 100) * 35
//
// All positions and sizes are APPROXIMATE — derived from aerial map scan.
// Adjust x/z/width/depth per building after on-site verification.
//
// ─────────────────────────────────────────────────────────────────────────────

export interface Building3D {
  id: string
  label: string
  x: number        // world X center
  z: number        // world Z center (depth/north-south axis)
  width: number    // east-west footprint
  depth: number    // north-south footprint
  height: number   // building height (estimated, stylized)
  wallColor: string
  roofColor: string
}

export interface Yard3D {
  id: string
  label: string
  x: number
  z: number
  width: number
  depth: number
  surfaceColor: string
  borderColor: string
}

export interface Entrance3D {
  id: string
  label: string
  x: number
  z: number
  customerFacing: boolean
}

// Default camera position and look-at for resetting the view
export const DEFAULT_CAM_POS: [number, number, number] = [18, 22, 18]
export const DEFAULT_CAM_LOOK: [number, number, number] = [0, 0, 0]

// ─── Buildings ────────────────────────────────────────────────────────────────

export const scene3dBuildings: Building3D[] = [
  {
    id: 'BLD-01',
    label: 'Building #1',
    x: 14.0,  z: 0.7,
    width: 5.0, depth: 4.2,
    height: 4.5,
    wallColor: '#c8b898',
    roofColor: '#464240',
  },
  {
    id: 'BLD-02',
    label: 'Building #2',
    x: -1.0,  z: -6.3,
    width: 7.0, depth: 3.5,
    height: 3.5,
    wallColor: '#c2baa4',
    roofColor: '#504844',
  },
  {
    id: 'BLD-03',
    label: 'Building #3',
    x: -16.5, z: -14.0,
    width: 4.0, depth: 2.45,
    height: 3.0,
    wallColor: '#b8a888',
    roofColor: '#403c38',
  },
  {
    id: 'BLD-04',
    label: 'Building #4',
    x: -15.0, z: -7.7,
    width: 4.5, depth: 2.8,
    height: 3.0,
    wallColor: '#b0a088',
    roofColor: '#484438',
  },
  {
    id: 'BLD-05',
    label: 'Building #5',
    x: -9.0,  z: -0.35,
    width: 4.0, depth: 2.45,
    height: 2.5,
    wallColor: '#aca490',
    roofColor: '#3e3c38',
  },
  {
    id: 'BLD-06',
    label: 'Building #6',
    x: -11.5, z: 4.2,
    width: 4.5, depth: 2.45,
    height: 2.0,
    wallColor: '#a89880',
    roofColor: '#464040',
  },
  {
    id: 'BLD-07',
    label: 'Building #7',
    x: -6.0,  z: 3.5,
    width: 4.5, depth: 2.45,
    height: 2.0,
    wallColor: '#b2a880',
    roofColor: '#424038',
  },
  {
    id: 'BLD-08',
    label: 'Building #8',
    x: -1.5,  z: 7.7,
    width: 5.0, depth: 2.8,
    height: 2.5,
    wallColor: '#a49488',
    roofColor: '#3c3a36',
  },
  {
    id: 'BLD-10',
    label: 'Building #10',
    x: -6.5,  z: -2.8,
    width: 4.0, depth: 2.1,
    height: 2.0,
    wallColor: '#b0a890',
    roofColor: '#444038',
  },
]

// ─── Yards ────────────────────────────────────────────────────────────────────

export const scene3dYards: Yard3D[] = [
  {
    id: 'YRD-01',
    label: 'Yard #1',
    x: 1.0,   z: 4.55,
    width: 5.0, depth: 2.8,
    surfaceColor: '#5a5448',
    borderColor: '#6e6558',
  },
  {
    id: 'YRD-02',
    label: 'Yard #2',
    x: 1.0,   z: 9.8,
    width: 5.0, depth: 2.45,
    surfaceColor: '#524c40',
    borderColor: '#655e50',
  },
  {
    id: 'YRD-03',
    label: 'Yard #3',
    x: -16.0, z: -9.8,
    width: 4.5, depth: 2.45,
    surfaceColor: '#4e5848',
    borderColor: '#606e58',
  },
]

// ─── Entrances & Site Points ───────────────────────────────────────────────────

export const scene3dEntrances: Entrance3D[] = [
  { id: 'ENT-GRANITE',  label: 'Granite Showroom',    x: 8.5,  z: -7.7,  customerFacing: true  },
  { id: 'ENT-NORTH',    label: 'North Entrance',       x: 20.0, z: -2.45, customerFacing: true  },
  { id: 'ENT-SOUTH',    label: 'South Entrance',       x: 17.5, z: 2.45,  customerFacing: true  },
  { id: 'ENT-SHIPREC',  label: 'Shipping / Receiving', x: 14.5, z: 2.1,   customerFacing: false },
  { id: 'LOAD-CUST-S',  label: 'Customer Loading',     x: 9.0,  z: 1.4,   customerFacing: true  },
  { id: 'SITE-SCALE',   label: 'Scale House',          x: 3.5,  z: 4.9,   customerFacing: false },
]
