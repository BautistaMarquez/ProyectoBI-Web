import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import FilterBar from './FilterBar'

interface PageHeaderProps {
  title: string
  subtitle?: string
  showFilterBar?: boolean
}

export default function PageHeader({ title, subtitle, showFilterBar = false }: PageHeaderProps) {
  return (
    <header>
      <Link
        to="/"
        className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-cyan"
      >
        <ArrowLeft className="h-4 w-4" /> Volver al Panel
      </Link>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{title}</h1>
      {subtitle && <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
      {showFilterBar && (
        <div className="mt-4">
          <FilterBar />
        </div>
      )}
    </header>
  )
}
