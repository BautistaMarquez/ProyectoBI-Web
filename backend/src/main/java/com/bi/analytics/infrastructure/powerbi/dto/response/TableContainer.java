package com.bi.analytics.infrastructure.powerbi.dto.response;

import java.util.List;

public record TableContainer(List<TableRows> tables) {
}
