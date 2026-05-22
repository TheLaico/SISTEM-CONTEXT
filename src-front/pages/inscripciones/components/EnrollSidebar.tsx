// src/pages/Inscripciones/components/EnrollSidebar.tsx
import React from 'react'
import { Link } from 'react-router-dom'

export type EnrollView = 'new' | 'active' | 'cancelled' | 'history'

interface Props {
  activeView: EnrollView
  onChangeView: (view: EnrollView) => void
  activeCount?: number
  cancelledCount?: number
}

const NAV_ITEMS: {
  view: EnrollView
  label: string
  icon: React.ReactNode
}[] = [
  {
    view: 'new',
    label: 'Nueva inscripción',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    view: 'active',
    label: 'Inscripciones activas',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    view: 'cancelled',
    label: 'Canceladas',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    view: 'history',
    label: 'Historial',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

const EnrollSidebar: React.FC<Props> = ({
  activeView,
  onChangeView,
  activeCount,
  cancelledCount,
}) => {
  return (
    <aside className="hidden w-56 flex-shrink-0 border-r border-stroke bg-white dark:border-strokedark dark:bg-boxdark lg:block">
      <div className="p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-body dark:text-bodydark">
          Inscripciones
        </p>
        <nav className="space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.view}
              type="button"
              onClick={() => onChangeView(item.view)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition ${
                activeView === item.view
                  ? 'bg-primary bg-opacity-10 text-primary'
                  : 'text-black hover:bg-gray dark:text-white dark:hover:bg-meta-4'
              }`}
            >
              <span className="flex items-center gap-2.5">
                {item.icon}
                {item.label}
              </span>
              {item.view === 'active' && activeCount !== undefined && (
                <span className="rounded-full bg-meta-3 bg-opacity-10 px-2 py-0.5 text-xs font-semibold text-meta-3">
                  {activeCount}
                </span>
              )}
              {item.view === 'cancelled' && cancelledCount !== undefined && (
                <span className="rounded-full bg-danger bg-opacity-10 px-2 py-0.5 text-xs font-semibold text-danger">
                  {cancelledCount}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  )
}

export default EnrollSidebar