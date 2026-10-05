export const CHART_PALETTE = {
  /** Morado institucional para métricas únicas */
  single: '#6C5F91',
  /** Magenta y Cyan institucional para comparativas */
  dual: ['#E82076', '#0CAFC3'],
  /** Monto Base */
  base: '#E82076',
  /** Monto Redeterminado */
  redeterminado: '#0CAFC3',
} as const

export function createCurrencyFormatter(currency: 'ARS' | 'USD' = 'ARS') {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency, maximumFractionDigits: 0 })
}

export const compactNumber = new Intl.NumberFormat('es-AR', { notation: 'compact' })

/** Configuración común de tooltip: fondo slate oscuro, borde sutil. */
export const CHART_TOOLTIP_BASE = {
  trigger: 'axis' as const,
  axisPointer: { type: 'shadow' as const },
  backgroundColor: '#0f172a',
  borderColor: '#334155',
  borderWidth: 1,
  padding: [8, 12],
  textStyle: { color: '#f1f5f9', fontSize: 12 },
}

export const CHART_AXIS_X = {
  type: 'category' as const,
  axisLabel: { color: '#FFFFFF', interval: 0, rotate: 30, overflow: 'truncate' as const, width: 85 },
  axisLine: { lineStyle: { color: '#475569' } },
  splitLine: { lineStyle: { color: '#334155' } },
}

export function chartYAxis(formatter: (v: number) => string) {
  return {
    type: 'value' as const,
    axisLabel: { color: '#FFFFFF', formatter },
    axisLine: { lineStyle: { color: '#475569' } },
    splitLine: { lineStyle: { color: '#334155' } },
  }
}

export const CHART_SERIES_LABEL = {
  show: false,
  position: 'top' as const,
  color: '#FFFFFF',
  fontWeight: 'bold' as const,
  fontSize: 10,
}

export function chartGrid(top = 40) {
  return { top, left: 16, right: 16, bottom: 50, containLabel: true }
}
