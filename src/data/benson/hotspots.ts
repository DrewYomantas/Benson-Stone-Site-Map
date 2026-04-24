import type { Hotspot } from '../../types'

// Positions are percentages (0-100) of the map image dimensions.
// x=0 is left edge, y=0 is top edge.
// These were estimated from the 2020 aerial map scan.
// Adjust values as needed after loading the real image.

export const hotspots: Hotspot[] = [
  // ── Buildings ──────────────────────────────────────────────────────────────
  {
    entityId: 'BLD-01',
    entityType: 'building',
    position: { x: 78, y: 52, w: 10, h: 12 },
    label: 'Building #1',
    priority: 'high',
  },
  {
    entityId: 'BLD-02',
    entityType: 'building',
    position: { x: 48, y: 32, w: 14, h: 10 },
    label: 'Building #2',
    priority: 'high',
  },
  {
    entityId: 'BLD-03',
    entityType: 'building',
    position: { x: 17, y: 10, w: 8, h: 7 },
    label: 'Building #3',
    priority: 'high',
  },
  {
    entityId: 'BLD-04',
    entityType: 'building',
    position: { x: 20, y: 28, w: 9, h: 8 },
    label: 'Building #4',
    priority: 'high',
  },
  {
    entityId: 'BLD-05',
    entityType: 'building',
    position: { x: 32, y: 49, w: 8, h: 7 },
    label: 'Building #5',
    priority: 'high',
  },
  {
    entityId: 'BLD-06',
    entityType: 'building',
    position: { x: 27, y: 62, w: 9, h: 7 },
    label: 'Building #6',
    priority: 'high',
  },
  {
    entityId: 'BLD-07',
    entityType: 'building',
    position: { x: 38, y: 60, w: 9, h: 7 },
    label: 'Building #7',
    priority: 'high',
  },
  {
    entityId: 'BLD-08',
    entityType: 'building',
    position: { x: 47, y: 72, w: 10, h: 8 },
    label: 'Building #8',
    priority: 'high',
  },
  {
    entityId: 'BLD-10',
    entityType: 'building',
    position: { x: 37, y: 42, w: 8, h: 6 },
    label: 'Building #10',
    priority: 'high',
  },

  // ── Yards ──────────────────────────────────────────────────────────────────
  {
    entityId: 'YRD-01',
    entityType: 'yard',
    position: { x: 52, y: 63, w: 10, h: 8 },
    label: 'Yard #1',
    priority: 'medium',
  },
  {
    entityId: 'YRD-02',
    entityType: 'yard',
    position: { x: 52, y: 78, w: 10, h: 7 },
    label: 'Yard #2',
    priority: 'medium',
  },
  {
    entityId: 'YRD-03',
    entityType: 'yard',
    position: { x: 18, y: 22, w: 9, h: 7 },
    label: 'Yard #3',
    priority: 'medium',
  },

  // ── Entrances / Site Points ────────────────────────────────────────────────
  {
    entityId: 'ENT-GRANITE',
    entityType: 'entrance',
    position: { x: 67, y: 28 },
    label: 'Granite Showroom',
    priority: 'medium',
  },
  {
    entityId: 'ENT-NORTH',
    entityType: 'entrance',
    position: { x: 90, y: 43 },
    label: 'North Entrance',
    priority: 'medium',
  },
  {
    entityId: 'ENT-SOUTH',
    entityType: 'entrance',
    position: { x: 85, y: 57 },
    label: 'South Entrance',
    priority: 'medium',
  },
  {
    entityId: 'ENT-SHIPREC',
    entityType: 'entrance',
    position: { x: 79, y: 56 },
    label: 'Shipping/Receiving',
    priority: 'medium',
  },
  {
    entityId: 'LOAD-CUST-S',
    entityType: 'entrance',
    position: { x: 68, y: 54 },
    label: 'Customer Loading',
    priority: 'medium',
  },
  {
    entityId: 'SITE-SCALE',
    entityType: 'entrance',
    position: { x: 57, y: 64 },
    label: 'Scale House',
    priority: 'medium',
  },

  // ── Doors ──────────────────────────────────────────────────────────────────
  {
    entityId: 'D-01-11',
    entityType: 'door',
    position: { x: 72, y: 52 },
    label: '11',
    priority: 'low',
  },
  {
    entityId: 'D-01-14',
    entityType: 'door',
    position: { x: 74, y: 49 },
    label: '14',
    priority: 'low',
  },
  {
    entityId: 'D-01-15',
    entityType: 'door',
    position: { x: 73, y: 46 },
    label: '15',
    priority: 'low',
  },
  {
    entityId: 'D-01-16',
    entityType: 'door',
    position: { x: 75, y: 44 },
    label: '16',
    priority: 'low',
  },
  {
    entityId: 'D-02-22',
    entityType: 'door',
    position: { x: 62, y: 40 },
    label: '22',
    priority: 'low',
  },
  {
    entityId: 'D-02-23',
    entityType: 'door',
    position: { x: 49, y: 31 },
    label: '23',
    priority: 'low',
  },
  {
    entityId: 'D-02-24',
    entityType: 'door',
    position: { x: 47, y: 28 },
    label: '24',
    priority: 'low',
  },
  {
    entityId: 'D-02-25',
    entityType: 'door',
    position: { x: 45, y: 26 },
    label: '25',
    priority: 'low',
  },
  {
    entityId: 'D-03-31',
    entityType: 'door',
    position: { x: 31, y: 20 },
    label: '31',
    priority: 'low',
  },
  {
    entityId: 'D-03-32',
    entityType: 'door',
    position: { x: 16, y: 12 },
    label: '32',
    priority: 'low',
  },
  {
    entityId: 'D-03-33',
    entityType: 'door',
    position: { x: 15, y: 14 },
    label: '33',
    priority: 'low',
  },
  {
    entityId: 'D-03-34',
    entityType: 'door',
    position: { x: 14, y: 16 },
    label: '34',
    priority: 'low',
  },
  {
    entityId: 'D-03-35',
    entityType: 'door',
    position: { x: 13, y: 18 },
    label: '35',
    priority: 'low',
  },
]
