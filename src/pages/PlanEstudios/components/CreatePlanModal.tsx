// src/pages/PlanEstudios/components/CreatePlanModal.tsx
import React, { useState } from 'react'
import { Career } from '../../../models/Career'

interface Props {
  isOpen: boolean
  careers: Career[]
  loading?: boolean
  onConfirm: (payload: { career_id: string; name: string; year: number }) => void
  onCancel: () => void
  title?: string // "Crear plan" o "Nueva versión"
}

const CreatePlanModal: React.FC<Props> = ({
  isOpen,
  careers,
  loading,
  onConfirm,
  onCancel,
  title = 'Crear plan de estudios',
}) => {
  const currentYear = new Date().getFullYear()
  const [careerId, setCareerId] = useState('')
  const [name, setName] = useState('')
  const [year, setYear] = useState(currentYear)
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!careerId) newErrors.careerId = 'Selecciona una carrera'
    if (!name.trim()) newErrors.name = 'Ingresa el nombre del plan'
    if (!year || year < 2000) newErrors.year = 'Ingresa un año válido'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    onConfirm({ career_id: careerId, name: name.trim(), year })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl dark:bg-boxdark">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-strokedark">
          <h2 className="text-base font-semibold text-black dark:text-white">{title}</h2>
          <button type="button" onClick={onCancel} className="text-body hover:text-black dark:text-bodydark dark:hover:text-white">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 px-6 py-5">
          {/* Estado inicial informativo */}
          <div className="flex items-center gap-2 rounded-lg bg-warning bg-opacity-10 px-3 py-2 text-xs text-warning">
            <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            El plan se creará en estado <strong>Borrador</strong>
          </div>

          {/* Carrera */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-black dark:text-white">
              Carrera <span className="text-danger">*</span>
            </label>
            <select
              value={careerId}
              onChange={(e) => setCareerId(e.target.value)}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-primary dark:bg-meta-4 dark:text-white ${
                errors.careerId ? 'border-danger' : 'border-stroke dark:border-strokedark'
              }`}
            >
              <option value="">Selecciona una carrera</option>
              {careers.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.careerId && <p className="mt-1 text-xs text-danger">{errors.careerId}</p>}
          </div>

          {/* Nombre del plan */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-black dark:text-white">
              Nombre del plan <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Plan de estudios 2025"
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-primary dark:bg-meta-4 dark:text-white ${
                errors.name ? 'border-danger' : 'border-stroke dark:border-strokedark'
              }`}
            />
            {errors.name && <p className="mt-1 text-xs text-danger">{errors.name}</p>}
          </div>

          {/* Año / Versión */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-black dark:text-white">
              Año / Versión <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              value={year}
              min={2000}
              max={2100}
              onChange={(e) => setYear(Number(e.target.value))}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-primary dark:bg-meta-4 dark:text-white ${
                errors.year ? 'border-danger' : 'border-stroke dark:border-strokedark'
              }`}
            />
            {errors.year && <p className="mt-1 text-xs text-danger">{errors.year}</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-stroke px-6 py-4 dark:border-strokedark">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-black transition hover:bg-gray dark:border-strokedark dark:text-white"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-opacity-90 disabled:opacity-60"
          >
            {loading && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            {title}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreatePlanModal