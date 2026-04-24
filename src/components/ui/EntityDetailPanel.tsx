import { motion, AnimatePresence } from 'framer-motion'
import { StatusBadge } from './StatusBadge'
import { buildings, yards, entrances, doors } from '../../data/benson'
import type { EntityType } from '../../types'

interface Props {
  entityId: string | null
  entityType: EntityType | null
  exploringInterior: boolean
  onToggleExplore: () => void
  onClose: () => void
}

const TYPE_LABEL: Record<EntityType, string> = {
  building: 'Building',
  yard: 'Outdoor Yard',
  entrance: 'Entrance / Site Point',
  door: 'Door',
}

const TYPE_ACCENT: Record<EntityType, { text: string; border: string; bg: string }> = {
  building: { text: '#c4a050', border: 'rgba(196,160,80,0.25)', bg: 'rgba(196,160,80,0.06)' },
  yard:     { text: '#6aaa50', border: 'rgba(106,170,80,0.25)', bg: 'rgba(106,170,80,0.06)' },
  entrance: { text: '#4a8ab0', border: 'rgba(74,138,176,0.25)', bg: 'rgba(74,138,176,0.06)' },
  door:     { text: '#8a8880', border: 'rgba(138,136,128,0.25)', bg: 'rgba(138,136,128,0.06)' },
}

function SectionDivider() {
  return <div style={{ height: 1, background: 'rgba(196,184,152,0.07)', margin: '4px 0' }} />
}

function Row({ label, value }: { label: string; value: string | null | boolean }) {
  const display =
    value === null || value === undefined
      ? '—'
      : value === true
        ? 'Yes'
        : value === false
          ? 'No'
          : String(value)
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, padding: '7px 0', borderBottom: '1px solid rgba(196,184,152,0.06)' }}>
      <span style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.07em', color: '#5a5040', flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ fontSize: 11, color: '#c8b898', textAlign: 'right', lineHeight: 1.5, fontFamily: 'DM Mono, monospace' }}>
        {display}
      </span>
    </div>
  )
}

function RelatedPill({ label, type }: { label: string; type: EntityType }) {
  const colors: Record<EntityType, { bg: string; text: string; border: string }> = {
    building: { bg: 'rgba(196,160,80,0.1)',  text: '#c4a050', border: 'rgba(196,160,80,0.2)' },
    yard:     { bg: 'rgba(106,170,80,0.1)',  text: '#6aaa50', border: 'rgba(106,170,80,0.2)' },
    entrance: { bg: 'rgba(74,138,176,0.1)', text: '#4a8ab0', border: 'rgba(74,138,176,0.2)' },
    door:     { bg: 'rgba(138,136,128,0.1)',text: '#8a8880', border: 'rgba(138,136,128,0.2)'},
  }
  const c = colors[type]
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: 4,
      fontSize: 10,
      fontFamily: 'DM Mono, monospace',
      background: c.bg,
      color: c.text,
      border: `1px solid ${c.border}`,
    }}>
      {label}
    </span>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 9, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#4a3f30', marginBottom: 8, marginTop: 4 }}>
      {children}
    </p>
  )
}

