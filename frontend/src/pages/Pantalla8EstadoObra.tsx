import { useMemo, useState } from 'react'
import PageHeader from '../components/layout/PageHeader'
import { NAV_ITEMS } from '../config/navigation'
import { useCertificadosMaster, useObrasResumen } from '../hooks/useAnalyticsQueries'
import { formatFechaCorta, formatMes, useFilteredCertificados } from '../hooks/useFilteredCertificados'
import type { CertificadoMaster, ObraResumen } from '../types/analytics'

const PAGE_SIZE = 25

const ars = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })
const pct = new Intl.NumberFormat('es-AR', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 })

const obraLabel = (o: ObraResumen) => o.obraOProceso ?? o.nombreCompletoDeLaObra ?? o.nombreId ?? 'Sin nombre'
const obraKey = (o: ObraResumen) => o.nombreId ?? obraLabel(o)

/** El avance puede venir como fracción (0.452) o como porcentaje (45.2). */
const formatAvance = (v: number | null) => (v === null ? '-' : pct.format(v > 1 ? v / 100 : v))

const facturado = (c: CertificadoMaster) => c.sumaPorExpediente ?? c.montoAPagar ?? 0

const th = 'whitespace-nowrap px-3 py-2 text-center text-xs font-semibold uppercase text-slate-600 dark:text-slate-300'
const td = 'px-3 py-2 text-center text-sm text-slate-700 dark:text-slate-300'

function ObrasLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="flex flex-col items-center justify-center gap-8 py-24"
    >
      <div className="relative flex h-24 w-24 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-cyan/20" />
        <span className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-800" />
        <span className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-cyan border-r-purple [animation-duration:1.2s]" />
        <span className="absolute inset-3 animate-spin rounded-full border-4 border-transparent border-b-magenta [animation-direction:reverse] [animation-duration:1.8s]" />
        <span className="h-3 w-3 animate-pulse rounded-full bg-gradient-to-br from-cyan to-magenta" />
      </div>
      <div className="flex flex-col items-center gap-3">
        <p className="text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-300">Obteniendo obras</p>
        <div className="flex items-end gap-1.5" aria-hidden="true">
          {['bg-cyan', 'bg-purple', 'bg-magenta'].map((tone, i) => (
            <span
              key={tone}
              className={`h-2 w-2 animate-bounce rounded-full ${tone}`}
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function FichaObra({ obra }: { obra: ObraResumen }) {
  const items: { label: string; value: string }[] = [
    { label: 'Obra', value: obra.obraOProceso ?? '-' },
    { label: 'Nombre Completo', value: obra.nombreCompletoDeLaObra ?? '-' },
    { label: 'Estado de Obra', value: obra.subestado ?? '-' },
    { label: 'Contratista', value: obra.contratista ?? '-' },
    { label: 'Dirección Responsable', value: obra.direccionResponsable ?? '-' },
    { label: 'Avance de Obra', value: formatAvance(obra.porcentajeAvance) },
    {
      label: 'Monto Contrato Original',
      value: obra.montoContratoOriginal === null ? '-' : ars.format(obra.montoContratoOriginal),
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
    <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((it) => (
          <div
            key={it.label}
            className="rounded-lg border border-slate-200 bg-slate-50 p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800/60"
          >
            <p className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">{it.label}</p>
            <p className="mt-1 break-words text-base font-semibold text-slate-900 dark:text-slate-100">{it.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function CertificadosTabla({ data, obra }: { data: CertificadoMaster[]; obra: ObraResumen }) {
  const obraRows = useMemo(
    () =>
      data
        .filter(
          (c) =>
            (obra.nombreId !== null && c.nombreId === obra.nombreId) ||
            (obra.obraOProceso !== null && c.obraOProceso === obra.obraOProceso),
        )
        // En trámite (sin fecha de pago) primero; luego fecha de pago descendente.
        .sort((a, b) => {
          const fa = a.pagoFechaDePago
          const fb = b.pagoFechaDePago
          if (!fa && !fb) return 0
          if (!fa) return -1
          if (!fb) return 1
          return fb.localeCompare(fa)
        }),
    [data, obra],
  )

  const [state, setState] = useState({ page: 0, rows: obraRows })
  // Reinicia la página cuando cambia la obra o los datos.
  if (state.rows !== obraRows) setState({ page: 0, rows: obraRows })
  const page = state.rows === obraRows ? state.page : 0

  const pages = Math.max(1, Math.ceil(obraRows.length / PAGE_SIZE))
  const total = useMemo(() => obraRows.reduce((acc, c) => acc + facturado(c), 0), [obraRows])
  const rows = obraRows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const goTo = (p: number) => setState({ page: p, rows: obraRows })

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="max-h-[40rem] overflow-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
          <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800">
            <tr>
              <th className={th}>Certificado</th>
              <th className={th}>Mes</th>
              <th className={th}>Fecha de Pago</th>
              <th className={th}>Monto Facturado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.map((c, i) => (
              <tr key={`${page}-${i}`}>
                <td className={td}>{c.certOAjOInforme ?? '-'}</td>
                <td className={td}>{formatMes(c.mes) || '-'}</td>
                <td className={td}>
                  {formatFechaCorta(c.pagoFechaDePago) ?? (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                      En trámite
                    </span>
                  )}
                </td>
                <td className={`${td} tabular-nums`}>{ars.format(facturado(c))}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="sticky bottom-0 bg-slate-100 font-semibold dark:bg-slate-800">
            <tr>
              <td className={td} colSpan={3}>
                Total ({obraRows.length} certificados)
              </td>
              <td className={`${td} tabular-nums`}>{ars.format(total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-slate-200 px-3 py-2 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
        <span>
          Página {page + 1} de {pages}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={page === 0}
            onClick={() => goTo(page - 1)}
            className="rounded-md border border-slate-300 px-3 py-1 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            Anterior
          </button>
          <button
            type="button"
            disabled={page >= pages - 1}
            onClick={() => goTo(page + 1)}
            className="rounded-md border border-slate-300 px-3 py-1 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Pantalla8EstadoObra() {
  const { data: obrasData, isLoading: loadingObras } = useObrasResumen()
  const { data: master, isLoading: loadingMaster } = useCertificadosMaster()
  const { filteredData } = useFilteredCertificados(master, { scope: 'all' })

  const obras = useMemo(
    () => [...(obrasData ?? [])].sort((a, b) => obraLabel(a).localeCompare(obraLabel(b), 'es', { numeric: true })),
    [obrasData],
  )

  const [selectedObraId, setSelectedObraId] = useState<string | null>(null)
  // Por defecto, el primer registro disponible.
  const selectedObra = obras.find((o) => obraKey(o) === selectedObraId) ?? obras[0]

  return (
    <section className="space-y-6">
      <PageHeader title={NAV_ITEMS[6].label} showFilterBar={false} />
      {loadingObras || loadingMaster ? (
        <ObrasLoader />
      ) : (
        <>
          <div className="max-w-md">
            <select
              value={selectedObra ? obraKey(selectedObra) : ''}
              onChange={(e) => setSelectedObraId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-cyan focus:outline-none focus:ring-2 focus:ring-cyan/30 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
              aria-label="Obra"
            >
              {obras.map((o) => (
                <option key={obraKey(o)} value={obraKey(o)}>
                  {obraLabel(o)}
                </option>
              ))}
            </select>
          </div>
          {selectedObra ? (
            <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
              <FichaObra obra={selectedObra} />
              <CertificadosTabla data={filteredData} obra={selectedObra} />
            </div>
          ) : (
            <p className="text-sm text-slate-500">No hay obras disponibles.</p>
          )}
        </>
      )}
    </section>
  )
}
