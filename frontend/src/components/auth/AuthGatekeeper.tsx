import type { ReactNode } from 'react'
import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import { ALLOWED_DOMAIN } from '../../config/authConfig'
import LoginView from './LoginView'
import UnauthorizedDomainView from './UnauthorizedDomainView'

const endsWithDomain = (value: unknown): boolean =>
  typeof value === 'string' && value.toLowerCase().endsWith(ALLOWED_DOMAIN)

export default function AuthGatekeeper({ children }: { children: ReactNode }) {
  const { instance, accounts } = useMsal()
  const isAuthenticated = useIsAuthenticated()

  if (!isAuthenticated) return <LoginView />

  const account = instance.getActiveAccount() ?? accounts[0]
  const claims = account?.idTokenClaims
  const validDomain =
    !!account &&
    (endsWithDomain(account.username) ||
      endsWithDomain(claims?.preferred_username) ||
      endsWithDomain(claims?.email))

  if (!validDomain) return <UnauthorizedDomainView />

  return <>{children}</>
}
