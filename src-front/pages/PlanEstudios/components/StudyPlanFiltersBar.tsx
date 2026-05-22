// src/pages/PlanEstudios/components/StudyPlanFiltersBar.tsx
import React from 'react'
import { Career } from '../../../models/Career'
import { AdminStudyPlanFilters, PlanStatus } from '../../../hooks/useAdminStudyPlans'

interface Props {
  careers: Career[]
  availableYears: string[]
  filters: AdminStudyPlanFilters
  onFilterChange: (key: keyof AdminStudyPlanFilters, value: string) => void
  onCreatePlan: () => void
  onNewVersion: () => void
}

const STATUS_OPTIONS: { value: PlanStatus; label: string }[] = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'borrador', label: 'Borrador' },
  { value: 'publicado', label: 'Publicado' },
  { value: 'archivado', label: 'Archivado' },
]

const StudyPlanFiltersBar: React.FC<Props> = ({
  careers,
  availableYears,
  filters,
  onFilterChange,
  onCreatePlan,
  onNewVersion,
}) => {
  return (
    <div className="mb-6 rounded-2xl border border-stroke bg-white p-5 shadow-card dark:border-strokedark dark:bg-boxdark">
      {/* Título y botones */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-title-md font-bold text-black dark:text-white">
            Planes de Estudio
          </h1>
          <p className="mt-1 text-sm text-body dark:text-bodydark">
            Gestiona los planes académicos por carrera y versión.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onNewVersion}
            className="inline-flex items-center gap-2 rounded-lg border border-stroke bg-white px-4 py-2 text-sm font-medium text-black transition hover:border-primary hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Nueva versión
          </button>

          <button
            type="button"
            onClick={onCreatePlan}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-opacity-90"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Crear plan
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Filtro: Carrera */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-body dark:text-bodydark">
            Carrera
          </label>
          <select
            value={filters.careerId}
            onChange={(e) => onFilterChange('careerId', e.target.value)}
            className="w-full rounded-lg border border-stroke bg-white px-3 py-2 text-sm text-black outline-none transition focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
          >
            <option value="">Todas las carreras</option>
            {careers.map((career) => (
              <option key={career.id} value={String(career.id)}>
                {career.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro: Año/Versión */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-body dark:text-bodydark">
            Año / Versión
          </label>
          <select
            value={filters.yearVersion}
            onChange={(e) => onFilterChange('yearVersion', e.target.value)}
            className="w-full rounded-lg border border-stroke bg-white px-3 py-2 text-sm text-black outline-none transition focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
          >
            <option value="">Todos los años</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro: Estado */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-body dark:text-bodydark">
            Estado
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value as PlanStatus)}
            className="w-full rounded-lg border border-stroke bg-white px-3 py-2 text-sm text-black outline-none transition focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default StudyPlanFiltersBar