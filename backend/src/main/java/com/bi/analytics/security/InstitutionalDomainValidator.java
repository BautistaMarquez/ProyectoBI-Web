package com.bi.analytics.security;

import java.util.Locale;

import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;

/**
 * Accepts only tokens whose {@code preferred_username} or {@code email} claim
 * ends with the institutional domain suffix.
 */
public class InstitutionalDomainValidator implements OAuth2TokenValidator<Jwt> {

    public static final String DOMAIN_SUFFIX = "@minfra.gba.gob.ar";

    private static final OAuth2Error INVALID_DOMAIN = new OAuth2Error(
            "invalid_token", "El token no pertenece al dominio institucional " + DOMAIN_SUFFIX, null);

    @Override
    public OAuth2TokenValidatorResult validate(Jwt jwt) {
        if (hasInstitutionalDomain(jwt.getClaimAsString("preferred_username"))
                || hasInstitutionalDomain(jwt.getClaimAsString("email"))) {
            return OAuth2TokenValidatorResult.success();
        }
        return OAuth2TokenValidatorResult.failure(INVALID_DOMAIN);
    }

    private static boolean hasInstitutionalDomain(String value) {
        return value != null && value.toLowerCase(Locale.ROOT).endsWith(DOMAIN_SUFFIX);
    }
}
