package com.bi.analytics.infrastructure.powerbi.dto.request;

import java.util.List;

public record ExecuteQueriesRequest(List<DaxQuery> queries, SerializerSettings serializerSettings) {

	public static ExecuteQueriesRequest of(String daxQuery) {
		return new ExecuteQueriesRequest(List.of(new DaxQuery(daxQuery)), new SerializerSettings());
	}
}
