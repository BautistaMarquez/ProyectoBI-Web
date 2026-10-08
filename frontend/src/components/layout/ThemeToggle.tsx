import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Cambiar a modo día' : 'Cambiar a modo noche'}
      title={isDark ? 'Modo día' : 'Modo noche'}
      className="rounded-lg border border-slate-300 p-1.5 text-slate-600 transition-colors hover:bg-slate-100 hover:text-magenta dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
}
