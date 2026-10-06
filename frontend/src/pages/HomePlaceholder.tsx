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

function HomeLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="flex flex-col items-center justify-center gap-8 py-24"
    >
      <div className="relative flex h-24 w-24 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-cyan/20" />
        <span className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-800" />
        <span className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-cyan border-r-purple [animation-duration:1.2s]" />
        <span className="absolute inset-3 animate-spin rounded-full border-4 border-transparent border-b-magenta [animation-direction:reverse] [animation-duration:1.8s]" />
        <span className="h-3 w-3 animate-pulse rounded-full bg-gradient-to-br from-cyan to-magenta" />
      </div>
      <div className="flex flex-col items-center gap-3">
        <p className="text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-300">
          Preparando el panel
        </p>
        <div className="flex items-end gap-1.5" aria-hidden="true">
          {['bg-cyan', 'bg-purple', 'bg-magenta'].map((tone, i) => (
            <span
              key={tone}
              className={`h-2 w-2 animate-bounce rounded-full ${tone}`}
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
      <span className="sr-only">Cargando datos...</span>
    </div>
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
        <HomeLoader />
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
