import { useMsal } from '@azure/msal-react'
import { LogOut, Menu } from 'lucide-react'
import { Link } from 'react-router-dom'
import { APP_SHORT_NAME } from '../../config/navigation'
import ThemeToggle from './ThemeToggle'

interface NavbarProps {
  showSidebarToggle: boolean
  onToggleSidebar: () => void
}

export default function Navbar({ showSidebarToggle, onToggleSidebar }: NavbarProps) {
  const { instance } = useMsal()

  // Cierre de sesión local: no cierra la sesión de Microsoft 365 / Outlook.
  const handleLogout = () => {
    // Solo se eliminan datos de sesión; la clave 'theme' se preserva.
    sessionStorage.clear()
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    instance.setActiveAccount(null)
    window.location.href = '/'
  }

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-4">
        {showSidebarToggle && (
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Contraer o expandir menú lateral"
            className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <Link to="/" className="flex items-center gap-3">
          <span className="bg-gradient-to-r from-magenta via-purple to-cyan bg-clip-text text-xl font-black tracking-wider text-transparent">
            {APP_SHORT_NAME}
          </span>
        </Link>
      </div>
      <div className="flex items-center gap-3">
      <ThemeToggle />
      <button
        type="button"
        onClick={handleLogout}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-magenta/5 hover:text-magenta dark:border-slate-700 dark:text-slate-200"
      >
        <LogOut className="h-4 w-4" />
        Cerrar sesión
      </button>
      </div>
    </header>
  )
}
