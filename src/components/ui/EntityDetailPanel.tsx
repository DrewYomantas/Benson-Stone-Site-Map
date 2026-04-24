import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StatusBadge } from './StatusBadge'
import { BuildingCutawayPanel } from './BuildingCutawayPanel'
import { buildings, yards, entrances, doors } from '../../data/benson'
import type { EntityType } from '../../types'

interface Props {
  entityId: string | null
  entityType: EntityType | null
  onClose: () => void
}

const TYPE_LABEL: Record<EntityType, string> = {
  building: 'Building',
  yard: 'Outdoor Yard',
  entrance: 'Entrance / Site Point',
  door: 'Door',
}

const TYPE_COLOR: Record<EntityType, string> = {
  building: 'text-amber-400',
  yard: 'text-emerald-400',
  entrance: 'text-sky-400',
  door: 'text-stone-400',
}

function Row({ label, value }: { label: string; value: string | null | boolean }) {
  const display = value === null || value === undefined ? '—' : value === true ? 'Yes' : value === false ? 'No' : String(value)
  return (
    <div className="flex justify-between items-start gap-4 py-2 border-b border-stone-800/40 last:border-0">
      <span className="text-[11px] font-mono uppercase tracking-wider text-stone-600 shrink-0">{label}</span>
      <span className="text-xs text-stone-300 text-right leading-relaxed">{display}</span>
    </div>
  )
}

