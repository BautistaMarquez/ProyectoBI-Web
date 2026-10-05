package com.bi.analytics.config;

import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "powerbi")
public record PowerBiProperties(
		@NotBlank String tenantId,
		@NotBlank String clientId,
		@NotBlank String clientSecret,
		@NotBlank String workspaceId,
		@NotBlank String datasetId,
		@NotBlank String apiUrl,
		@NotBlank String authority,
		@NotBlank String scope) {

	public PowerBiProperties {
		require(tenantId, "powerbi.tenant-id", "AZURE_TENANT_ID");
		require(clientId, "powerbi.client-id", "AZURE_CLIENT_ID");
		require(clientSecret, "powerbi.client-secret", "AZURE_CLIENT_SECRET");
		require(workspaceId, "powerbi.workspace-id", "PBI_WORKSPACE_ID");
		require(datasetId, "powerbi.dataset-id", "PBI_DATASET_ID");
		if (tenantId.startsWith("${") || clientId.startsWith("${") || clientSecret.startsWith("${")
				|| workspaceId.startsWith("${") || datasetId.startsWith("${")) {
			throw new IllegalStateException("Una o más variables de entorno de Power BI contienen "
					+ "placeholders sin resolver (${...}). Verifique el archivo .env.");
		}
	}

	private static void require(String value, String property, String envVar) {
		if (value == null || value.isBlank()) {
			throw new IllegalStateException("Propiedad '" + property
					+ "' no definida: configure la variable de entorno " + envVar);
		}
	}
}
