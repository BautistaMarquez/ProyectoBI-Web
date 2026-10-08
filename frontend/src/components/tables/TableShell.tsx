import type { ReactNode } from 'react'
import { paginationBar, paginationBtn } from './tableStyles'

export function TableShell({ toolbar, children, page, pages, onPage }: {
  toolbar?: ReactNode
  children: ReactNode
  page: number
  pages: number
  onPage: (p: number) => void
}) {
  const btn = paginationBtn
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="h-0.5 w-full bg-gradient-siig" />
      {toolbar}
      <div className="max-h-[32rem] overflow-auto">
        <table className="min-w-full">{children}</table>
      </div>
      <div className={paginationBar}>
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
