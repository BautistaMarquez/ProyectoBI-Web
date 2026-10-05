import { formatFechaCorta } from '../../hooks/useFilteredCertificados'
import type { ObraResumen } from '../../types/analytics'

const ars = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })
const usd = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const pct = new Intl.NumberFormat('es-AR', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 })

/** El avance puede venir como fracción (0.452) o como porcentaje (45.2). */
const formatAvance = (v: number | null) => (v === null ? '-' : pct.format(v > 1 ? v / 100 : v))

export default function FichaObraCard({ obra }: { obra: ObraResumen }) {
  const items: { label: string; value: string }[] = [
    { label: 'Obra', value: obra.obraOProceso ?? '-' },
    { label: 'Nombre Completo', value: obra.nombreCompletoDeLaObra ?? '-' },
    { label: 'Estado de Obra', value: obra.estadoObra ?? obra.estado ?? '-' },
    { label: 'Subestado', value: obra.subestado ?? '-' },
    { label: 'Contratista', value: obra.contratista ?? '-' },
    { label: 'Dirección Responsable', value: obra.direccionResponsable ?? '-' },
    { label: 'Avance de Obra', value: formatAvance(obra.porcentajeAvance) },
    {
      label: 'Monto Contrato Original',
      value: obra.montoContratoOriginal === null ? '-' : ars.format(obra.montoContratoOriginal),
    },
    {
      label: 'Monto Contrato Dolarizado',
      value: obra.montoContratoDolarizado === null ? '-' : usd.format(obra.montoContratoDolarizado),
    },
    {
      label: 'Monto Ejecutado Total',
      value: obra.montoEjecutadoTotal === null ? '-' : ars.format(obra.montoEjecutadoTotal),
    },
    { label: 'Fecha de Inicio', value: formatFechaCorta(obra.inicio) ?? '-' },
    { label: 'Plazo Total', value: obra.totalDiasPlazo === null ? '-' : `${obra.totalDiasPlazo} días` },
    { label: 'Fecha Fin', value: formatFechaCorta(obra.fechaFin) ?? '-' },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => (
        <div key={it.label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase text-slate-500">{it.label}</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{it.value}</p>
        </div>
      ))}
    </div>
  )
}
