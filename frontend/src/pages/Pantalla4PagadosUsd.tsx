import { useMemo } from 'react'
import PageHeader from '../components/layout/PageHeader'
import { NAV_ITEMS } from '../config/navigation'
import KpiCard from '../components/cards/KpiCard'
import CertificadosPorPrestamoUsdChart from '../components/charts/CertificadosPorPrestamoUsdChart'
import DetalleCertificadosUsdTable from '../components/tables/DetalleCertificadosUsdTable'
import { useCertificadosMaster } from '../hooks/useAnalyticsQueries'
import { useFilteredCertificados } from '../hooks/useFilteredCertificados'

const money = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })


export default function Pantalla4PagadosUsd() {
  const { data } = useCertificadosMaster()
  const { filteredData } = useFilteredCertificados(data, { scope: 'current_and_pending', paymentStatus: 'paid' })

  const kpis = useMemo(() => {
    let pagado = 0
    let financiado = 0
    let local = 0
    for (const c of filteredData) {
      pagado += c.montoPagadoUsd ?? 0
      financiado += c.montoFinanciadoUsd ?? 0
      local += c.montoLocalUsd ?? 0
    }
    return { pagado, financiado, local }
  }, [filteredData])

  const cards = [
    { label: 'Total Monto Pagado USD', value: money.format(kpis.pagado), accent: 'purple' as const },
    { label: 'Total Monto Financiado USD', value: money.format(kpis.financiado), accent: 'cyan' as const },
    { label: 'Total Monto Local USD', value: money.format(kpis.local), accent: 'magenta' as const },
  ]

  return (
    <section className="space-y-6">
      <PageHeader title={NAV_ITEMS[2].label} showFilterBar={true} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <KpiCard key={c.label} title={c.label} value={c.value} accentColor={c.accent} />
        ))}
      </div>
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <CertificadosPorPrestamoUsdChart data={filteredData} />
      </div>
      <DetalleCertificadosUsdTable data={filteredData} />
    </section>
  )
}
