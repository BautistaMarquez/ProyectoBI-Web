package com.bi.analytics.infrastructure.powerbi.dto.response;

import java.util.List;
import java.util.Map;

public record TableRows(List<Map<String, Object>> rows) {
}
