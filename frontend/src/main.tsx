import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MsalProvider } from '@azure/msal-react'
import { EventType, type AuthenticationResult } from '@azure/msal-browser'
import { pca } from './config/authConfig'
import './index.css'
import App from './App.tsx'

// Fetch-All & Filter-Client: datasets are cached for 30 minutes.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
    },
  },
})

async function bootstrap() {
  await pca.initialize()
  const result = await pca.handleRedirectPromise()
  const account = result?.account ?? pca.getActiveAccount() ?? pca.getAllAccounts()[0]
  if (account) pca.setActiveAccount(account)

  pca.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
      pca.setActiveAccount((event.payload as AuthenticationResult).account)
    }
  })

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <MsalProvider instance={pca}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </MsalProvider>
    </StrictMode>,
  )
}

void bootstrap()
