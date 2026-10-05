import { useMemo } from 'react'
import { useFilters } from '../context/FilterContext'
import type { CertificadoMaster } from '../types/analytics'
import type { FilterOptions, PaymentStatus, TemporalScope } from '../types/filters'

export interface AvailableOptions {
  prestamos: string[]
  direcciones: string[]
  anosOp: string[]
  meses: string[]
  mesesPago: string[]
}

const MESES_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

function pagoYear(value: string | null | undefined): number | null {
  const m = value ? /^(\d{4})/.exec(value) : null
  return m ? Number(m[1]) : null
}

/** Nombre del mes de pago en español, o null si no hay fecha. */
function mesPagoNombre(value: string | null | undefined): string | null {
  const m = value ? /^\d{4}-(\d{2})/.exec(value) : null
  return m ? (MESES_ES[Number(m[1]) - 1] ?? null) : null
}

function inScope(c: CertificadoMaster, scope: TemporalScope): boolean {
  if (scope === 'all') return true
  const y = pagoYear(c.pagoFechaDePago)
  if (scope === '2025') return y === 2025
  return y === 2026 || !c.pagoFechaDePago
}

const FECHA_CORTE = new Date('2025-02-01T00:00:00')

/** Regla de oro: entrada a DAFyMP posterior al corte y saldo a pagar distinto de cero. */
function passesGoldenRule(c: CertificadoMaster): boolean {
  if (!c.entradaADafymp) return false
  const entrada = new Date(c.entradaADafymp)
  if (Number.isNaN(entrada.getTime()) || !(entrada > FECHA_CORTE)) return false
  return c.montoAPagar !== 0 && c.montoAPagar !== null
}

function matchesPayment(c: CertificadoMaster, status: PaymentStatus): boolean {
  if (status === 'all') return true
  const paid = !!c.pagoFechaDePago
  return status === 'paid' ? paid : !paid
}

function uniqueSorted(values: (string | null | undefined)[]): string[] {
  const set = new Set<string>()
  for (const v of values) {
    if (v !== null && v !== undefined && v !== '') set.add(v)
  }
  return [...set].sort((a, b) => a.localeCompare(b, 'es', { numeric: true }))
}

/** Normaliza una fecha ISO ("2025-10-01T00:00:00") a "yyyy-MM". */
export function mesKey(value: string | null | undefined): string | null {
  if (!value) return null
  const m = /^(\d{4})-(\d{2})/.exec(value)
  return m ? `${m[1]}-${m[2]}` : value
}

/** Fecha corta "dd/MM/yyyy" sin componente horario. */
export function formatFechaCorta(value: string | null | undefined): string | null {
  if (!value) return null
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
  return m ? `${m[3]}/${m[2]}/${m[1]}` : value
}

/** Mes corto "MM/yyyy". */
export function formatMes(value: string | null | undefined): string {
  const k = mesKey(value)
  if (!k) return ''
  const m = /^(\d{4})-(\d{2})$/.exec(k)
  return m ? `${m[2]}/${m[1]}` : k
}

const anoOf = (c: CertificadoMaster): string | null => (c.anoOp === null ? null : String(c.anoOp))

export function useFilteredCertificados(data: CertificadoMaster[] | undefined, options: FilterOptions = {}) {
  const { scope = 'current_and_pending', paymentStatus = 'all' } = options
  const { filters } = useFilters()

  return useMemo(() => {
    const all = (data ?? []).filter(
      (c) => (scope === 'all' || passesGoldenRule(c)) && inScope(c, scope) && matchesPayment(c, paymentStatus),
    )
    const { prestamo, direccionResponsable, anoOp, mes, mesPago, search } = filters
    const term = search.trim().toLowerCase()

    const filteredData = all.filter((c) => {
      if (prestamo !== null && c.prestamo !== prestamo) return false
      if (direccionResponsable !== null && c.direccionResponsable !== direccionResponsable) return false
      if (anoOp !== null && anoOf(c) !== anoOp) return false
      if (mes !== null && mesKey(c.mes) !== mes) return false
      if (mesPago !== null && mesPagoNombre(c.pagoFechaDePago) !== mesPago) return false
      if (term) {
        const haystack = `${c.obraOProceso ?? ''} ${c.pagoExpedienteDePago ?? ''}`.toLowerCase()
        if (!haystack.includes(term)) return false
      }
      return true
    })

    const availableOptions: AvailableOptions = {
      prestamos: uniqueSorted(all.map((c) => c.prestamo)),
      direcciones: uniqueSorted(all.map((c) => c.direccionResponsable)),
      anosOp: uniqueSorted(all.map(anoOf)),
      meses: uniqueSorted(all.map((c) => mesKey(c.mes))),
      mesesPago: MESES_ES.filter((n) => all.some((c) => mesPagoNombre(c.pagoFechaDePago) === n)),
    }

    return { filteredData, availableOptions }
  }, [data, filters, scope, paymentStatus])
}
