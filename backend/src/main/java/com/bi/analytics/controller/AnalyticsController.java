package com.bi.analytics.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bi.analytics.domain.CertificadoMasterRecord;
import com.bi.analytics.domain.ObraResumenRecord;
import com.bi.analytics.service.AnalyticsService;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

	private final AnalyticsService analyticsService;

	public AnalyticsController(AnalyticsService analyticsService) {
		this.analyticsService = analyticsService;
	}

	@GetMapping("/certificados-master")
	public ResponseEntity<List<CertificadoMasterRecord>> getCertificadosMaster() {
		return ResponseEntity.ok(analyticsService.getCertificadosMaster());
	}

	@GetMapping("/obras-resumen")
	public ResponseEntity<List<ObraResumenRecord>> getObrasResumen() {
		return ResponseEntity.ok(analyticsService.getObrasResumen());
	}

	@PostMapping("/cache/evict")
	public ResponseEntity<Void> evictCache() {
		analyticsService.evictAnalyticsCache();
		return ResponseEntity.noContent().build();
	}
}
