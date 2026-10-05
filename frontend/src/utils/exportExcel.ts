import * as XLSX from 'xlsx'
import { formatMes } from '../hooks/useFilteredCertificados'
import type { CertificadoMaster } from '../types/analytics'

export function exportToExcel(data: CertificadoMaster[], filename: string) {
  const rows = data.map((c) => ({
    'Préstamo': c.prestamo ?? '',
    'Dirección Responsable': c.direccionResponsable ?? '',
    'Nombre EE Principal': c.nombreEePrincipal ?? '',
    'Nro SF': c.sfNroDeSf ?? '',
    'Mes': formatMes(c.mes),
    'Monto Pendiente ($)': c.montoAPagar ?? 0,
    'Días en Tramitación': c.diasEnTramitacion ?? '',
    'Contratista': c.contratista ?? '',
    'Expediente': c.pagoExpedienteDePago ?? '',
  }))
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Reporte')
  XLSX.writeFile(wb, `${filename}.xlsx`)
}
