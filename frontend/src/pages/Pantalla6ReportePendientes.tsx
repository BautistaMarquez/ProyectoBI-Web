import { useMemo } from 'react'
import PageHeader from '../components/layout/PageHeader'
import { NAV_ITEMS } from '../config/navigation'
import KpiCard from '../components/cards/KpiCard'
import ReportePendientesTable from '../components/tables/ReportePendientesTable'
import { useCertificadosMaster } from '../hooks/useAnalyticsQueries'
import { useFilteredCertificados } from '../hooks/useFilteredCertificados'

const money = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })

export default function Pantalla6ReportePendientes() {
  const { data } = useCertificadosMaster()
  const { filteredData } = useFilteredCertificados(data, { scope: 'current_and_pending', paymentStatus: 'pending' })

  const kpis = useMemo(() => {
    let total = 0
    const expedientes = new Set<string>()
    for (const c of filteredData) {
      total += c.montoAPagar ?? 0
      if (c.pagoExpedienteDePago) expedientes.add(c.pagoExpedienteDePago)
    }
    return { total, expedientes: expedientes.size }
  }, [filteredData])

  const cards = [
    { label: 'Total Monto Pendiente', value: money.format(kpis.total), accent: 'cyan' },
    { label: 'Cantidad de Expedientes', value: String(kpis.expedientes), accent: 'magenta' },
  ] as const

  return (
    <section className="space-y-6">
      <PageHeader title={NAV_ITEMS[4].label} showFilterBar={true} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <KpiCard key={c.label} title={c.label} value={c.value} accentColor={c.accent} />
        ))}
      </div>
      <ReportePendientesTable data={filteredData} />
    </section>
  )
}
