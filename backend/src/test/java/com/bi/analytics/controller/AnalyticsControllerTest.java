package com.bi.analytics.controller;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import org.springframework.security.oauth2.jwt.JwtDecoder;

import com.bi.analytics.infrastructure.powerbi.exception.PowerBiApiException;
import com.bi.analytics.infrastructure.rest.GlobalExceptionHandler;
import com.bi.analytics.service.AnalyticsService;
import org.springframework.context.annotation.Import;
import com.bi.analytics.config.SecurityConfig;
import com.bi.analytics.security.SecurityProblemSupport;

@WebMvcTest(AnalyticsController.class)
@Import({ GlobalExceptionHandler.class, SecurityConfig.class, SecurityProblemSupport.class })
class AnalyticsControllerTest {

	private static final RequestPostProcessor AUTH = jwt()
			.jwt(jwt -> jwt.claim("preferred_username", "operador@minfra.gba.gob.ar"));

	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private JwtDecoder jwtDecoder;

	@MockitoBean
	private AnalyticsService analyticsService;

	@Test
	void certificadosMasterReturnsJsonArray() throws Exception {
		when(analyticsService.getCertificadosMaster()).thenReturn(List.of());

		mockMvc.perform(get("/api/analytics/certificados-master").with(AUTH))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$").isArray());
	}

	@Test
	void obrasResumenReturnsJsonArray() throws Exception {
		when(analyticsService.getObrasResumen()).thenReturn(List.of());

		mockMvc.perform(get("/api/analytics/obras-resumen").with(AUTH))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$").isArray());
	}

	@Test
	void evictCacheReturnsNoContent() throws Exception {
		mockMvc.perform(post("/api/analytics/cache/evict").with(AUTH)).andExpect(status().isNoContent());

		verify(analyticsService).evictAnalyticsCache();
	}

	@Test
	void powerBiApiExceptionReturnsProblemDetail() throws Exception {
		when(analyticsService.getCertificadosMaster()).thenThrow(new PowerBiApiException("boom", null));

		mockMvc.perform(get("/api/analytics/certificados-master").with(AUTH))
				.andExpect(status().isBadGateway())
				.andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON))
				.andExpect(jsonPath("$.status").value(502))
				.andExpect(jsonPath("$.title").value("Error en API de Power BI"))
				.andExpect(jsonPath("$.detail").value("boom"));
	}

	@Test
	void genericExceptionExposesRealMessage() throws Exception {
		when(analyticsService.getCertificadosMaster()).thenThrow(new RuntimeException("fallo real"));

		mockMvc.perform(get("/api/analytics/certificados-master").with(AUTH))
				.andExpect(status().isInternalServerError())
				.andExpect(jsonPath("$.detail").value("fallo real"));
	}

	@Test
	void illegalArgumentReturnsBadRequest() throws Exception {
		when(analyticsService.getCertificadosMaster()).thenThrow(new IllegalArgumentException("falta X"));

		mockMvc.perform(get("/api/analytics/certificados-master").with(AUTH))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.detail").value("falta X"));
	}

	@Test
	void illegalStateReturnsServerErrorWithCause() throws Exception {
		when(analyticsService.getCertificadosMaster())
				.thenThrow(new IllegalStateException("falta AZURE_TENANT_ID"));

		mockMvc.perform(get("/api/analytics/certificados-master").with(AUTH))
				.andExpect(status().isInternalServerError())
				.andExpect(jsonPath("$.detail").value("falta AZURE_TENANT_ID"));
	}
}
