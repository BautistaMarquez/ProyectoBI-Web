package com.bi.analytics.domain;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

/** Projection of Q_OBRAS_RESUMEN. */
public record ObraResumenRecord(
		String nombreId,
		String obraOProceso,
		String nombreCompletoDeLaObra,
		String direccionResponsable,
		String contratista,
		String estado,
		String subestado,
		BigDecimal porcentajeAl,
		LocalDate inicio,
		LocalDate firmaDeContrato,
		Integer totalDiasPlazo,
		LocalDate fechaFin,
		String estadoObra,
		BigDecimal porcentajeAvance,
		BigDecimal montoContratoOriginal,
		BigDecimal montoContratoDolarizado,
		BigDecimal montoEjecutadoTotal) {

	public static ObraResumenRecord fromRow(Map<String, Object> raw) {
		Map<String, Object> row = RowParsers.normalize(raw);
		return new ObraResumenRecord(
				RowParsers.string(row, "NombreID"),
				RowParsers.string(row, "OBRA O PROCESO"),
				RowParsers.string(row, "Nombre Completo de la Obra"),
				RowParsers.string(row, "Dirección Responsable"),
				RowParsers.string(row, "Contratista"),
				RowParsers.string(row, "ESTADO"),
				RowParsers.string(row, "SUBESTADO"),
				RowParsers.decimal(row, "% DE AL"),
				RowParsers.date(row, "Inicio"),
				RowParsers.date(row, "Firma de Contrato"),
				RowParsers.integer(row, "TotalDiasPlazo"),
				RowParsers.date(row, "FechaFin"),
				RowParsers.string(row, "EstadoObra"),
				RowParsers.decimal(row, "PorcentajeAvance"),
				RowParsers.decimal(row, "MontoContratoOriginal"),
				RowParsers.decimal(row, "MontoContratoDolarizado"),
				RowParsers.decimal(row, "MontoEjecutadoTotal"));
	}
}
