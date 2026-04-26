import { motion, AnimatePresence } from 'framer-motion'
import type { SearchResult } from '../../lib/search'
import { StatusBadge } from './StatusBadge'
import type { VerificationStatus, EntityType } from '../../types'

interface Props {
  items: SearchResult[]
  selectedId: string | null
  onSelect: (id: string, type: EntityType) => void
}

const TYPE_ICON: Record<EntityType, string> = {
  building: 'B',
  yard: 'Y',
  entrance: 'E',
  door: 'D',
}

const TYPE_LABEL: Record<EntityType, string> = {
  building: 'Building',
  yard: 'Yard',
  entrance: 'Entrance',
  door: 'Door',
}

export function QuickJumpList({ items, selectedId, onSelect }: Props) {
  if (items.length === 0) return null

  return (
    <div className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-620px)] max-md:max-h-[10vh]">
      <AnimatePresence mode="popLayout">
        {items.map((item) => {
          const selected = selectedId === item.entityId
          return (
            <motion.button
              key={item.entityId}
              layout
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              onClick={() => onSelect(item.entityId, item.entityType)}
              className="w-full text-left px-3 py-2.5 rounded-xl transition-all duration-150 group"
              style={{
                background: selected ? 'rgba(123,63,34,0.95)' : 'rgba(255,255,255,0.28)',
                border: `1px solid ${selected ? 'rgba(211,167,90,0.85)' : 'rgba(122,82,48,0.12)'}`,
                color: selected ? '#fff8ed' : '#2d2117',
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="text-[10px] shrink-0 font-mono rounded-full h-5 w-5 grid place-items-center"
                    style={{
                      color: selected ? '#7b3f22' : '#765434',
                      background: selected ? '#f3dcae' : 'rgba(255,255,255,0.48)',
                    }}
                  >
                    {TYPE_ICON[item.entityType]}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">
                      {item.displayName}
                    </p>
                    <p className="text-[10px] font-mono uppercase tracking-wide opacity-70">
                      {TYPE_LABEL[item.entityType]}
                    </p>
                  </div>
                </div>
                <div className="shrink-0">
                  <StatusBadge status={item.status as VerificationStatus} size="sm" />
                </div>
              </div>
            </motion.button>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
