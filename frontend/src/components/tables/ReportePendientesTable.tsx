import { Download } from 'lucide-react'
import { useMemo, useState } from 'react'
import { formatMes } from '../../hooks/useFilteredCertificados'
import type { CertificadoMaster } from '../../types/analytics'
import { exportToExcel } from '../../utils/exportExcel'
import { groupByExpediente } from '../../utils/groupByExpediente'
import { TableShell } from './TableShell'
import { td, tdC, tdNum, tbodyCls, tfootCls, th, thC, theadCls, trBody } from './tableStyles'

const PAGE_SIZE = 25

const money = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })

export default function ReportePendientesTable({ data }: { data: CertificadoMaster[] }) {
  const [state, setState] = useState({ page: 0, data })
  // Reinicia la página cuando cambian los datos filtrados.
  if (state.data !== data) setState({ page: 0, data })
  const page = state.data === data ? state.page : 0

  const grouped = useMemo(
    () => groupByExpediente(data).sort((a, b) => (b.first.diasEnTramitacion ?? -1) - (a.first.diasEnTramitacion ?? -1)),
    [data],
  )
  const pages = Math.max(1, Math.ceil(grouped.length / PAGE_SIZE))
  const total = useMemo(() => grouped.reduce((acc, g) => acc + g.sumaPorExpediente, 0), [grouped])
  const rows = grouped.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <TableShell
      page={page}
      pages={pages}
      onPage={(p) => setState({ page: p, data })}
      toolbar={
        <div className="flex justify-end border-b border-slate-200 dark:border-slate-800 px-3 py-2">
          <button
            type="button"
            onClick={() => exportToExcel(data, 'reporte-ee-pendientes-fc')}
            className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
          >
            <Download className="h-4 w-4" />
            Exportar a Excel
          </button>
        </div>
      }
    >
      <thead className={theadCls}>
        <tr>
          <th className={th}>Préstamo</th>
          <th className={th}>Dirección Responsable</th>
          <th className={th}>Nombre EE Principal</th>
          <th className={th}>Nro SF</th>
          <th className={thC}>Mes</th>
          <th className={thC}>Monto Pendiente ($)</th>
          <th className={thC}>Días en Tramitación</th>
          <th className={th}>Contratista</th>
        </tr>
      </thead>
      <tbody className={tbodyCls}>
        {rows.map(({ first: c, sumaPorExpediente }, i) => (
          <tr key={`${page}-${i}`} className={trBody}>
            <td className={td}>{c.prestamo ?? '-'}</td>
            <td className={td}>{c.direccionResponsable ?? '-'}</td>
            <td className={td}>{c.nombreEePrincipal ?? '-'}</td>
            <td className={td}>{c.sfNroDeSf ?? '-'}</td>
            <td className={tdC}>{formatMes(c.mes) || '-'}</td>
            <td className={tdNum}>{money.format(sumaPorExpediente)}</td>
            <td className={tdNum}>{c.diasEnTramitacion ?? '-'}</td>
            <td className={td}>{c.contratista ?? '-'}</td>
          </tr>
        ))}
      </tbody>
      <tfoot className={tfootCls}>
        <tr>
          <td className={td} colSpan={5}>
            Total ({grouped.length} expedientes)
          </td>
          <td className={`${td} text-center tabular-nums`}>{money.format(total)}</td>
          <td className={td} colSpan={2} />
        </tr>
      </tfoot>
    </TableShell>
  )
}
