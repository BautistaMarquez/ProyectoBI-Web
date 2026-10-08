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

/** Colores de ejes, tooltip y leyenda según el tema activo. */
export function getChartTheme(isDark: boolean) {
  const axisColor = isDark ? '#334155' : '#cbd5e1'
  return {
    tooltip: {
      trigger: 'axis' as const,
      axisPointer: { type: 'shadow' as const },
      backgroundColor: isDark ? '#0f172a' : '#ffffff',
      borderColor: isDark ? '#334155' : '#e2e8f0',
      borderWidth: 1,
      padding: [8, 12],
      textStyle: { color: isDark ? '#f8fafc' : '#0f172a', fontSize: 12 },
    },
    legend: { textStyle: { color: isDark ? '#cbd5e1' : '#334155' } },
    xAxis: {
      type: 'category' as const,
      axisLabel: { color: isDark ? '#94a3b8' : '#64748b', interval: 0, rotate: 30, overflow: 'truncate' as const, width: 85 },
      axisLine: { lineStyle: { color: axisColor } },
      axisTick: { lineStyle: { color: axisColor } },
      splitLine: { lineStyle: { color: isDark ? '#1e293b' : '#f1f5f9' } },
    },
    yAxis: (formatter: (v: number) => string) => ({
      type: 'value' as const,
      axisLabel: { color: isDark ? '#94a3b8' : '#64748b', formatter },
      axisLine: { lineStyle: { color: axisColor } },
      axisTick: { lineStyle: { color: axisColor } },
      splitLine: { lineStyle: { color: isDark ? '#1e293b' : '#f1f5f9' } },
    }),
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
