package com.bi.analytics.config;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestClient;

import com.bi.analytics.service.PowerBiAuthService;

@Configuration
public class PowerBiClientConfig {

	@Bean
	public ObjectMapper objectMapper() {
		return new ObjectMapper()
				.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
				.enable(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES);
	}

	@Bean
	public RestClient powerBiRestClient(PowerBiProperties properties, PowerBiAuthService authService) {
		return RestClient.builder()
				.baseUrl(properties.apiUrl())
				.defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
				.defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
				.requestInterceptor((request, body, execution) -> {
					request.getHeaders().set(HttpHeaders.AUTHORIZATION, "Bearer " + authService.getAccessToken());
					return execution.execute(request, body);
				})
				.build();
	}
}
