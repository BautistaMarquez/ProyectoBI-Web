import ReactECharts from 'echarts-for-react'
import { useMemo } from 'react'
import {
  CHART_PALETTE,
  chartGrid,
  compactNumber,
  createCurrencyFormatter,
  getChartTheme,
} from '../../config/chartTheme'
import { useTheme } from '../../context/ThemeContext'
import type { CertificadoMaster } from '../../types/analytics'

const money = createCurrencyFormatter('ARS')
const compact = compactNumber

interface Props {
  data: CertificadoMaster[]
}

interface TooltipParam {
  axisValue: string
  marker: string
  seriesName: string
  value: number
}

export default function PendientesPorDireccionChart({ data }: Props) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const option = useMemo(() => {
    const groups = new Map<string, number>()
    for (const c of data) {
      const key = c.direccionResponsable ?? 'Sin dirección'
      groups.set(key, (groups.get(key) ?? 0) + (c.montoAPagar ?? 0))
    }
    const direcciones = [...groups.keys()].sort((a, b) => a.localeCompare(b, 'es', { numeric: true }))

    const t = getChartTheme(isDark)
    return {
      color: [CHART_PALETTE.single],
      grid: chartGrid(24),
      tooltip: {
        ...t.tooltip,
        formatter: (params: TooltipParam[]) =>
          `${params[0].axisValue}<br/>${params[0].marker} ${params[0].seriesName}: <b>${money.format(params[0].value)}</b>`,
      },
      xAxis: { ...t.xAxis, data: direcciones },
      yAxis: t.yAxis((v) => compact.format(v)),
      series: [
        { name: 'Monto Pendiente', type: 'bar', label: { show: false }, barMaxWidth: 48, itemStyle: { color: CHART_PALETTE.single }, data: direcciones.map((d) => groups.get(d)!) },
      ],
    }
  }, [data, isDark])

  return <ReactECharts option={option} style={{ height: 360 }} notMerge />
}
