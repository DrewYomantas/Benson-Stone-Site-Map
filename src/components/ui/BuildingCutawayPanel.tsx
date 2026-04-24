import { motion, AnimatePresence } from 'framer-motion'
import type { Building } from '../../types'

interface Props {
  building: Building
  isOpen: boolean
  onClose: () => void
}

export function BuildingCutawayPanel({ building, isOpen, onClose }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-4 rounded-xl border border-amber-800/30 bg-stone-950/80 overflow-hidden"
        >
          {/* Roof-lift visual */}
          <div className="relative h-28 bg-gradient-to-b from-stone-800/60 to-stone-950/40 overflow-hidden">
            {/* Architectural grid lines */}
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'linear-gradient(#c4a882 1px, transparent 1px), linear-gradient(90deg, #c4a882 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />
            {/* Roof lift animation */}
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: -8 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-stone-600/80 to-transparent border-b border-stone-500/30"
            />

            {/* Center message */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 }}
                className="text-center"
              >
                <div className="text-2xl mb-1">🏗</div>
                <p className="text-xs font-mono text-stone-400 uppercase tracking-widest">
                  Interior not yet mapped
                </p>
              </motion.div>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 w-6 h-6 rounded flex items-center justify-center text-stone-500 hover:text-stone-300 hover:bg-stone-700/50 transition-all"
            >
              ✕
            </button>
          </div>

          <div className="p-4 space-y-3">
            <div className="space-y-1">
              <p className="text-[10px] font-mono uppercase tracking-widest text-amber-600">
                Interior Exploration Mode
              </p>
              <p className="text-sm font-display text-stone-300 italic">
                {building.displayName} — Interior View
              </p>
            </div>

            <div className="rounded-lg border border-stone-700/50 bg-stone-900/50 p-3 space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500/60 mt-1.5 shrink-0" />
                <p className="text-xs text-stone-400 leading-relaxed">
                  Interior sections have not yet been mapped or verified for this building.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-stone-600 mt-1.5 shrink-0" />
                <p className="text-xs text-stone-500 leading-relaxed">
                  Department-level mapping will be added after on-site verification.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-stone-600 mt-1.5 shrink-0" />
                <p className="text-xs text-stone-500 leading-relaxed">
                  Interior zones ({building.interiorZones.length} recorded) — none verified yet.
                </p>
              </div>
            </div>

            <p className="text-[10px] font-mono text-stone-600 uppercase tracking-wider">
              Verification required before interior layout can be shown
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
