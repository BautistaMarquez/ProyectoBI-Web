package com.bi.analytics.infrastructure.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.bi.analytics.infrastructure.powerbi.exception.PowerBiApiException;
import com.bi.analytics.service.PowerBiAuthException;

@RestControllerAdvice
public class GlobalExceptionHandler {

	private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

	@ExceptionHandler(PowerBiApiException.class)
	public ResponseEntity<ProblemDetail> handlePowerBiApi(PowerBiApiException ex) {
		return problem(HttpStatus.BAD_GATEWAY, "Error en API de Power BI", ex.getMessage());
	}

	@ExceptionHandler(PowerBiAuthException.class)
	public ResponseEntity<ProblemDetail> handlePowerBiAuth(PowerBiAuthException ex) {
		return problem(HttpStatus.BAD_GATEWAY, "Error de Autenticación Entra ID", ex.getMessage());
	}

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<ProblemDetail> handleIllegalArgument(IllegalArgumentException ex) {
		log.error("Argumento inválido en endpoint REST: ", ex);
		return problem(HttpStatus.BAD_REQUEST, "Solicitud Inválida", detailOf(ex));
	}

	@ExceptionHandler(IllegalStateException.class)
	public ResponseEntity<ProblemDetail> handleIllegalState(IllegalStateException ex) {
		log.error("Estado inválido o configuración faltante: ", ex);
		return problem(HttpStatus.INTERNAL_SERVER_ERROR, "Error de Configuración", detailOf(ex));
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ProblemDetail> handleGenericException(Exception ex) {
		log.error("Error no controlado en endpoint REST: ", ex);
		return problem(HttpStatus.INTERNAL_SERVER_ERROR, "Error Interno del Servidor", detailOf(ex));
	}

	private static String detailOf(Exception ex) {
		return ex.getMessage() != null ? ex.getMessage() : ex.getClass().getName();
	}

	private ResponseEntity<ProblemDetail> problem(HttpStatus status, String title, String detail) {
		ProblemDetail body = ProblemDetail.forStatusAndDetail(status, detail);
		body.setTitle(title);
		return ResponseEntity.status(status).contentType(MediaType.APPLICATION_PROBLEM_JSON).body(body);
	}
}
