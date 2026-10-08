import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from '../../config/navigation'

interface SidebarProps {
  collapsed: boolean
  onNavigate: () => void
}

export default function Sidebar({ collapsed, onNavigate }: SidebarProps) {
  return (
    <aside
      aria-label="Navegación principal"
      className={`relative z-30 shrink-0 border-r border-slate-200 bg-slate-50 transition-[width] duration-200 dark:border-slate-800 dark:bg-slate-900 ${
        collapsed ? 'w-16' : 'w-64 overflow-hidden'
      }`}
    >
      <nav className="flex flex-col gap-1 p-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            onClick={onNavigate}
            aria-label={item.label}
            className={({ isActive }) =>
              `group relative flex items-center rounded-lg transition-colors ${
                collapsed ? 'justify-center px-2 py-2' : 'gap-3 px-3 py-2 text-sm'
              } ${
                isActive
                  ? 'bg-primary/10 font-semibold text-primary dark:bg-primary/20 dark:text-white'
                  : 'text-slate-700 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              }`
            }
          >
            <item.icon className="h-5 w-5 shrink-0" stroke="currentColor" aria-hidden="true" />
            {collapsed ? (
              <div className="pointer-events-none absolute left-full z-50 ml-3 whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                {item.label}
              </div>
            ) : (
              <span className="leading-tight">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
