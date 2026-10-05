import { useMsal } from '@azure/msal-react'
import { ALLOWED_DOMAIN } from '../../config/authConfig'

export default function UnauthorizedDomainView() {
  const { instance } = useMsal()

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 text-center shadow">
        <h1 className="mb-2 text-xl font-semibold text-red-700">Acceso restringido</h1>
        <p className="mb-6 text-sm text-slate-600">
          Esta aplicación sólo está disponible para cuentas del dominio {ALLOWED_DOMAIN}.
        </p>
        <button
          type="button"
          onClick={() => void instance.logoutRedirect()}
          className="w-full rounded bg-slate-700 px-4 py-2 font-medium text-white hover:bg-slate-800"
        >
          Desconectarse
        </button>
      </div>
    </div>
  )
}
