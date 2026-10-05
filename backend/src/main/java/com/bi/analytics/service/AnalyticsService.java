package com.bi.analytics.service;

import java.util.List;
import java.util.Map;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.bi.analytics.domain.CertificadoMasterRecord;
import com.bi.analytics.domain.ObraResumenRecord;
import com.bi.analytics.infrastructure.powerbi.service.PowerBiDatasetService;

@Service
public class AnalyticsService {

	private static final String Q_CERTIFICADOS_MASTER = """
			EVALUATE
			SUMMARIZECOLUMNS(
			    'TablaDatos'[NombreID],
			    'TablaDatos'[Prestamo],
			    'TablaDatos'[OBRA o PROCESO],
			    'TablaObras'[Dirección Responsable],
			    'TablaObras'[Contratista],
			    'TablaDatos'[Mes],
			    'TablaDatos'[PAGO Expediente de Pago],
			    'TablaDatos'[Nombre_ee_principal],
			    'TablaDatos'[PAGO fecha de pago],
			    'TablaDatos'[ENTRADA a DAFyMP],
			    'TablaDatos'[Fecha Caratulacion ee],
			    'TablaDatos'[S.F. NRO de SF],
			    'TablaDatos'[AÑO OP],
			    'TablaDatos'[NUM OP],
			    'TablaDatos'[TIPO DE CERTIFICADO PAGO],
			    'TablaDatos'[Cert o Aj. o informe],
			    "MontoCertificado", SUM('TablaDatos'[CERTIFICADO Monto Certificado]),
			    "MontoAPagar", SUM('TablaDatos'[CERTIFICADO monto a pagar / facturar]),
			    "MontoFinanciadoUSD", SUM('TablaDatos'[MONTO FINANCIADO (USD)]),
			    "MontoPagadoUSD", SUM('TablaDatos'[MONTO PAGADO (USD)]),
			    "MontoLocalUSD", SUM('TablaDatos'[Monto Local USD]),
			    "DiasTramitacion", MAX('TablaDatos'[Dias de tramitacion]),
			    "DiasEnTramitacion", MAX('TablaDatos'[Dias en tramitacion]),
			    "DiasDeProceso", MAX('TablaDatos'[Dias de proceso]),
			    "PlazoEnDias", MAX('TablaDatos'[Plazo en dias]),
			    "CertificadoPorExpediente", MAX('TablaDatos'[Certificado por Expediente]),
			    "SumaPorExpediente", MAX('TablaDatos'[Suma por Expediente])
			)
			""";

	private static final String Q_OBRAS_RESUMEN = """
			EVALUATE
			SUMMARIZECOLUMNS(
			    'TablaObras'[NombreID],
			    'TablaObras'[OBRA O PROCESO],
			    'TablaObras'[Nombre Completo de la Obra],
			    'TablaObras'[Dirección Responsable],
			    'TablaObras'[Contratista],
			    'TablaObras'[ESTADO],
			    'TablaObras'[SUBESTADO],
			    'TablaObras'[% DE AL],
			    'TablaObras'[Inicio],
			    'TablaObras'[Firma de Contrato],
			    "TotalDiasPlazo", MAX('TablaPlazos'[Total Días Plazo]),
			    "FechaFin", MAX('TablaPlazos'[Fecha Fin]),
			    "EstadoObra", MAX('TablaPlazos'[Estado de Obra]),
			    "PorcentajeAvance", [Medida % Avance],
			    "MontoContratoOriginal", CALCULATE(SUM('TablaContratos'[MONTO]), 'TablaContratos'[TIPO] = "ORIGINAL"),
			    "MontoContratoDolarizado", CALCULATE(SUM('TablaContratos'[CONTRATO DOLARIZADO]), 'TablaContratos'[TIPO] = "ORIGINAL"),
			    "MontoEjecutadoTotal", CALCULATE(SUM('TablaDatos'[CERTIFICADO Monto Certificado]), 'TablaDatos'[TIPO DE CERTIFICADO PAGO] = 1)
			)
			""";

	private final PowerBiDatasetService powerBiDatasetService;

	public AnalyticsService(PowerBiDatasetService powerBiDatasetService) {
		this.powerBiDatasetService = powerBiDatasetService;
	}

	@Cacheable(value = "analytics", key = "'certificados_master'")
	public List<CertificadoMasterRecord> getCertificadosMaster() {
		return rows(Q_CERTIFICADOS_MASTER).stream().map(CertificadoMasterRecord::fromRow).toList();
	}

	@Cacheable(value = "analytics", key = "'obras_resumen'")
	public List<ObraResumenRecord> getObrasResumen() {
		return rows(Q_OBRAS_RESUMEN).stream().map(ObraResumenRecord::fromRow).toList();
	}

	@CacheEvict(value = "analytics", allEntries = true)
	public void evictAnalyticsCache() {
		// eviction is performed by the annotation
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	private List<Map<String, Object>> rows(String dax) {
		return (List<Map<String, Object>>) (List) powerBiDatasetService.executeQuery(dax, Map.class);
	}
}
