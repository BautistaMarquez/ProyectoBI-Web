import type { ReactNode } from 'react'

export function TableShell({ toolbar, children, page, pages, onPage }: {
  toolbar?: ReactNode
  children: ReactNode
  page: number
  pages: number
  onPage: (p: number) => void
}) {
  const btn =
    'rounded-md border border-slate-700 bg-slate-800 px-3 py-1 text-slate-200 hover:bg-slate-700 disabled:opacity-50'
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-sm">
      <div className="h-0.5 w-full bg-gradient-siig" />
      {toolbar}
      <div className="max-h-[32rem] overflow-auto">
        <table className="min-w-full">{children}</table>
      </div>
      <div className="flex items-center justify-between border-t border-slate-800 px-3 py-2 text-sm text-slate-400">
        <span>
          Página {page + 1} de {pages}
        </span>
        <div className="flex gap-2">
          <button type="button" disabled={page === 0} onClick={() => onPage(page - 1)} className={btn}>
            Anterior
          </button>
          <button type="button" disabled={page >= pages - 1} onClick={() => onPage(page + 1)} className={btn}>
            Siguiente
          </button>
        </div>
      </div>
    </div>
  )
}
