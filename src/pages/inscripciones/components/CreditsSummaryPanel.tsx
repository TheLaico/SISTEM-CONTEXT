// src/pages/Inscripciones/components/CreditsSummaryPanel.tsx
import React from 'react'
import { EnrollmentValidationError } from '../../../types/enrollmentFlow'

interface Props {
  creditsSelected: number
  creditsLimit: number
  selectedCount: number
  errors: EnrollmentValidationError[]
  onConfirm: () => void
  onReset: () => void
  disabled?: boolean
  activeSemesterName?: string
  activeSemesterStart?: string
  activeSemesterEnd?: string
}

const MAX = 18 // según spec ejemplo

const CreditsSummaryPanel: React.FC<Props> = ({
  creditsSelected,
  creditsLimit,
  selectedCount,
  errors,
  onConfirm,
  onReset,
  disabled,
  activeSemesterName,
  activeSemesterStart,
  activeSemesterEnd,
}) => {
  const remaining = Math.max(0, creditsLimit - creditsSelected)
  const exceeded = creditsSelected > creditsLimit
  const pct = Math.min(100, (creditsSelected / creditsLimit) * 100)

  const criticalErrors = errors.filter((e) => e.severity === 'error')
  const warnings = errors.filter((e) => e.severity === 'warning')

  const canConfirm = !disabled && selectedCount > 0 && !exceeded && criticalErrors.length === 0

  return (
    <div className="space-y-4">
      {/* Semestre activo */}
      {activeSemesterName && (
        <div className="rounded-2xl border border-stroke bg-white p-4 shadow-card dark:border-strokedark dark:bg-boxdark">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-black dark:text-white">Semestre activo</h4>
            <span className="rounded-full bg-meta-3 bg-opacity-10 px-2.5 py-0.5 text-xs font-semibold text-meta-3">Activo</span>
          </div>
          <p className="text-sm font-medium text-black dark:text-white">{activeSemesterName}</p>
          {activeSemesterStart && (
            <p className="mt-1 text-xs text-body dark:text-bodydark">
              {new Date(activeSemesterStart).toLocaleDateString('es-CO')}
              {activeSemesterEnd && ` — ${new Date(activeSemesterEnd).toLocaleDateString('es-CO')}`}
            </p>
          )}
        </div>
      )}

      {/* Resumen de créditos */}
      <div className="rounded-2xl border border-stroke bg-white p-4 shadow-card dark:border-strokedark dark:bg-boxdark">
        <h4 className="mb-3 text-sm font-semibold text-black dark:text-white">Resumen de créditos</h4>

        {/* Barra de progreso */}
        <div className="mb-3">
          <div className="mb-1.5 flex justify-between text-xs text-body dark:text-bodydark">
            <span>Créditos seleccionados</span>
            <span className={`font-semibold ${exceeded ? 'text-danger' : 'text-black dark:text-white'}`}>
              {creditsSelected} / {creditsLimit}
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-stroke dark:bg-strokedark">
            <div
              className={`h-full rounded-full transition-all ${exceeded ? 'bg-danger' : pct > 80 ? 'bg-warning' : 'bg-meta-3'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-body dark:text-bodydark">Créditos actuales</span>
            <span className="font-semibold text-black dark:text-white">{creditsSelected}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-body dark:text-bodydark">Límite permitido</span>
            <span className="font-semibold text-black dark:text-white">{creditsLimit}</span>
          </div>
          <div className="flex items-center justify-between border-t border-stroke pt-2 dark:border-strokedark">
            <span className="text-body dark:text-bodydark">Restantes</span>
            <span className={`font-bold ${exceeded ? 'text-danger' : 'text-meta-3'}`}>
              {exceeded ? `−${creditsSelected - creditsLimit}` : remaining}
            </span>
          </div>
        </div>

        {exceeded && (
          <div className="mt-3 rounded-lg bg-danger bg-opacity-10 px-3 py-2 text-xs text-danger">
            Los créditos exceden el límite. Deselecciona algún grupo.
          </div>
        )}
      </div>

      {/* Validaciones en tiempo real */}
      <div className="rounded-2xl border border-stroke bg-white p-4 shadow-card dark:border-strokedark dark:bg-boxdark">
        <h4 className="mb-3 text-sm font-semibold text-black dark:text-white">Validaciones</h4>
        <div className="space-y-2">
          <ValidationRow
            ok={!exceeded}
            label="Créditos dentro del límite"
          />
          <ValidationRow
            ok={criticalErrors.filter((e) => e.type === 'NO_CAPACITY').length === 0}
            label="Grupos con cupo disponible"
          />
          <ValidationRow
            ok={criticalErrors.filter((e) => e.type === 'ALREADY_ENROLLED').length === 0}
            label="Sin inscripciones duplicadas"
          />
          <ValidationRow
            ok={criticalErrors.filter((e) => e.type === 'NO_ACTIVE_REGISTRATION').length === 0}
            label="Matrícula activa"
          />
        </div>

        {warnings.length > 0 && (
          <div className="mt-3 space-y-1.5">
            {warnings.map((w, i) => (
              <div key={i} className="flex items-start gap-2 rounded-lg bg-warning bg-opacity-10 px-2.5 py-2 text-xs text-warning">
                <svg className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {w.message}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botones */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={onConfirm}
          disabled={!canConfirm}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Confirmar inscripción ({selectedCount} grupo{selectedCount !== 1 ? 's' : ''})
        </button>
        <button
          type="button"
          onClick={onReset}
          className="w-full rounded-lg border border-stroke px-4 py-2.5 text-sm font-medium text-black transition hover:bg-gray dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
        >
          Limpiar selección
        </button>
      </div>
    </div>
  )
}

const ValidationRow: React.FC<{ ok: boolean; label: string }> = ({ ok, label }) => (
  <div className="flex items-center gap-2 text-xs">
    {ok ? (
      <svg className="h-4 w-4 flex-shrink-0 text-meta-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ) : (
      <svg className="h-4 w-4 flex-shrink-0 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    )}
    <span className={ok ? 'text-black dark:text-white' : 'text-danger'}>{label}</span>
  </div>
)

export default CreditsSummaryPanel