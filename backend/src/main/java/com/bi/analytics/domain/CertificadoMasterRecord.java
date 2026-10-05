package com.bi.analytics.domain;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

/** Projection of Q_CERTIFICADOS_MASTER. */
public record CertificadoMasterRecord(
		String nombreId,
		String prestamo,
		String obraOProceso,
		String direccionResponsable,
		String contratista,
		String mes,
		String pagoExpedienteDePago,
		String nombreEePrincipal,
		LocalDate pagoFechaDePago,
		LocalDate entradaADafymp,
		LocalDate fechaCaratulacionEe,
		String sfNroDeSf,
		Integer anoOp,
		Integer numOp,
		Integer tipoDeCertificadoPago,
		String certOAjOInforme,
		BigDecimal montoCertificado,
		BigDecimal montoAPagar,
		BigDecimal montoFinanciadoUsd,
		BigDecimal montoPagadoUsd,
		BigDecimal montoLocalUsd,
		Integer diasTramitacion,
		Integer diasEnTramitacion,
		Integer diasDeProceso,
		Integer plazoEnDias,
		BigDecimal certificadoPorExpediente,
		BigDecimal sumaPorExpediente) {

	public static CertificadoMasterRecord fromRow(Map<String, Object> raw) {
		Map<String, Object> row = RowParsers.normalize(raw);
		return new CertificadoMasterRecord(
				RowParsers.string(row, "NombreID"),
				RowParsers.string(row, "Prestamo"),
				RowParsers.string(row, "OBRA o PROCESO"),
				RowParsers.string(row, "Dirección Responsable"),
				RowParsers.string(row, "Contratista"),
				RowParsers.string(row, "Mes"),
				RowParsers.string(row, "PAGO Expediente de Pago"),
				RowParsers.string(row, "Nombre_ee_principal"),
				RowParsers.date(row, "PAGO fecha de pago"),
				RowParsers.date(row, "ENTRADA a DAFyMP"),
				RowParsers.date(row, "Fecha Caratulacion ee"),
				RowParsers.string(row, "S.F. NRO de SF"),
				RowParsers.integer(row, "AÑO OP"),
				RowParsers.integer(row, "NUM OP"),
				RowParsers.integer(row, "TIPO DE CERTIFICADO PAGO"),
				RowParsers.string(row, "Cert o Aj. o informe"),
				RowParsers.decimal(row, "MontoCertificado"),
				RowParsers.decimal(row, "MontoAPagar"),
				RowParsers.decimal(row, "MontoFinanciadoUSD"),
				RowParsers.decimal(row, "MontoPagadoUSD"),
				RowParsers.decimal(row, "MontoLocalUSD"),
				RowParsers.integer(row, "DiasTramitacion"),
				RowParsers.integer(row, "DiasEnTramitacion"),
				RowParsers.integer(row, "DiasDeProceso"),
				RowParsers.integer(row, "PlazoEnDias"),
				RowParsers.decimal(row, "CertificadoPorExpediente"),
				RowParsers.decimal(row, "SumaPorExpediente"));
	}
}
