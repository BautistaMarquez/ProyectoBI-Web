import { PublicClientApplication, type Configuration } from '@azure/msal-browser'

export const ALLOWED_DOMAIN = '@minfra.gba.gob.ar'

export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID}`,
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage',
  },
}

export const loginRequest = {
  scopes: ['openid', 'profile', 'email'],
}

export const tokenRequest = {
  scopes: [`api://${import.meta.env.VITE_BACKEND_CLIENT_ID}/access_as_user`],
}

export const pca = new PublicClientApplication(msalConfig)
