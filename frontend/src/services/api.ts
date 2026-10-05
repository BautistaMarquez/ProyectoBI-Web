import { InteractionRequiredAuthError } from '@azure/msal-browser'
import { tokenRequest, pca } from '../config/authConfig'
import type { CertificadoMaster, ObraResumen, ProblemDetail } from '../types/analytics'

const BASE_URL = '/api/analytics'

export class ApiError extends Error {
  // Explicit field: parameter properties are not allowed by erasableSyntaxOnly.
  problem: ProblemDetail

  constructor(problem: ProblemDetail) {
    super(problem.detail || problem.title || 'Error en la petición analítica')
    this.name = 'ApiError'
    this.problem = problem
  }
}

async function toProblemDetail(response: Response): Promise<ProblemDetail> {
  try {
    const body = (await response.json()) as ProblemDetail
    return { status: response.status, ...body }
  } catch {
    return { title: response.statusText || 'Error de red', status: response.status }
  }
}

async function getAccessToken(): Promise<string> {
  const account = pca.getActiveAccount() ?? pca.getAllAccounts()[0]
  if (!account) {
    throw new ApiError({ title: 'No autenticado', status: 401 })
  }
  try {
    const result = await pca.acquireTokenSilent({ ...tokenRequest, account })
    return result.accessToken
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      await pca.acquireTokenRedirect({ ...tokenRequest, account })
    }
    throw new ApiError({ title: 'No se pudo obtener el token de acceso', status: 401 })
  }
}

async function request(path: string, init?: RequestInit): Promise<Response> {
  const token = await getAccessToken()
  const headers = new Headers(init?.headers)
  headers.set('Authorization', `Bearer ${token}`)
  const response = await fetch(`${BASE_URL}${path}`, { ...init, headers })
  if (!response.ok) {
    throw new ApiError(await toProblemDetail(response))
  }
  return response
}

export async function fetchCertificadosMaster(): Promise<CertificadoMaster[]> {
  const response = await request('/certificados-master')
  return response.json() as Promise<CertificadoMaster[]>
}

export async function fetchObrasResumen(): Promise<ObraResumen[]> {
  const response = await request('/obras-resumen')
  return response.json() as Promise<ObraResumen[]>
}

export async function evictAnalyticsCache(): Promise<void> {
  await request('/cache/evict', { method: 'POST' })
}