function RelatedPill({ label, type }: { label: string; type: EntityType }) {
  const colors: Record<EntityType, string> = {
    building: 'bg-amber-900/30 text-amber-300 border-amber-700/30',
    yard: 'bg-emerald-900/30 text-emerald-300 border-emerald-700/30',
    entrance: 'bg-sky-900/30 text-sky-300 border-sky-700/30',
    door: 'bg-stone-800/50 text-stone-400 border-stone-700/30',
  }
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono border ${colors[type]}`}>
      {label}
    </span>
  )
}

export function EntityDetailPanel({ entityId, entityType, onClose }: Props) {
  const [cutawayOpen, setCutawayOpen] = useState(false)

  const building = entityType === 'building' ? buildings.find((b) => b.id === entityId) : null
  const yard = entityType === 'yard' ? yards.find((y) => y.id === entityId) : null
  const entrance = entityType === 'entrance' ? entrances.find((e) => e.id === entityId) : null
  const door = entityType === 'door' ? doors.find((d) => d.id === entityId) : null

  const entity = building || yard || entrance || door
  if (!entity || !entityType) return null

  const status = entity.status

  return (
    <AnimatePresence mode="wait">
      <motion.aside
        key={entityId}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 24 }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-80 shrink-0 flex flex-col h-full border-l border-stone-800/60 bg-stone-950/90 overflow-y-auto"
      >
        <div className="p-5 flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 pt-2">
            <div className="space-y-1 flex-1 min-w-0">
              <p className={`text-[10px] font-mono uppercase tracking-widest ${TYPE_COLOR[entityType]}`}>
                {TYPE_LABEL[entityType]}
              </p>
              <h2 className="font-display text-xl font-semibold text-stone-100 leading-tight">
                {entity.displayName}
              </h2>
              <div className="pt-1">
                <StatusBadge status={status} />
              </div>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 w-7 h-7 rounded flex items-center justify-center text-stone-500 hover:text-stone-300 hover:bg-stone-800/50 transition-all mt-1"
            >
              ✕
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-stone-800/50" />

          {/* Building-specific */}
          {building && (
            <div className="space-y-2">
              <Row label="ID" value={building.id} />
              <Row label="Public facing" value={building.publicFacing} />
              <Row label="Primary use" value={building.primaryUse} />
              <Row label="Interior map" value={building.hasInteriorMap ? 'Available' : 'Not yet mapped'} />
              <Row label="Verified by" value={building.verifiedBy} />
              <Row label="Verified on" value={building.verifiedOn} />

              {building.relatedYardIds.length > 0 && (
                <div className="pt-1">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-stone-600 mb-2">Related yards</p>
                  <div className="flex flex-wrap gap-1.5">
                    {building.relatedYardIds.map((id) => {
                      const y = yards.find((yrd) => yrd.id === id)
                      return y ? <RelatedPill key={id} label={y.displayName} type="yard" /> : null
                    })}
                  </div>
                </div>
              )}

              {building.relatedDoorIds.length > 0 && (
                <div className="pt-1">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-stone-600 mb-2">Associated doors</p>
                  <div className="flex flex-wrap gap-1.5">
                    {building.relatedDoorIds.map((id) => {
                      const d = doors.find((dr) => dr.id === id)
                      return d ? <RelatedPill key={id} label={`Door ${d.number}`} type="door" /> : null
                    })}
                  </div>
                </div>
              )}

              {/* Explore Building button */}
              <button
                onClick={() => setCutawayOpen((v) => !v)}
                className="w-full mt-2 py-2.5 rounded-lg border border-amber-700/40 text-amber-400 text-xs font-mono uppercase tracking-wider hover:bg-amber-900/20 transition-all duration-150 flex items-center justify-center gap-2"
              >
                <span>{cutawayOpen ? '▲' : '▼'}</span>
                {cutawayOpen ? 'Close exploration view' : 'Explore building interior'}
              </button>

              <BuildingCutawayPanel
                building={building}
                isOpen={cutawayOpen}
                onClose={() => setCutawayOpen(false)}
              />
            </div>
          )}

          {/* Yard-specific */}
          {yard && (
            <div className="space-y-2">
              <Row label="ID" value={yard.id} />
              <Row label="Primary use" value={yard.primaryUse} />
              <Row label="Access notes" value={yard.accessNotes} />
              <Row label="Weather exposure" value={yard.weatherNotes} />
              <Row label="Verified by" value={yard.verifiedBy} />
              <Row label="Verified on" value={yard.verifiedOn} />

              {yard.relatedBuildingIds.length > 0 && (
                <div className="pt-1">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-stone-600 mb-2">Adjacent buildings</p>
                  <div className="flex flex-wrap gap-1.5">
                    {yard.relatedBuildingIds.map((id) => {
                      const b = buildings.find((bl) => bl.id === id)
                      return b ? <RelatedPill key={id} label={b.displayName} type="building" /> : null
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Entrance-specific */}
          {entrance && (
            <div className="space-y-2">
              <Row label="ID" value={entrance.id} />
              <Row label="Type" value={entrance.type} />
              <Row label="Customer facing" value={entrance.customerFacing} />
              <Row label="Related building" value={entrance.relatedBuildingId ? buildings.find((b) => b.id === entrance.relatedBuildingId)?.displayName ?? entrance.relatedBuildingId : null} />
              <Row label="Related yard" value={entrance.relatedYardId ? yards.find((y) => y.id === entrance.relatedYardId)?.displayName ?? entrance.relatedYardId : null} />
              <Row label="Related door" value={entrance.relatedDoorId} />
            </div>
          )}

          {/* Door-specific */}
          {door && (
            <div className="space-y-2">
              <Row label="Door number" value={door.number} />
              <Row label="ID" value={door.id} />
              <Row label="Door type" value={door.doorType} />
              <Row label="Use description" value={door.useDescription} />
              <Row label="Public access" value={door.publicAccess} />
              <Row label="Restricted" value={door.restrictedAccess} />
              <Row label="Entrance label" value={door.entranceLabel} />
              <Row label="Building" value={door.buildingId ? buildings.find((b) => b.id === door.buildingId)?.displayName ?? door.buildingId : null} />
              <Row label="Verified by" value={door.verifiedBy} />
              <Row label="Verified on" value={door.verifiedOn} />
            </div>
          )}

          {/* Notes */}
          {entity.notes && (
            <div className="rounded-lg border border-stone-700/40 bg-stone-900/50 p-3">
              <p className="text-[10px] font-mono uppercase tracking-wider text-stone-600 mb-2">Notes</p>
              <p className="text-xs text-stone-400 leading-relaxed">{entity.notes}</p>
            </div>
          )}

          {/* Verification warning */}
          {(status === 'Unverified' || status === 'Partially Verified' || status === 'Needs Review') && (
            <div className="rounded-lg border border-amber-800/30 bg-amber-950/20 p-3">
              <p className="text-[10px] font-mono uppercase tracking-wider text-amber-700 mb-1">On-site verification required</p>
              <p className="text-xs text-stone-500 leading-relaxed">
                Data for this location has not been fully verified. Information shown reflects what was visible on the aerial map only.
              </p>
            </div>
          )}
        </div>
      </motion.aside>
    </AnimatePresence>
  )
}
