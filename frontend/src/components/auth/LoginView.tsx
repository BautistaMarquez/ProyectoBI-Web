import { useMsal } from '@azure/msal-react'
import { loginRequest } from '../../config/authConfig'
import { APP_NAME, APP_SHORT_NAME } from '../../config/navigation'

function MicrosoftLogo() {
  return (
    <svg aria-hidden="true" viewBox="0 0 21 21" className="h-5 w-5 shrink-0">
      <rect x="1" y="1" width="9" height="9" fill="#F25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
      <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
      <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
    </svg>
  )
}

export default function LoginView() {
  const { instance } = useMsal()

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-magenta/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cyan/20 blur-3xl"
      />
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-siig" />

      <main className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/95 p-10 text-center shadow-2xl backdrop-blur-md dark:bg-slate-900/90">
        <h1 className="bg-gradient-to-r from-magenta via-purple to-cyan bg-clip-text text-5xl font-extrabold tracking-tight text-transparent">
          {APP_SHORT_NAME}
        </h1>
        <p className="mt-3 text-base font-semibold text-slate-800 dark:text-slate-100">{APP_NAME}</p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Ministerio de Infraestructura y Servicios Públicos
        </p>

        <div className="my-8 h-px bg-gradient-siig opacity-40" />

        <button
          type="button"
          onClick={() => void instance.loginRedirect(loginRequest)}
          className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:bg-slate-800 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 active:scale-[0.98]"
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <span className="relative flex h-7 w-7 items-center justify-center rounded bg-white">
            <MicrosoftLogo />
          </span>
          <span className="relative">Iniciar Sesión Institucional</span>
        </button>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Autenticación con Microsoft Entra ID</p>

        <p className="mt-8 border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          Acceso restringido exclusivamente a cuentas{' '}
          <span className="font-semibold text-slate-700 dark:text-slate-200">@minfra.gba.gob.ar</span>
        </p>
      </main>
    </div>
  )
}
