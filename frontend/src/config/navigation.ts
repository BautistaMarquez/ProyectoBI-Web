import { Banknote, CalendarRange, ClipboardList, ClockAlert, FileText, Globe, HardHat } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const APP_NAME = 'Sistema Integrado de Información para la Gestión'
export const APP_SHORT_NAME = 'SIIG'

export interface NavItem {
  id: string
  path: string
  label: string
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'pantalla-2', path: '/pantalla-2', label: 'Certificados devengados', icon: FileText },
  { id: 'pantalla-3', path: '/pantalla-3', label: 'Certificados pagados en pesos', icon: Banknote },
  { id: 'pantalla-4', path: '/pantalla-4', label: 'Certificados pagados en USD', icon: Globe },
  { id: 'pantalla-5', path: '/pantalla-5', label: 'Certificados pendientes de pago', icon: ClockAlert },
  { id: 'pantalla-6', path: '/pantalla-6', label: 'Reporte expedientes pendientes de pago', icon: ClipboardList },
  { id: 'pantalla-7', path: '/pantalla-7', label: 'Reporte 2025', icon: CalendarRange },
  { id: 'pantalla-8', path: '/pantalla-8', label: 'Estado de obra, bienes y servicios', icon: HardHat },
]
