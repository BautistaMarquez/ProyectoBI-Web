import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { FilterKey, GlobalFilters } from '../types/filters'

interface FilterContextValue {
  filters: GlobalFilters
  setFilter: (key: FilterKey, value: string | null) => void
  setSearch: (term: string) => void
  resetFilters: () => void
}

const initialFilters: GlobalFilters = {
  prestamo: null,
  direccionResponsable: null,
  anoOp: null,
  mes: null,
  mesPago: null,
  search: '',
}

const FilterContext = createContext<FilterContextValue | null>(null)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<GlobalFilters>(initialFilters)

  const setFilter = useCallback((key: FilterKey, value: string | null) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])
  const setSearch = useCallback((term: string) => {
    setFilters((prev) => ({ ...prev, search: term }))
  }, [])
  const resetFilters = useCallback(() => setFilters(initialFilters), [])

  const value = useMemo(
    () => ({ filters, setFilter, setSearch, resetFilters }),
    [filters, setFilter, setSearch, resetFilters],
  )

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
}

export function useFilters(): FilterContextValue {
  const ctx = useContext(FilterContext)
  if (!ctx) {
    throw new Error('useFilters debe usarse dentro de un FilterProvider')
  }
  return ctx
}
