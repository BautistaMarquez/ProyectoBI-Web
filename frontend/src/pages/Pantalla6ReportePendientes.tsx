import { useMemo } from 'react'
import PageHeader from '../components/layout/PageHeader'
import { NAV_ITEMS } from '../config/navigation'
import KpiCard from '../components/cards/KpiCard'
import ReportePendientesTable from '../components/tables/ReportePendientesTable'
import { useCertificadosMaster } from '../hooks/useAnalyticsQueries'
import { useFilteredCertificados } from '../hooks/useFilteredCertificados'

const money = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })
const days = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 1 })

const accents = ['cyan', 'purple', 'magenta', 'slate'] as const

export default function Pantalla6ReportePendientes() {
  const { data } = useCertificadosMaster()
  const { filteredData } = useFilteredCertificados(data, { scope: 'current_and_pending', paymentStatus: 'pending' })

  const kpis = useMemo(() => {
    let total = 0
    let diasSum = 0
    let diasCount = 0
    const expedientes = new Set<string>()
    for (const c of filteredData) {
      total += c.montoAPagar ?? 0
      if (c.pagoExpedienteDePago) expedientes.add(c.pagoExpedienteDePago)
      if (c.diasEnTramitacion !== null && c.diasEnTramitacion > 0) {
        diasSum += c.diasEnTramitacion
        diasCount++
      }
    }
    return { total, expedientes: expedientes.size, dias: diasCount ? diasSum / diasCount : 0 }
  }, [filteredData])

  const cards = [
    { label: 'Total Monto Pendiente', value: money.format(kpis.total) },
    { label: 'Cantidad de Expedientes', value: String(kpis.expedientes) },
    { label: 'Promedio Días en Trámite', value: `${days.format(kpis.dias)} días` },
  ]

  return (
    <section className="space-y-6">
      <PageHeader title={NAV_ITEMS[4].label} showFilterBar={true} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((c, i) => (
          <KpiCard key={c.label} title={c.label} value={c.value} accentColor={accents[i % accents.length]} />
        ))}
      </div>
      <ReportePendientesTable data={filteredData} />
    </section>
  )
}
