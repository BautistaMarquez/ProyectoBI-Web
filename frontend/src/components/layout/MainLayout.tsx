import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useCertificadosMaster } from '../../hooks/useAnalyticsQueries'
import { ApiError } from '../../services/api'
import Footer from './Footer'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function MainLayout() {
  const { isLoading, isError, error } = useCertificadosMaster()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [collapsed, setCollapsed] = useState(false)
  const problem = error instanceof ApiError ? error.problem : null

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 dark:bg-slate-950">
      <Navbar showSidebarToggle={!isHome} onToggleSidebar={() => setCollapsed((c) => !c)} />
      <div className="flex flex-1">
        {!isHome && <Sidebar collapsed={collapsed} onNavigate={() => setCollapsed(true)} />}
        <div className="flex min-w-0 flex-1 flex-col">
      <main className="min-h-screen flex-1 overflow-x-hidden bg-slate-100 p-6 dark:bg-slate-950">
        {isLoading && !isHome && (
          <div className="flex items-center justify-center gap-2 py-16 text-slate-500 dark:text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin" />
            Cargando datos...
          </div>
        )}
        {isError && (
          <div role="alert" className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200">
            <p className="font-semibold">{problem?.title ?? 'Error de red'}</p>
            <p className="text-sm">{problem?.detail ?? error?.message}</p>
            {problem?.status !== undefined && <p className="text-xs">HTTP {problem.status}</p>}
          </div>
        )}
        {(!isLoading || isHome) && !isError && <Outlet />}
      </main>
          <Footer />
        </div>
      </div>
    </div>
  )
}
