import { buildings } from '../../data/benson/buildings'
import { yards } from '../../data/benson/yards'
import { entrances } from '../../data/benson/entrances'
import { doors } from '../../data/benson/doors'
import type { EntityType, FilterState } from '../../types'

export interface SearchResult {
  entityId: string
  entityType: EntityType
  displayName: string
  label: string
  status: string
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function matchesBuilding(query: string, num: number): boolean {
  const n = normalize(query)
  const numStr = String(num)
  return (
    n === normalize(`building${numStr}`) ||
    n === normalize(`building #${numStr}`) ||
    n === normalize(`bld${numStr}`) ||
    n === normalize(`bld #${numStr}`) ||
    n === normalize(`b${numStr}`) ||
    n === numStr
  )
}

function matchesYard(query: string, num: number): boolean {
  const n = normalize(query)
  const numStr = String(num)
  return (
    n === normalize(`yard${numStr}`) ||
    n === normalize(`yard #${numStr}`) ||
    n === normalize(`yrd${numStr}`) ||
    n === normalize(`y${numStr}`)
  )
}

function matchesDoor(query: string, num: string): boolean {
  const n = normalize(query)
  return (
    n === normalize(`door${num}`) ||
    n === normalize(`door #${num}`) ||
    n === normalize(`d${num}`) ||
    n === num
  )
}

function fuzzyContains(haystack: string, needle: string): boolean {
  return normalize(haystack).includes(normalize(needle))
}

export function search(query: string, filters: FilterState): SearchResult[] {
  if (!query.trim()) return []
  const q = query.trim()
  const results: SearchResult[] = []

  if (filters.buildings) {
    for (const b of buildings) {
      if (
        matchesBuilding(q, b.number) ||
        fuzzyContains(b.displayName, q) ||
        fuzzyContains(b.notes, q)
      ) {
        if (filters.verifiedOnly && b.status !== 'Verified') continue
        if (filters.needsReview && b.status !== 'Needs Review') continue
        results.push({
          entityId: b.id,
          entityType: 'building',
          displayName: b.displayName,
          label: b.mapLabel,
          status: b.status,
        })
      }
    }
  }

  if (filters.yards) {
    for (const y of yards) {
      if (
        matchesYard(q, y.number) ||
        fuzzyContains(y.displayName, q) ||
        fuzzyContains(y.notes, q)
      ) {
        if (filters.verifiedOnly && y.status !== 'Verified') continue
        if (filters.needsReview && y.status !== 'Needs Review') continue
        results.push({
          entityId: y.id,
          entityType: 'yard',
          displayName: y.displayName,
          label: y.mapLabel,
          status: y.status,
        })
      }
    }
  }

  if (filters.entrances) {
    for (const e of entrances) {
      if (
        fuzzyContains(e.displayName, q) ||
        fuzzyContains(e.id, q)
      ) {
        if (filters.verifiedOnly && e.status !== 'Verified') continue
        if (filters.needsReview && e.status !== 'Needs Review') continue
        results.push({
          entityId: e.id,
          entityType: 'entrance',
          displayName: e.displayName,
          label: e.displayName,
          status: e.status,
        })
      }
    }
  }

  if (filters.doors) {
    for (const d of doors) {
      if (
        matchesDoor(q, d.number) ||
        fuzzyContains(d.displayName, q)
      ) {
        if (filters.verifiedOnly && d.status !== 'Verified') continue
        if (filters.needsReview && d.status !== 'Needs Review') continue
        results.push({
          entityId: d.id,
          entityType: 'door',
          displayName: d.displayName,
          label: `Door ${d.number}`,
          status: d.status,
        })
      }
    }
  }

  return results
}

export function getAllEntities(filters: FilterState): SearchResult[] {
  const results: SearchResult[] = []

  if (filters.buildings) {
    for (const b of buildings) {
      if (filters.verifiedOnly && b.status !== 'Verified') continue
      if (filters.needsReview && b.status !== 'Needs Review') continue
      results.push({ entityId: b.id, entityType: 'building', displayName: b.displayName, label: b.mapLabel, status: b.status })
    }
  }
  if (filters.yards) {
    for (const y of yards) {
      if (filters.verifiedOnly && y.status !== 'Verified') continue
      if (filters.needsReview && y.status !== 'Needs Review') continue
      results.push({ entityId: y.id, entityType: 'yard', displayName: y.displayName, label: y.mapLabel, status: y.status })
    }
  }
  if (filters.entrances) {
    for (const e of entrances) {
      if (filters.verifiedOnly && e.status !== 'Verified') continue
      if (filters.needsReview && e.status !== 'Needs Review') continue
      results.push({ entityId: e.id, entityType: 'entrance', displayName: e.displayName, label: e.displayName, status: e.status })
    }
  }
  if (filters.doors) {
    for (const d of doors) {
      if (filters.verifiedOnly && d.status !== 'Verified') continue
      if (filters.needsReview && d.status !== 'Needs Review') continue
      results.push({ entityId: d.id, entityType: 'door', displayName: d.displayName, label: `Door ${d.number}`, status: d.status })
    }
  }

  return results
}
