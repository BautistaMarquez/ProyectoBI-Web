export interface GlobalFilters {
  prestamo: string | null
  direccionResponsable: string | null
  anoOp: string | null
  mes: string | null
  mesPago: string | null
  search: string
}

export type FilterKey = keyof Omit<GlobalFilters, 'search'>

export type TemporalScope = 'current_and_pending' | '2025' | 'all'

export type PaymentStatus = 'all' | 'paid' | 'pending'

export interface FilterOptions {
  scope?: TemporalScope
  paymentStatus?: PaymentStatus
}
