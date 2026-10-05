package com.bi.analytics.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.bi.analytics.domain.CertificadoMasterRecord;
import com.bi.analytics.domain.ObraResumenRecord;
import com.bi.analytics.infrastructure.powerbi.service.PowerBiDatasetService;

class AnalyticsServiceTest {

	private PowerBiDatasetService datasetService;
	private AnalyticsService service;

	@BeforeEach
	void setUp() {
		datasetService = mock(PowerBiDatasetService.class);
		service = new AnalyticsService(datasetService);
	}

	@Test
	@SuppressWarnings({ "rawtypes", "unchecked" })
	void getCertificadosMasterMapsDaxColumns() {
		Map<String, Object> row = new HashMap<>();
		row.put("TablaDatos[NombreID]", "OBRA-1");
		row.put("TablaObras[Dirección Responsable]", "Dir X");
		row.put("TablaDatos[PAGO fecha de pago]", "2024-03-15T00:00:00");
		row.put("TablaDatos[AÑO OP]", 2024);
		row.put("TablaDatos[TIPO DE CERTIFICADO PAGO]", 1.0);
		row.put("[MontoCertificado]", 1234.5);
		row.put("[DiasTramitacion]", 12);
		row.put("[MontoPagadoUSD]", null);
		List raw = List.of(row);
		when(datasetService.executeQuery(anyString(), eq(Map.class))).thenReturn(raw);

		List<CertificadoMasterRecord> result = service.getCertificadosMaster();

		assertThat(result).hasSize(1);
		CertificadoMasterRecord r = result.getFirst();
		assertThat(r.nombreId()).isEqualTo("OBRA-1");
		assertThat(r.direccionResponsable()).isEqualTo("Dir X");
		assertThat(r.pagoFechaDePago()).isEqualTo(LocalDate.of(2024, 3, 15));
		assertThat(r.anoOp()).isEqualTo(2024);
		assertThat(r.tipoDeCertificadoPago()).isEqualTo(1);
		assertThat(r.montoCertificado()).isEqualByComparingTo(new BigDecimal("1234.5"));
		assertThat(r.diasTramitacion()).isEqualTo(12);
		assertThat(r.montoPagadoUsd()).isNull();
		assertThat(r.contratista()).isNull();
	}

	@Test
	@SuppressWarnings({ "rawtypes", "unchecked" })
	void getObrasResumenMapsDaxColumns() {
		Map<String, Object> row = new HashMap<>();
		row.put("TablaObras[NombreID]", "OBRA-1");
		row.put("TablaObras[OBRA O PROCESO]", "Proceso");
		row.put("TablaObras[% DE AL]", 0.5);
		row.put("TablaObras[Inicio]", "2023-01-10T00:00:00");
		row.put("[TotalDiasPlazo]", 365);
		row.put("[FechaFin]", null);
		row.put("[PorcentajeAvance]", 0.75);
		row.put("[MontoContratoOriginal]", 1000000);
		List raw = List.of(row);
		when(datasetService.executeQuery(anyString(), eq(Map.class))).thenReturn(raw);

		List<ObraResumenRecord> result = service.getObrasResumen();

		assertThat(result).hasSize(1);
		ObraResumenRecord r = result.getFirst();
		assertThat(r.nombreId()).isEqualTo("OBRA-1");
		assertThat(r.obraOProceso()).isEqualTo("Proceso");
		assertThat(r.porcentajeAl()).isEqualByComparingTo(new BigDecimal("0.5"));
		assertThat(r.inicio()).isEqualTo(LocalDate.of(2023, 1, 10));
		assertThat(r.totalDiasPlazo()).isEqualTo(365);
		assertThat(r.fechaFin()).isNull();
		assertThat(r.porcentajeAvance()).isEqualByComparingTo(new BigDecimal("0.75"));
		assertThat(r.montoContratoOriginal()).isEqualByComparingTo(new BigDecimal("1000000"));
		assertThat(r.montoEjecutadoTotal()).isNull();
	}
}
