import type { VerificationStatus } from '../../types'

const CONFIG: Record<VerificationStatus, { label: string; cls: string; dot: string }> = {
  'Verified': {
    label: 'Verified',
    cls: 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/50',
    dot: 'bg-emerald-400',
  },
  'Partially Verified': {
    label: 'Partially Verified',
    cls: 'bg-amber-900/40 text-amber-300 border border-amber-700/50',
    dot: 'bg-amber-400',
  },
  'Unverified': {
    label: 'Unverified',
    cls: 'bg-slate-800/60 text-slate-400 border border-slate-600/40',
    dot: 'bg-slate-500',
  },
  'Needs Review': {
    label: 'Needs Review',
    cls: 'bg-red-900/40 text-red-300 border border-red-700/50',
    dot: 'bg-red-400',
  },
}

interface Props {
  status: VerificationStatus
  size?: 'sm' | 'md'
}

export function StatusBadge({ status, size = 'md' }: Props) {
  const { label, cls, dot } = CONFIG[status]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-mono font-medium tracking-wide ${size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'} ${cls}`}>
      <span className={`rounded-full shrink-0 ${size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'} ${dot}`} />
      {label}
    </span>
  )
}
