import { useMemo, useState } from 'react'
import PageHeader from '../components/layout/PageHeader'
import { NAV_ITEMS } from '../config/navigation'
import FichaObraCard from '../components/cards/FichaObraCard'
import CertificadosPorObraTable from '../components/tables/CertificadosPorObraTable'
import { useCertificadosMaster, useObrasResumen } from '../hooks/useAnalyticsQueries'
import { useFilteredCertificados } from '../hooks/useFilteredCertificados'
import type { ObraResumen } from '../types/analytics'

const obraLabel = (o: ObraResumen) => o.obraOProceso ?? o.nombreCompletoDeLaObra ?? o.nombreId ?? 'Sin nombre'
const obraKey = (o: ObraResumen) => o.nombreId ?? obraLabel(o)

export default function Pantalla8EstadoObra() {
  const { data: obrasData } = useObrasResumen()
  const { data: master } = useCertificadosMaster()
  const { filteredData } = useFilteredCertificados(master, { scope: 'all' })

  const obras = useMemo(
    () => [...(obrasData ?? [])].sort((a, b) => obraLabel(a).localeCompare(obraLabel(b), 'es', { numeric: true })),
    [obrasData],
  )

  const [selectedObraId, setSelectedObraId] = useState<string | null>(null)
  // Por defecto, el primer registro disponible.
  const selectedObra = obras.find((o) => obraKey(o) === selectedObraId) ?? obras[0]

  return (
    <section className="space-y-6">
      <PageHeader title={NAV_ITEMS[6].label} showFilterBar={false} />
      <div className="max-w-md">
        <select
          value={selectedObra ? obraKey(selectedObra) : ''}
          onChange={(e) => setSelectedObraId(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-cyan focus:outline-none focus:ring-2 focus:ring-cyan/30 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
          aria-label="Obra"
        >
          {obras.map((o) => (
            <option key={obraKey(o)} value={obraKey(o)}>
              {obraLabel(o)}
            </option>
          ))}
        </select>
      </div>
      {selectedObra ? (
        <>
          <FichaObraCard obra={selectedObra} />
          <CertificadosPorObraTable data={filteredData} obra={selectedObra} />
        </>
      ) : (
        <p className="text-sm text-slate-500">No hay obras disponibles.</p>
      )}
    </section>
  )
}
