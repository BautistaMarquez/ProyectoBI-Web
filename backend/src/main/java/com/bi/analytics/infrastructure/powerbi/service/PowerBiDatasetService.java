package com.bi.analytics.infrastructure.powerbi.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import com.bi.analytics.config.PowerBiProperties;
import com.bi.analytics.infrastructure.powerbi.dto.request.ExecuteQueriesRequest;
import com.bi.analytics.infrastructure.powerbi.dto.response.ExecuteQueriesResponse;
import com.bi.analytics.infrastructure.powerbi.dto.response.TableContainer;
import com.bi.analytics.infrastructure.powerbi.dto.response.TableRows;
import com.bi.analytics.infrastructure.powerbi.exception.PowerBiApiException;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class PowerBiDatasetService {

	private final RestClient powerBiRestClient;
	private final PowerBiProperties powerBiProperties;
	private final ObjectMapper objectMapper;

	public PowerBiDatasetService(RestClient powerBiRestClient, PowerBiProperties powerBiProperties,
			ObjectMapper objectMapper) {
		this.powerBiRestClient = powerBiRestClient;
		this.powerBiProperties = powerBiProperties;
		this.objectMapper = objectMapper.copy()
				.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
				.enable(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES);
	}

	public List<Map<String, Object>> executeRawQuery(String daxQuery) {
		ExecuteQueriesResponse response;
		try {
			response = powerBiRestClient.post()
					.uri("/groups/{workspaceId}/datasets/{datasetId}/executeQueries",
								powerBiProperties.workspaceId(), powerBiProperties.datasetId())
					.body(ExecuteQueriesRequest.of(daxQuery))
					.retrieve()
					.body(ExecuteQueriesResponse.class);
		} catch (RestClientResponseException e) {
			throw new PowerBiApiException("Power BI API error: status=" + e.getStatusCode().value()
					+ ", body=" + e.getResponseBodyAsString(), e);
		}
		if (response == null || response.results() == null || response.results().isEmpty()) {
			return List.of();
		}
		TableContainer container = response.results().getFirst();
		if (container == null || container.tables() == null || container.tables().isEmpty()) {
			return List.of();
		}
		TableRows table = container.tables().getFirst();
		if (table == null || table.rows() == null) {
			return List.of();
		}
		return table.rows();
	}

	public <T> List<T> executeQuery(String daxQuery, Class<T> rowType) {
		return executeRawQuery(daxQuery).stream()
				.map(this::normalizeKeys)
				.map(row -> objectMapper.convertValue(row, rowType))
				.toList();
	}

	private Map<String, Object> normalizeKeys(Map<String, Object> row) {
		Map<String, Object> normalized = new LinkedHashMap<>();
		row.forEach((key, value) -> normalized.put(normalizeKey(key), value));
		return normalized;
	}

	/** {@code 'Tabla'[Monto]} or {@code [Monto]} -> {@code Monto}. */
	private static String normalizeKey(String key) {
		int open = key.lastIndexOf('[');
		int close = key.lastIndexOf(']');
		if (open >= 0 && close > open) {
			return key.substring(open + 1, close);
		}
		return key;
	}
}
