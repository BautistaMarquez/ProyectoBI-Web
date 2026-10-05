export interface CertificadoMaster {
  nombreId: string | null
  prestamo: string | null
  obraOProceso: string | null
  direccionResponsable: string | null
  contratista: string | null
  mes: string | null
  pagoExpedienteDePago: string | null
  nombreEePrincipal: string | null
  pagoFechaDePago: string | null
  entradaADafymp: string | null
  fechaCaratulacionEe: string | null
  sfNroDeSf: string | null
  anoOp: number | null
  numOp: number | null
  tipoDeCertificadoPago: number | null
  certOAjOInforme: string | null
  montoCertificado: number | null
  montoAPagar: number | null
  montoFinanciadoUsd: number | null
  montoPagadoUsd: number | null
  montoLocalUsd: number | null
  diasTramitacion: number | null
  diasEnTramitacion: number | null
  diasDeProceso: number | null
  plazoEnDias: number | null
  certificadoPorExpediente: number | null
  sumaPorExpediente: number | null
}

export interface ObraResumen {
  nombreId: string | null
  obraOProceso: string | null
  nombreCompletoDeLaObra: string | null
  direccionResponsable: string | null
  contratista: string | null
  estado: string | null
  subestado: string | null
  porcentajeAl: number | null
  inicio: string | null
  firmaDeContrato: string | null
  totalDiasPlazo: number | null
  fechaFin: string | null
  estadoObra: string | null
  porcentajeAvance: number | null
  montoContratoOriginal: number | null
  montoContratoDolarizado: number | null
  montoEjecutadoTotal: number | null
}

/** RFC 7807 problem details. */
export interface ProblemDetail {
  type?: string
  title?: string
  status?: number
  detail?: string
  instance?: string
}
