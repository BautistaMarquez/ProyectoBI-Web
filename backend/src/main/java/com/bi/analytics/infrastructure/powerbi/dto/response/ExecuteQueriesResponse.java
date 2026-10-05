package com.bi.analytics.infrastructure.powerbi.dto.response;

import java.util.List;

public record ExecuteQueriesResponse(List<TableContainer> results, Object error) {
}
