type AccentColor = 'magenta' | 'cyan' | 'purple' | 'slate'

interface KpiCardProps {
  title: string
  value: string | number
  subtitle?: string
  accentColor?: AccentColor
  isLoading?: boolean
}

const ACCENT_BG: Record<AccentColor, string> = {
  magenta: 'bg-magenta',
  cyan: 'bg-cyan',
  purple: 'bg-purple',
  slate: 'bg-slate-500',
}

export default function KpiCard({ title, value, subtitle, accentColor = 'cyan', isLoading = false }: KpiCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
      <div className={`absolute left-0 top-0 h-1 w-full ${ACCENT_BG[accentColor]}`} />
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
      {isLoading ? (
        <div className="mt-2 h-8 w-32 animate-pulse rounded bg-slate-800" />
      ) : (
        <p className="mt-2 text-2xl font-bold tabular-nums text-slate-100">{value}</p>
      )}
      {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
    </div>
  )
}
