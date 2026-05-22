// src/pages/PlanEstudios/components/EditPlanModal.tsx
import React, { useEffect, useState } from 'react'
import { Career } from '../../../models/Career'
import { StudyPlan } from '../../../models/StudyPlan'
import { studyPlanService } from '../../../services/studyPlanService'
import toast from 'react-hot-toast'

interface Props {
  isOpen: boolean
  plan: StudyPlan | null
  careers: Career[]
  onUpdated: () => void
  onCancel: () => void
}

interface FormState {
  name: string
  year: number
  career_id: string
  suggested_semester: number
}

const EditPlanModal: React.FC<Props> = ({ isOpen, plan, careers, onUpdated, onCancel }) => {
  const [form, setForm] = useState<FormState>({
    name: '',
    year: new Date().getFullYear(),
    career_id: '',
    suggested_semester: 1,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  // Sincroniza el form cuando cambia el plan recibido
  useEffect(() => {
    if (plan) {
      setForm({
        name: plan.name ?? '',
        year: plan.year ?? new Date().getFullYear(),
        career_id: String(plan.career_id ?? ''),
        suggested_semester: plan.suggested_semester ?? 1,
      })
      setErrors({})
    }
  }, [plan])

  if (!isOpen || !plan) return null

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!form.name.trim()) newErrors.name = 'El nombre es obligatorio'
    if (!form.career_id) newErrors.career_id = 'Selecciona una carrera'
    if (!form.year || form.year < 2000 || form.year > 2100)
      newErrors.year = 'Ingresa un año válido (2000–2100)'
    if (!form.suggested_semester || form.suggested_semester < 1 || form.suggested_semester > 12)
      newErrors.suggested_semester = 'El semestre debe estar entre 1 y 12'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      // PUT /api/academic/study-plans/<id>
      // Body acepta: career_id, name, year, suggested_semester
      await studyPlanService.updateStudyPlan(String(plan.id), {
        name: form.name.trim(),
        year: form.year,
        career_id: form.career_id,
        suggested_semester: form.suggested_semester,
      })
      toast.success('Plan actualizado correctamente')
      onUpdated()
    } catch (err: any) {
      toast.error(err?.message || 'No se pudo actualizar el plan')
    } finally {
      setLoading(false)
    }
  }

  const field = (label: string, key: keyof FormState, content: React.ReactNode) => (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-black dark:text-white">
        {label} <span className="text-danger">*</span>
      </label>
      {content}
      {errors[key] && <p className="mt-1 text-xs text-danger">{errors[key]}</p>}
    </div>
  )

  const inputClass = (key: keyof FormState) =>
    `w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-primary dark:bg-meta-4 dark:text-white ${
      errors[key] ? 'border-danger' : 'border-stroke dark:border-strokedark'
    }`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl dark:bg-boxdark">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-strokedark">
          <h2 className="text-base font-semibold text-black dark:text-white">
            Editar plan de estudios
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-body hover:text-black dark:text-bodydark dark:hover:text-white"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 px-6 py-5">
          {/* Aviso si ya está publicado */}
          {plan.is_published && (
            <div className="flex items-center gap-2 rounded-lg bg-warning bg-opacity-10 px-3 py-2 text-xs text-warning">
              <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Este plan ya está publicado. Los cambios solo afectan metadatos, no las cohortes activas.
            </div>
          )}

          {/* Nombre */}
          {field(
            'Nombre del plan',
            'name',
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Ej: Plan de estudios 2025"
              className={inputClass('name')}
            />
          )}

          {/* Carrera */}
          {field(
            'Carrera',
            'career_id',
            <select
              value={form.career_id}
              onChange={(e) => setForm((prev) => ({ ...prev, career_id: e.target.value }))}
              className={inputClass('career_id')}
            >
              <option value="">Selecciona una carrera</option>
              {careers.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.name}
                </option>
              ))}
            </select>
          )}

          {/* Año */}
          {field(
            'Año / Versión',
            'year',
            <input
              type="number"
              value={form.year}
              min={2000}
              max={2100}
              onChange={(e) => setForm((prev) => ({ ...prev, year: Number(e.target.value) }))}
              className={inputClass('year')}
            />
          )}

          {/* Semestre sugerido */}
          {field(
            'Semestre sugerido',
            'suggested_semester',
            <input
              type="number"
              value={form.suggested_semester}
              min={1}
              max={12}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, suggested_semester: Number(e.target.value) }))
              }
              className={inputClass('suggested_semester')}
            />
          )}
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
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditPlanModal