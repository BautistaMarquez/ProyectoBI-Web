import { useMemo, useState } from 'react'
import { formatFechaCorta, formatMes } from '../../hooks/useFilteredCertificados'
import type { CertificadoMaster } from '../../types/analytics'
import { groupByExpediente } from '../../utils/groupByExpediente'
import { TableShell } from './TableShell'
import { td, tdC, tdExp, tdNum, tfootCls, th, thC, theadCls, trBody } from './tableStyles'

const PAGE_SIZE = 25

const money = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })

const usd = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export default function DetalleCertificadosUsdTable({ data }: { data: CertificadoMaster[] }) {
  const [state, setState] = useState({ page: 0, data })
  // Reinicia la página cuando cambian los datos filtrados.
  if (state.data !== data) setState({ page: 0, data })
  const page = state.data === data ? state.page : 0

  const grouped = useMemo(() => groupByExpediente(data).sort((a, b) => b.pagadoUsd - a.pagadoUsd), [data])
  const pages = Math.max(1, Math.ceil(grouped.length / PAGE_SIZE))
  const totals = useMemo(
    () =>
      grouped.reduce(
        (acc, g) => ({ aPagar: acc.aPagar + g.sumaPorExpediente, pagado: acc.pagado + g.pagadoUsd }),
        { aPagar: 0, pagado: 0 },
      ),
    [grouped],
  )
  const rows = grouped.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <TableShell page={page} pages={pages} onPage={(p) => setState({ page: p, data })}>
      <thead className={theadCls}>
        <tr>
          <th className={th}>Préstamo</th>
          <th className={th}>Obra</th>
          <th className={thC}>Mes</th>
          <th className={th}>Expediente de Pago</th>
          <th className={thC}>Monto Pagado ($)</th>
          <th className={thC}>Monto Pagado (USD)</th>
          <th className={thC}>Fecha de Pago</th>
          <th className={th}>Nombre EE Principal</th>
          <th className={th}>Contratista</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(({ first: c, sumaPorExpediente, pagadoUsd }, i) => (
          <tr key={`${page}-${i}`} className={trBody}>
            <td className={td}>{c.prestamo ?? '-'}</td>
            <td className={td}>{c.obraOProceso ?? '-'}</td>
            <td className={tdC}>{formatMes(c.mes) || '-'}</td>
            <td className={tdExp}>{c.pagoExpedienteDePago ?? '-'}</td>
            <td className={tdNum}>{money.format(sumaPorExpediente)}</td>
            <td className={tdNum}>{usd.format(pagadoUsd)}</td>
            <td className={tdC}>{formatFechaCorta(c.pagoFechaDePago) ?? 'Pendiente'}</td>
            <td className={td}>{c.nombreEePrincipal ?? '-'}</td>
            <td className={td}>{c.contratista ?? '-'}</td>
          </tr>
        ))}
      </tbody>
      <tfoot className={tfootCls}>
        <tr>
          <td className={td} colSpan={4}>
            Total ({grouped.length} expedientes)
          </td>
          <td className={`${td} text-center tabular-nums`}>{money.format(totals.aPagar)}</td>
          <td className={`${td} text-center tabular-nums`}>{usd.format(totals.pagado)}</td>
          <td className={td} colSpan={3} />
        </tr>
      </tfoot>
    </TableShell>
  )
}
