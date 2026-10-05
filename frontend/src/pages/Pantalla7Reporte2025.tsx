import { useMemo } from 'react'
import PageHeader from '../components/layout/PageHeader'
import { NAV_ITEMS } from '../config/navigation'
import KpiCard from '../components/cards/KpiCard'
import CertificadosPorPrestamoChart from '../components/charts/CertificadosPorPrestamoChart'
import DetalleCertificadosTable from '../components/tables/DetalleCertificadosTable'
import { useCertificadosMaster } from '../hooks/useAnalyticsQueries'
import { useFilteredCertificados } from '../hooks/useFilteredCertificados'

const money = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })


export default function Pantalla7Reporte2025() {
  const { data } = useCertificadosMaster()
  const { filteredData } = useFilteredCertificados(data, { scope: '2025', paymentStatus: 'paid' })

  const kpis = useMemo(() => {
    let base = 0
    let redet = 0
    for (const c of filteredData) {
      const monto = c.montoCertificado ?? 0
      if (c.tipoDeCertificadoPago === 0 || c.tipoDeCertificadoPago === 1) base += monto
      else redet += monto
    }
    return { base, redet, total: base + redet }
  }, [filteredData])

  const cards = [
    { label: 'Monto Certificado Base', value: money.format(kpis.base), accent: 'magenta' as const },
    { label: 'Monto Certificado Redeterminado', value: money.format(kpis.redet), accent: 'cyan' as const },
    { label: 'Monto Certificado Total', value: money.format(kpis.total), accent: 'purple' as const },
  ]

  return (
    <section className="space-y-6">
      <PageHeader title={NAV_ITEMS[5].label} showFilterBar={true} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <KpiCard key={c.label} title={c.label} value={c.value} accentColor={c.accent} />
        ))}
      </div>
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <CertificadosPorPrestamoChart data={filteredData} />
      </div>
      <DetalleCertificadosTable data={filteredData} defaultSortKey="montoCertificado" />
    </section>
  )
}
