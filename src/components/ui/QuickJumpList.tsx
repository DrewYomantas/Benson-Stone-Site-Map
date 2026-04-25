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
  building: '⬛',
  yard: '◻',
  entrance: '▷',
  door: '·',
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
    <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-380px)] max-md:max-h-[11vh]">
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <motion.button
            key={item.entityId}
            layout
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.15 }}
            onClick={() => onSelect(item.entityId, item.entityType)}
            data-selected={selectedId === item.entityId}
            className="w-full text-left px-3 py-2.5 rounded-lg transition-all duration-150 group
              border border-transparent
              hover:bg-stone-800/60 hover:border-stone-700/50
              data-[selected=true]:bg-amber-900/30 data-[selected=true]:border-amber-700/40"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-stone-500 text-xs shrink-0 font-mono">
                  {TYPE_ICON[item.entityType]}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-stone-200 truncate group-data-[selected=true]:text-amber-200">
                    {item.displayName}
                  </p>
                  <p className="text-[10px] text-stone-500 font-mono uppercase tracking-wide">
                    {TYPE_LABEL[item.entityType]}
                  </p>
                </div>
              </div>
              <div className="shrink-0">
                <StatusBadge status={item.status as VerificationStatus} size="sm" />
              </div>
            </div>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  )
}
