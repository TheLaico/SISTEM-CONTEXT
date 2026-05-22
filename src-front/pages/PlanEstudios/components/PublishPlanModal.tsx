// src/pages/PlanEstudios/components/PublishPlanModal.tsx
import React from 'react'

interface Props {
  isOpen: boolean
  careerName: string
  planName?: string
  totalSubjects: number
  publishYear: number
  onYearChange: (year: number) => void
  onConfirm: () => void
  onCancel: () => void
  loadingAction?: boolean
  // props retrocompatibles (ignoradas silenciosamente)
  currentYear?: number
}

const PublishPlanModal: React.FC<Props> = ({
  isOpen,
  careerName,
  planName,
  totalSubjects,
  publishYear,
  onYearChange,
  onConfirm,
  onCancel,
  loadingAction,
}) => {
  if (!isOpen) return null

  const canPublish = totalSubjects > 0
  const currentYear = new Date().getFullYear()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl dark:bg-boxdark">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-strokedark">
          <h2 className="text-base font-semibold text-black dark:text-white">Publicar plan de estudios</h2>
          <button type="button" onClick={onCancel} className="text-body hover:text-black dark:hover:text-white">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          {/* Info */}
          <div className="rounded-lg border border-stroke bg-gray-2 px-4 py-3 dark:border-strokedark dark:bg-meta-4">
            <p className="text-xs text-body dark:text-bodydark">Carrera</p>
            <p className="text-sm font-medium text-black dark:text-white">{careerName || '—'}</p>
            {planName && (
              <>
                <p className="mt-2 text-xs text-body dark:text-bodydark">Plan</p>
                <p className="text-sm font-medium text-black dark:text-white">{planName}</p>
              </>
            )}
          </div>

          {/* Año */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-black dark:text-white">
              Año de vigencia
            </label>
            <input
              type="number"
              min={currentYear}
              value={publishYear}
              onChange={(e) => onYearChange(Number(e.target.value))}
              className="w-full rounded-lg border border-stroke px-3 py-2.5 text-sm outline-none transition focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
            />
          </div>

          {/* Validación: asignaturas */}
          {!canPublish ? (
            <div className="flex items-start gap-2 rounded-lg bg-danger bg-opacity-10 px-3 py-3 text-sm text-danger">
              <svg className="mt-0.5 h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              El plan debe tener al menos una asignatura para poder publicarse.
            </div>
          ) : (
            <div className="space-y-2 text-sm text-body dark:text-bodydark">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-meta-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {totalSubjects} asignatura{totalSubjects !== 1 ? 's' : ''} en el plan
              </div>
              <div className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Este plan solo aplica a nuevas cohortes. Los estudiantes ya matriculados no serán afectados.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-stroke px-6 py-4 dark:border-strokedark">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-black dark:border-strokedark dark:text-white"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!canPublish || loadingAction}
            className="inline-flex items-center gap-2 rounded-lg bg-success px-4 py-2 text-sm font-medium text-white transition hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingAction && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
            Publicar plan
          </button>
        </div>
      </div>
    </div>
  )
}

export default PublishPlanModal