package com.bi.analytics.infrastructure.powerbi.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.jsonPath;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import com.bi.analytics.config.PowerBiProperties;
import com.bi.analytics.infrastructure.powerbi.exception.PowerBiApiException;

import com.fasterxml.jackson.databind.ObjectMapper;

class PowerBiDatasetServiceTest {

	record TestRow(Integer id, String nombre) {
	}

	private static final String BASE = "https://api.powerbi.com/v1.0/myorg";
	private static final String URL_WS = BASE + "/groups/dummy-workspace/datasets/ds1/executeQueries";
	private static final String RESPONSE =
			"{\"results\":[{\"tables\":[{\"rows\":[{\"[ID]\":1,\"[Nombre]\":\"Obra A\",\"'T'[Extra]\":5}]}]}]}";

	private MockRestServiceServer server;
	private PowerBiDatasetService service;

	@BeforeEach
	void setUp() {
		service = build("dummy-workspace");
	}

	private PowerBiDatasetService build(String workspaceId) {
		RestClient.Builder builder = RestClient.builder().baseUrl(BASE);
		server = MockRestServiceServer.bindTo(builder).build();
		PowerBiProperties props = new PowerBiProperties("t", "c", "s", workspaceId, "ds1", BASE, "a", "sc");
		return new PowerBiDatasetService(builder.build(), props, new ObjectMapper());
	}

	@Test
	void sendsDaxQueryWithIncludeNulls() {
		server.expect(requestTo(URL_WS))
				.andExpect(method(HttpMethod.POST))
				.andExpect(jsonPath("$.queries[0].query").value("EVALUATE T"))
				.andExpect(jsonPath("$.serializerSettings.includeNulls").value(true))
				.andRespond(withSuccess(RESPONSE, MediaType.APPLICATION_JSON));

		service.executeRawQuery("EVALUATE T");
		server.verify();
	}

	@Test
	void rejectsBlankWorkspaceId() {
		assertThatThrownBy(() -> build(""))
				.isInstanceOf(IllegalStateException.class)
				.hasMessageContaining("PBI_WORKSPACE_ID");
	}

	@Test
	void expandsWorkspaceAndDatasetInUri() {
		server.expect(requestTo(URL_WS))
				.andRespond(withSuccess(RESPONSE, MediaType.APPLICATION_JSON));

		assertThat(service.executeRawQuery("q")).hasSize(1);
		server.verify();
	}

	@Test
	void parsesRawRowsKeepingBrackets() {
		server.expect(requestTo(URL_WS))
				.andRespond(withSuccess(RESPONSE, MediaType.APPLICATION_JSON));

		List<Map<String, Object>> rows = service.executeRawQuery("q");
		assertThat(rows).hasSize(1);
		assertThat(rows.getFirst()).containsEntry("[ID]", 1).containsEntry("[Nombre]", "Obra A");
	}

	@Test
	void mapsTypedRowsIgnoringUnknownColumns() {
		server.expect(requestTo(URL_WS))
				.andRespond(withSuccess(RESPONSE, MediaType.APPLICATION_JSON));

		assertThat(service.executeQuery("q", TestRow.class)).containsExactly(new TestRow(1, "Obra A"));
	}

	@Test
	void returnsEmptyListWhenNoTables() {
		server.expect(requestTo(URL_WS))
				.andRespond(withSuccess("{\"results\":[{\"tables\":[]}]}", MediaType.APPLICATION_JSON));

		assertThat(service.executeRawQuery("q")).isEmpty();
	}

	@Test
	void wrapsHttpErrors() {
		for (HttpStatus status : List.of(HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN,
				HttpStatus.INTERNAL_SERVER_ERROR)) {
			service = build("dummy-workspace");
			server.expect(requestTo(URL_WS))
					.andRespond(withStatus(status).contentType(MediaType.APPLICATION_JSON).body("{\"e\":\"x\"}"));

			assertThatThrownBy(() -> service.executeRawQuery("q"))
					.isInstanceOf(PowerBiApiException.class)
					.hasMessageContaining("status=" + status.value())
					.hasMessageContaining("{\"e\":\"x\"}");
		}
	}
}
