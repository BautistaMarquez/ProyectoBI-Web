import { Link } from 'react-router-dom'
import { useCertificadosMaster } from '../hooks/useAnalyticsQueries'
import { NAV_ITEMS } from '../config/navigation'

const DESCRIPTIONS: Record<string, string> = {
  'pantalla-2': 'Evolución de certificados base y sus ajustes por redeterminación de precios.',
  'pantalla-3': 'Seguimiento de los certificados abonados en moneda nacional.',
  'pantalla-4': 'Seguimiento de los certificados abonados en dólares estadounidenses.',
  'pantalla-5': 'Certificados emitidos que aún no registran pago, con su antigüedad.',
  'pantalla-6': 'Detalle de expedientes con pagos pendientes y su situación administrativa.',
  'pantalla-7': 'Reporte consolidado de certificación correspondiente al ejercicio 2025.',
  'pantalla-8': 'Avance físico de obras, bienes y servicios contratados.',
}

const ICON_TONES = ['bg-cyan/10 text-cyan', 'bg-purple/10 text-purple']

function HomeSkeleton() {
  return (
    <ul className="grid animate-pulse grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" aria-busy="true">
      {Array.from({ length: 6 }, (_, i) => (
        <li key={i} className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 h-48 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-800" />
              <div className="h-4 w-32 bg-slate-800 rounded" />
            </div>
            <div className="h-3 w-full bg-slate-800 rounded" />
            <div className="h-3 w-2/3 bg-slate-800 rounded" />
          </div>
          <div className="h-4 w-20 bg-slate-800 rounded" />
        </li>
      ))}
    </ul>
  )
}

export default function HomePlaceholder() {
  const { isLoading } = useCertificadosMaster()

  return (
    <section>
      <header className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          Panel de Gestión y Monitoreo
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Acceso a reportes analíticos de obras públicas, certificaciones y expedientes
        </p>
      </header>

      {isLoading ? (
        <HomeSkeleton />
      ) : (
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {NAV_ITEMS.map((item, i) => (
          <li key={item.id}>
            <Link
              to={item.path}
              className="group flex h-full flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${ICON_TONES[i % 2]}`}
                  >
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                    {item.label}
                  </h3>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                  {DESCRIPTIONS[item.id] ?? 'Vista analítica del sistema.'}
                </p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-cyan transition-colors group-hover:text-magenta">
                Acceder →
              </span>
            </Link>
          </li>
        ))}
      </ul>
      )}
    </section>
  )
}
