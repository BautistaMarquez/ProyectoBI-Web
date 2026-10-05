package com.bi.analytics.infrastructure.powerbi.dto.request;

public record SerializerSettings(boolean includeNulls) {

	public SerializerSettings() {
		this(true);
	}
}
