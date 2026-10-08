import { useMemo } from 'react'
import PageHeader from '../components/layout/PageHeader'
import { NAV_ITEMS } from '../config/navigation'
import KpiCard from '../components/cards/KpiCard'
import CertificadosPorPrestamoChart from '../components/charts/CertificadosPorPrestamoChart'
import DetalleCertificadosTable from '../components/tables/DetalleCertificadosTable'
import { useCertificadosMaster } from '../hooks/useAnalyticsQueries'
import { useFilteredCertificados } from '../hooks/useFilteredCertificados'

const money = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })
const days = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 1 })


export default function Pantalla2Devengados() {
  const { data } = useCertificadosMaster()
  const { filteredData } = useFilteredCertificados(data, { scope: 'current_and_pending' })

  const kpis = useMemo(() => {
    let base = 0
    let redet = 0
    let diasSum = 0
    let diasCount = 0
    for (const c of filteredData) {
      const monto = c.montoCertificado ?? 0
      if (c.tipoDeCertificadoPago === 0 || c.tipoDeCertificadoPago === 1) base += monto
      else redet += monto
      if (c.diasTramitacion !== null && c.diasTramitacion > 0) {
        diasSum += c.diasTramitacion
        diasCount++
      }
    }
    return { base, redet, total: base + redet, plazo: diasCount ? diasSum / diasCount : 0 }
  }, [filteredData])

  const cards = [
    { label: 'Monto Base', value: money.format(kpis.base), accent: 'magenta' as const },
    { label: 'Monto Redeterminado', value: money.format(kpis.redet), accent: 'cyan' as const },
    { label: 'Total Monto Certificado', value: money.format(kpis.total), accent: 'purple' as const },
    { label: 'Plazo promedio de tramitación', value: `${days.format(kpis.plazo)} días`, accent: 'purple' as const },
  ]

  return (
    <section className="space-y-6">
      <PageHeader title={NAV_ITEMS[0].label} showFilterBar={true} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <KpiCard key={c.label} title={c.label} value={c.value} accentColor={c.accent} />
        ))}
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <CertificadosPorPrestamoChart data={filteredData} />
      </div>
      <DetalleCertificadosTable data={filteredData} />
    </section>
  )
}
