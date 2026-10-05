import type { CertificadoMaster } from '../types/analytics'

export interface ExpedienteRow {
  /** Primera fila del grupo: fuente de los campos descriptivos. */
  first: CertificadoMaster
  certificado: number
  sumaPorExpediente: number
  pagadoUsd: number
}

/** Agrupa por expediente de pago; las filas sin expediente quedan como grupos individuales. */
export function groupByExpediente(data: CertificadoMaster[]): ExpedienteRow[] {
  const groups = new Map<string, ExpedienteRow>()
  data.forEach((c, i) => {
    const exp = c.pagoExpedienteDePago?.trim()
    const key = exp ? `e:${exp}` : `r:${i}`
    const g = groups.get(key)
    if (!g) {
      groups.set(key, {
        first: c,
        certificado: c.certificadoPorExpediente ?? 0,
        sumaPorExpediente: c.sumaPorExpediente ?? 0,
        pagadoUsd: c.montoPagadoUsd ?? 0,
      })
    } else {
      g.certificado = Math.max(g.certificado, c.certificadoPorExpediente ?? 0)
      g.sumaPorExpediente = Math.max(g.sumaPorExpediente, c.sumaPorExpediente ?? 0)
      g.pagadoUsd += c.montoPagadoUsd ?? 0
    }
  })
  return [...groups.values()]
}
