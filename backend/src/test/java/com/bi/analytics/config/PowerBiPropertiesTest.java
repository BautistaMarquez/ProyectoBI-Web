package com.bi.analytics.config;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

class PowerBiPropertiesTest {

	private static PowerBiProperties build(String tenant, String client, String secret, String workspace,
			String dataset) {
		return new PowerBiProperties(tenant, client, secret, workspace, dataset, "https://api", "https://auth",
				"scope");
	}

	@Test
	void acceptsValidValues() {
		assertDoesNotThrow(() -> build("t", "c", "s", "w", "d"));
	}

	@Test
	void rejectsBlankValues() {
		assertThrows(IllegalStateException.class, () -> build("t", "c", " ", "w", "d"));
		assertThrows(IllegalStateException.class, () -> build(null, "c", "s", "w", "d"));
	}

	@Test
	void rejectsUnresolvedPlaceholders() {
		assertThrows(IllegalStateException.class, () -> build("${AZURE_TENANT_ID}", "c", "s", "w", "d"));
		assertThrows(IllegalStateException.class, () -> build("t", "c", "s", "w", "${PBI_DATASET_ID}"));
	}
}