export function EntityDetailPanel({ entityId, entityType, exploringInterior, onToggleExplore, onClose }: Props) {
  const building = entityType === 'building' ? buildings.find((b) => b.id === entityId) : null
  const yard     = entityType === 'yard'     ? yards.find((y) => y.id === entityId)     : null
  const entrance = entityType === 'entrance' ? entrances.find((e) => e.id === entityId) : null
  const door     = entityType === 'door'     ? doors.find((d) => d.id === entityId)     : null

  const entity = building || yard || entrance || door
  if (!entity || !entityType) return null

  const accent = TYPE_ACCENT[entityType]

  return (
    <AnimatePresence mode="wait">
      <motion.aside
        key={entityId}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          width: 300,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          borderLeft: '1px solid rgba(196,184,152,0.08)',
          background: 'rgba(20,18,14,0.96)',
          overflowY: 'auto',
        }}
      >
        {/* ── Colored type stripe ────────────────────────────── */}
        <div style={{ height: 3, background: accent.border, flexShrink: 0 }} />

        <div style={{ padding: '18px 18px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* ── Header ───────────────────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 9, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', color: accent.text, marginBottom: 5 }}>
                {TYPE_LABEL[entityType]}
              </p>
              <h2 style={{ fontSize: 20, fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, color: '#e8dcc8', lineHeight: 1.2, marginBottom: 8 }}>
                {entity.displayName}
              </h2>
              <StatusBadge status={entity.status} />
            </div>
            <button
              onClick={onClose}
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                border: '1px solid rgba(196,184,152,0.12)',
                background: 'transparent',
                color: '#5a4f3a',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                flexShrink: 0,
                marginTop: 2,
              }}
            >
              ✕
            </button>
          </div>

          <SectionDivider />

          {/* ── Building-specific ─────────────────────────────── */}
          {building && (
            <div>
              <Row label="ID" value={building.id} />
              <Row label="Public facing" value={building.publicFacing} />
              <Row label="Primary use" value={building.primaryUse} />
              <Row label="Interior map" value={building.hasInteriorMap ? 'Available' : 'Not yet mapped'} />
              <Row label="Verified by" value={building.verifiedBy} />
              <Row label="Verified on" value={building.verifiedOn} />

              {building.relatedYardIds.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  <SectionLabel>Related yards</SectionLabel>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {building.relatedYardIds.map((id) => {
                      const y = yards.find((yrd) => yrd.id === id)
                      return y ? <RelatedPill key={id} label={y.displayName} type="yard" /> : null
                    })}
                  </div>
                </div>
              )}

              {building.relatedDoorIds.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  <SectionLabel>Associated doors</SectionLabel>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {building.relatedDoorIds.map((id) => {
                      const d = doors.find((dr) => dr.id === id)
                      return d ? <RelatedPill key={id} label={`Door ${d.number}`} type="door" /> : null
                    })}
                  </div>
                </div>
              )}

              <SectionDivider />

              {/* ── Explore Interior button ────────────────────── */}
              <button
                onClick={onToggleExplore}
                style={{
                  width: '100%',
                  marginTop: 10,
                  padding: '11px 0',
                  borderRadius: 8,
                  border: `1px solid ${exploringInterior ? 'rgba(196,160,80,0.55)' : 'rgba(196,160,80,0.22)'}`,
                  background: exploringInterior ? 'rgba(196,160,80,0.16)' : 'rgba(196,160,80,0.05)',
                  color: exploringInterior ? '#c4a050' : '#8a7040',
                  fontSize: 11,
                  fontFamily: 'DM Mono, monospace',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'all 0.18s',
                }}
              >
                <span style={{ fontSize: 13 }}>{exploringInterior ? '▲' : '▼'}</span>
                {exploringInterior ? 'Close interior view' : 'Explore building interior'}
              </button>

              {/* ── Interior status panel ──────────────────────── */}
              <AnimatePresence>
                {exploringInterior && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.28 }}
                    style={{ overflow: 'hidden', marginTop: 8 }}
                  >
                    <div style={{
                      borderRadius: 8,
                      border: '1px solid rgba(196,160,80,0.18)',
                      background: 'rgba(196,160,80,0.05)',
                      padding: '12px 13px',
                    }}>
                      <p style={{ fontSize: 9, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#c4a050', marginBottom: 10 }}>
                        Interior Exploration Mode
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                        {[
                          { dot: '#c4a050', text: 'Roof lifted — interior shell visible in the 3D view.' },
                          { dot: '#5a5040', text: 'Interior sections have not been mapped or verified for this building.' },
                          { dot: '#5a5040', text: 'Department-level mapping will be added after on-site verification.' },
                        ].map((item, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: item.dot, marginTop: 3, flexShrink: 0 }} />
                            <p style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', color: i === 0 ? '#9a8860' : '#504030', lineHeight: 1.5 }}>
                              {item.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* ── Yard-specific ─────────────────────────────────── */}
          {yard && (
            <div>
              <Row label="ID" value={yard.id} />
              <Row label="Primary use" value={yard.primaryUse} />
              <Row label="Access notes" value={yard.accessNotes} />
              <Row label="Weather exposure" value={yard.weatherNotes} />
              <Row label="Verified by" value={yard.verifiedBy} />
              <Row label="Verified on" value={yard.verifiedOn} />

              {yard.relatedBuildingIds.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  <SectionLabel>Adjacent buildings</SectionLabel>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {yard.relatedBuildingIds.map((id) => {
                      const b = buildings.find((bl) => bl.id === id)
                      return b ? <RelatedPill key={id} label={b.displayName} type="building" /> : null
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Entrance-specific ─────────────────────────────── */}
          {entrance && (
            <div>
              <Row label="ID" value={entrance.id} />
              <Row label="Type" value={entrance.type} />
              <Row label="Customer facing" value={entrance.customerFacing} />
              <Row
                label="Related building"
                value={entrance.relatedBuildingId
                  ? buildings.find((b) => b.id === entrance.relatedBuildingId)?.displayName ?? entrance.relatedBuildingId
                  : null}
              />
              <Row
                label="Related yard"
                value={entrance.relatedYardId
                  ? yards.find((y) => y.id === entrance.relatedYardId)?.displayName ?? entrance.relatedYardId
                  : null}
              />
              <Row label="Related door" value={entrance.relatedDoorId} />
            </div>
          )}

          {/* ── Door-specific ─────────────────────────────────── */}
          {door && (
            <div>
              <Row label="Door number" value={door.number} />
              <Row label="ID" value={door.id} />
              <Row label="Door type" value={door.doorType} />
              <Row label="Use description" value={door.useDescription} />
              <Row label="Public access" value={door.publicAccess} />
              <Row label="Restricted" value={door.restrictedAccess} />
              <Row label="Entrance label" value={door.entranceLabel} />
              <Row
                label="Building"
                value={door.buildingId
                  ? buildings.find((b) => b.id === door.buildingId)?.displayName ?? door.buildingId
                  : null}
              />
              <Row label="Verified by" value={door.verifiedBy} />
              <Row label="Verified on" value={door.verifiedOn} />
            </div>
          )}

          {/* ── Notes ────────────────────────────────────────────── */}
          {entity.notes && (
            <>
              <SectionDivider />
              <div style={{ borderRadius: 8, border: '1px solid rgba(196,184,152,0.1)', background: 'rgba(196,184,152,0.03)', padding: '11px 13px' }}>
                <SectionLabel>Notes</SectionLabel>
                <p style={{ fontSize: 11, fontFamily: 'DM Mono, monospace', color: '#7a6e58', lineHeight: 1.6 }}>
                  {entity.notes}
                </p>
              </div>
            </>
          )}

          {/* ── Verification warning ──────────────────────────────── */}
          {(entity.status === 'Unverified' || entity.status === 'Partially Verified' || entity.status === 'Needs Review') && (
            <div style={{ borderRadius: 8, border: '1px solid rgba(196,120,40,0.2)', background: 'rgba(196,120,40,0.04)', padding: '11px 13px' }}>
              <p style={{ fontSize: 9, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8a5a20', marginBottom: 6 }}>
                On-site verification required
              </p>
              <p style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', color: '#4a3820', lineHeight: 1.6 }}>
                Data reflects aerial map observation only. On-site verification has not been completed.
              </p>
            </div>
          )}
        </div>
      </motion.aside>
    </AnimatePresence>
  )
}
