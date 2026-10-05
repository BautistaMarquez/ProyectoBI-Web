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

export default function CertificadosPorDireccionChart({ data }: Props) {
  const option = useMemo(() => {
    const groups = new Map<string, { base: number; redet: number }>()
    for (const c of data) {
      const key = c.direccionResponsable ?? 'Sin dirección'
      const g = groups.get(key) ?? { base: 0, redet: 0 }
      const monto = c.montoCertificado ?? 0
      if (c.tipoDeCertificadoPago === 0 || c.tipoDeCertificadoPago === 1) g.base += monto
      else g.redet += monto
      groups.set(key, g)
    }
    const prestamos = [...groups.keys()].sort((a, b) => a.localeCompare(b, 'es', { numeric: true }))

    return {
      color: [...CHART_PALETTE.dual],
      legend: { top: 0, textStyle: { color: '#FFFFFF' } },
      grid: chartGrid(40),
      tooltip: {
        ...CHART_TOOLTIP_BASE,
        formatter: (params: TooltipParam[]) => {
          const total = params.reduce((acc, p) => acc + p.value, 0)
          const rows = params
            .map((p) => `${p.marker} ${p.seriesName}: <b>${money.format(p.value)}</b>`)
            .join('<br/>')
          return `${params[0].axisValue}<br/>${rows}<br/>Total: <b>${money.format(total)}</b>`
        },
      },
      xAxis: { ...CHART_AXIS_X, data: prestamos },
      yAxis: chartYAxis((v) => compact.format(v)),
      series: [
        { name: 'Monto Base', type: 'bar', label: { show: false }, stack: 'total', barMaxWidth: 48, itemStyle: { color: CHART_PALETTE.base }, data: prestamos.map((p) => groups.get(p)!.base) },
        {
          name: 'Monto Redeterminado',
          type: 'bar', label: { show: false },
          stack: 'total',
          barMaxWidth: 48,
          itemStyle: { color: CHART_PALETTE.redeterminado },
          data: prestamos.map((p) => groups.get(p)!.redet),
        },
      ],
    }
  }, [data])

  return <ReactECharts option={option} style={{ height: 360 }} notMerge />
}
