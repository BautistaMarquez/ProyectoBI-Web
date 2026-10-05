package com.bi.analytics.service;

import java.net.MalformedURLException;
import java.util.Collections;

import org.springframework.stereotype.Service;

import com.bi.analytics.config.PowerBiProperties;
import com.microsoft.aad.msal4j.ClientCredentialFactory;
import com.microsoft.aad.msal4j.ClientCredentialParameters;
import com.microsoft.aad.msal4j.ConfidentialClientApplication;
import com.microsoft.aad.msal4j.IConfidentialClientApplication;

@Service
public class PowerBiAuthService {

	private final PowerBiProperties properties;
	private final IConfidentialClientApplication application;

	public PowerBiAuthService(PowerBiProperties properties) {
		this.properties = properties;
		try {
			this.application = ConfidentialClientApplication
					.builder(properties.clientId(), ClientCredentialFactory.createFromSecret(properties.clientSecret()))
					.authority(properties.authority())
					.build();
		} catch (MalformedURLException e) {
			throw new PowerBiAuthException("Authority de Microsoft Entra ID inválida: " + properties.authority(), e);
		}
	}

	public String getAccessToken() {
		try {
			return application
					.acquireToken(ClientCredentialParameters.builder(Collections.singleton(properties.scope())).build())
					.join()
					.accessToken();
		} catch (RuntimeException e) {
			throw new PowerBiAuthException("No se pudo obtener el token de acceso de Power BI vía MSAL4J", e);
		}
	}
}
