import { useMemo, useState } from 'react'
import { formatFechaCorta, formatMes } from '../../hooks/useFilteredCertificados'
import type { CertificadoMaster } from '../../types/analytics'
import { groupByExpediente } from '../../utils/groupByExpediente'
import { TableShell } from './TableShell'
import { td, tdC, tdExp, tdNum, tfootCls, th, thC, theadCls, trBody } from './tableStyles'

const PAGE_SIZE = 25

const money = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })

export default function DetallePendientesTable({ data }: { data: CertificadoMaster[] }) {
  const [state, setState] = useState({ page: 0, data })
  // Reinicia la página cuando cambian los datos filtrados.
  if (state.data !== data) setState({ page: 0, data })
  const page = state.data === data ? state.page : 0

  const grouped = useMemo(() => {
    const time = (s: string | null) => (s ? new Date(s).getTime() : NaN)
    return groupByExpediente(data).sort((a, b) => {
      const ta = time(a.first.entradaADafymp)
      const tb = time(b.first.entradaADafymp)
      if (Number.isNaN(ta)) return Number.isNaN(tb) ? 0 : 1
      if (Number.isNaN(tb)) return -1
      return ta - tb
    })
  }, [data])
  const pages = Math.max(1, Math.ceil(grouped.length / PAGE_SIZE))
  const total = useMemo(() => grouped.reduce((acc, g) => acc + g.sumaPorExpediente, 0), [grouped])
  const rows = grouped.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <TableShell page={page} pages={pages} onPage={(p) => setState({ page: p, data })}>
      <thead className={theadCls}>
        <tr>
          <th className={thC}>Entrada a DAFyMP</th>
          <th className={th}>Nro SF</th>
          <th className={th}>Préstamo</th>
          <th className={th}>Dirección Responsable</th>
          <th className={th}>Obra</th>
          <th className={thC}>Monto a Pagar ($)</th>
          <th className={thC}>Mes</th>
          <th className={th}>Expediente de Pago</th>
          <th className={th}>Nombre EE Principal</th>
          <th className={th}>Contratista</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(({ first: c, sumaPorExpediente }, i) => (
          <tr key={`${page}-${i}`} className={trBody}>
            <td className={tdC}>{formatFechaCorta(c.entradaADafymp) ?? '-'}</td>
            <td className={td}>{c.sfNroDeSf ?? '-'}</td>
            <td className={td}>{c.prestamo ?? '-'}</td>
            <td className={td}>{c.direccionResponsable ?? '-'}</td>
            <td className={td}>{c.obraOProceso ?? '-'}</td>
            <td className={tdNum}>{money.format(sumaPorExpediente)}</td>
            <td className={tdC}>{formatMes(c.mes) || '-'}</td>
            <td className={tdExp}>{c.pagoExpedienteDePago ?? '-'}</td>
            <td className={td}>{c.nombreEePrincipal ?? '-'}</td>
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
          <td className={td} colSpan={4} />
        </tr>
      </tfoot>
    </TableShell>
  )
}
