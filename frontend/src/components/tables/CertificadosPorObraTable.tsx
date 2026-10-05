import { useMemo, useState } from 'react'
import { formatFechaCorta, formatMes } from '../../hooks/useFilteredCertificados'
import type { CertificadoMaster, ObraResumen } from '../../types/analytics'

const PAGE_SIZE = 25

const money = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })

const th = 'whitespace-nowrap px-3 py-2 text-left text-xs font-semibold uppercase text-slate-600'
const td = 'px-3 py-2 text-sm text-slate-700'

const facturado = (c: CertificadoMaster) => c.sumaPorExpediente ?? c.montoAPagar ?? 0

interface Props {
  data: CertificadoMaster[]
  obra: ObraResumen
}

export default function CertificadosPorObraTable({ data, obra }: Props) {
  const obraRows = useMemo(
    () =>
      data.filter(
        (c) =>
          (obra.nombreId !== null && c.nombreId === obra.nombreId) ||
          (obra.obraOProceso !== null && c.obraOProceso === obra.obraOProceso),
      ),
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
    <div className="rounded-md border border-slate-200 bg-white">
      <div className="max-h-[32rem] overflow-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="sticky top-0 bg-slate-100">
            <tr>
              <th className={th}>Certificado</th>
              <th className={th}>Mes</th>
              <th className={`${th} text-right`}>Plazo en días</th>
              <th className={th}>Fecha de Pago</th>
              <th className={`${th} text-right`}>Monto Facturado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((c, i) => (
              <tr key={`${page}-${i}`}>
                <td className={td}>{c.certOAjOInforme ?? '-'}</td>
                <td className={td}>{formatMes(c.mes) || '-'}</td>
                <td className={`${td} text-right tabular-nums`}>{c.plazoEnDias ?? c.diasTramitacion ?? '-'}</td>
                <td className={td}>
                  {formatFechaCorta(c.pagoFechaDePago) ?? (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                      En trámite
                    </span>
                  )}
                </td>
                <td className={`${td} text-right tabular-nums`}>{money.format(facturado(c))}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="sticky bottom-0 bg-slate-100 font-semibold">
            <tr>
              <td className={td} colSpan={4}>
                Total ({obraRows.length} certificados)
              </td>
              <td className={`${td} text-right tabular-nums`}>{money.format(total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-slate-200 px-3 py-2 text-sm text-slate-600">
        <span>
          Página {page + 1} de {pages}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={page === 0}
            onClick={() => goTo(page - 1)}
            className="rounded-md border border-slate-300 px-3 py-1 hover:bg-slate-50 disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            type="button"
            disabled={page >= pages - 1}
            onClick={() => goTo(page + 1)}
            className="rounded-md border border-slate-300 px-3 py-1 hover:bg-slate-50 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  )
}
