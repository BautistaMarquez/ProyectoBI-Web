import { ChevronDown, Filter, Search, X } from 'lucide-react'
import { useState } from 'react'
import { useFilters } from '../../context/FilterContext'
import { formatMes, useFilteredCertificados } from '../../hooks/useFilteredCertificados'
import type { FilterKey } from '../../types/filters'
import { useCertificadosMaster } from '../../hooks/useAnalyticsQueries'


const selectClass =
  'w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-md px-3 py-2 pr-9 text-xs font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none bg-none cursor-pointer transition-all'

const optionClass = 'bg-white text-slate-800 dark:bg-slate-800 dark:text-slate-100'

const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400'

export default function FilterBar() {
  const { data: masterData } = useCertificadosMaster()
  const { filters, setFilter, setSearch, resetFilters } = useFilters()
  const { availableOptions } = useFilteredCertificados(masterData, { scope: 'current_and_pending' })
  const [isCollapsed, setIsCollapsed] = useState(false)

  const activeCount = [
    filters.prestamo,
    filters.direccionResponsable,
    filters.anoOp,
    filters.mes,
    filters.mesPago,
    filters.search !== '' ? filters.search : null,
  ].filter((v) => v !== null).length
  const hasActiveFilters = activeCount > 0

  const selects: { key: FilterKey; label: string; options: string[] }[] = [
    { key: 'prestamo', label: 'Préstamo', options: availableOptions.prestamos },
    { key: 'direccionResponsable', label: 'Dirección Responsable', options: availableOptions.direcciones },
    { key: 'anoOp', label: 'Año OP', options: availableOptions.anosOp },
    { key: 'mes', label: 'Mes', options: availableOptions.meses },
    { key: 'mesPago', label: 'Mes de Pago', options: availableOptions.mesesPago },
  ]

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <Filter className="h-4 w-4 text-cyan" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Filtros de Datos</h2>
        {hasActiveFilters && (
          <span className="rounded-full border border-cyan/30 bg-cyan/10 px-2 py-0.5 text-xs font-semibold text-cyan">
            {activeCount} {activeCount === 1 ? 'activo' : 'activos'}
          </span>
        )}
        <div className="ml-auto flex items-center gap-2">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 transition-colors hover:bg-magenta/10 hover:text-magenta dark:text-slate-400"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              Limpiar Filtros
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsCollapsed((c) => !c)}
            aria-expanded={!isCollapsed}
            aria-label={isCollapsed ? 'Expandir filtros' : 'Colapsar filtros'}
            className="rounded-lg p-1 text-slate-500 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`}
            />
          </button>
        </div>
      </div>
      {!isCollapsed && (
        <div className="grid grid-cols-1 gap-4 pt-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {selects.map(({ key, label, options }) => (
            <label key={key} className="block">
              <span className={labelClass}>{label}</span>
              <span className="relative block">
              <select
                className={selectClass}
                value={filters[key] ?? ''}
                onChange={(e) => setFilter(key, e.target.value === '' ? null : e.target.value)}
              >
                <option className={optionClass} value="">Todos</option>
                {options.map((o) => (
                  <option key={o} value={o} className={optionClass}>
                    {key === 'mes' ? formatMes(o) : o}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </span>
              </span>
            </label>
          ))}
          <label className="block">
            <span className={labelClass}>Búsqueda</span>
            <span className="relative block">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Obra o expediente"
                className={`${selectClass} pr-3 pl-8`}
              />
            </span>
          </label>
        </div>
      )}
    </div>
  )
}
