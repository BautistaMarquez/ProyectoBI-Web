import ReactECharts from 'echarts-for-react'
import { useMemo } from 'react'
import {
  CHART_AXIS_X,
  CHART_PALETTE,
  CHART_TOOLTIP_BASE,
  chartGrid,
  chartYAxis,
  compactNumber,
  createCurrencyFormatter,
} from '../../config/chartTheme'
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
  const option = useMemo(() => {
    const groups = new Map<string, number>()
    for (const c of data) {
      const key = c.direccionResponsable ?? 'Sin dirección'
      groups.set(key, (groups.get(key) ?? 0) + (c.montoAPagar ?? 0))
    }
    const direcciones = [...groups.keys()].sort((a, b) => a.localeCompare(b, 'es', { numeric: true }))

    return {
      color: [CHART_PALETTE.single],
      grid: chartGrid(24),
      tooltip: {
        ...CHART_TOOLTIP_BASE,
        formatter: (params: TooltipParam[]) =>
          `${params[0].axisValue}<br/>${params[0].marker} ${params[0].seriesName}: <b>${money.format(params[0].value)}</b>`,
      },
      xAxis: { ...CHART_AXIS_X, data: direcciones },
      yAxis: chartYAxis((v) => compact.format(v)),
      series: [
        { name: 'Monto Pendiente', type: 'bar', label: { show: false }, barMaxWidth: 48, itemStyle: { color: CHART_PALETTE.single }, data: direcciones.map((d) => groups.get(d)!) },
      ],
    }
  }, [data])

  return <ReactECharts option={option} style={{ height: 360 }} notMerge />
}
