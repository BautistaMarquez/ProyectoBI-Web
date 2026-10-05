import { useMemo } from 'react'
import PageHeader from '../components/layout/PageHeader'
import { NAV_ITEMS } from '../config/navigation'
import KpiCard from '../components/cards/KpiCard'
import PendientesPorDireccionChart from '../components/charts/PendientesPorDireccionChart'
import DetallePendientesTable from '../components/tables/DetallePendientesTable'
import { useCertificadosMaster } from '../hooks/useAnalyticsQueries'
import { useFilteredCertificados } from '../hooks/useFilteredCertificados'

const money = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })


export default function Pantalla5PendientesFc() {
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
    { label: 'Total Monto Pendiente', value: money.format(kpis.total), accent: 'purple' as const },
    { label: 'Expedientes en Trámite', value: String(kpis.expedientes), accent: 'cyan' as const },
  ]

  return (
    <section className="space-y-6">
      <PageHeader title={NAV_ITEMS[3].label} showFilterBar={true} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <KpiCard key={c.label} title={c.label} value={c.value} accentColor={c.accent} />
        ))}
      </div>
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <PendientesPorDireccionChart data={filteredData} />
      </div>
      <DetallePendientesTable data={filteredData} />
    </section>
  )
}
