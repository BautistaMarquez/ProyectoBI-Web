package com.bi.analytics.security;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Instant;

import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.jwt.Jwt;

class InstitutionalDomainValidatorTest {

	private final InstitutionalDomainValidator validator = new InstitutionalDomainValidator();

	private static Jwt jwt(String claim, String value) {
		return Jwt.withTokenValue("t").header("alg", "none").claim(claim, value)
				.issuedAt(Instant.now()).expiresAt(Instant.now().plusSeconds(60)).build();
	}

	@Test
	void acceptsInstitutionalDomainCaseInsensitive() {
		assertThat(validator.validate(jwt("preferred_username", "Operador@MINFRA.gba.gob.ar")).hasErrors()).isFalse();
	}

	@Test
	void acceptsInstitutionalEmailClaim() {
		assertThat(validator.validate(jwt("email", "op@minfra.gba.gob.ar")).hasErrors()).isFalse();
	}

	@Test
	void rejectsExternalDomain() {
		assertThat(validator.validate(jwt("preferred_username", "user@gmail.com")).hasErrors()).isTrue();
	}
}
