// src/pages/PlanEstudios/components/AddSubjectToPlanModal.tsx
import React, { useState } from 'react'
import { Subject } from '../../../models/Subject'

interface Props {
  isOpen: boolean
  availableSubjects: Subject[]
  searchQuery: string
  onSearchChange: (q: string) => void
  loading?: boolean
  onConfirm: (payload: {
    subject_id: number
    suggested_semester: number
    credits: number
  }) => void
  onCancel: () => void
}

const AddSubjectToPlanModal: React.FC<Props> = ({
  isOpen,
  availableSubjects,
  searchQuery,
  onSearchChange,
  loading,
  onConfirm,
  onCancel,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('')
  const [semester, setSemester] = useState<number>(1)
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  // Comparación segura: todo como string
  const selectedSubject = availableSubjects.find(
    (s) => String(s.id) === selectedSubjectId
  )

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!selectedSubjectId) newErrors.subject = 'Selecciona una asignatura'
    if (!semester || semester < 1 || semester > 12)
      newErrors.semester = 'El semestre debe estar entre 1 y 12'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleConfirm = () => {
    if (!validate()) return
    if (!selectedSubject) return
    onConfirm({
      subject_id: Number(selectedSubject.id),
      suggested_semester: semester,
      credits: selectedSubject.credits,
    })
    // Reset
    setSelectedSubjectId('')
    setSemester(1)
    setErrors({})
  }

  const handleClose = () => {
    setSelectedSubjectId('')
    setSemester(1)
    setErrors({})
    onCancel()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
      <div className="flex w-full max-w-lg flex-col rounded-2xl bg-white shadow-xl dark:bg-boxdark">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-strokedark">
          <h2 className="text-base font-semibold text-black dark:text-white">
            Agregar asignatura al plan
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-body hover:text-black dark:hover:text-white"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          {/* Buscador */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-black dark:text-white">
              Buscar asignatura
            </label>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-body"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Busca por nombre o código..."
                className="w-full rounded-lg border border-stroke py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
              />
            </div>
          </div>

          {/* Select de asignatura */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-black dark:text-white">
              Asignatura <span className="text-danger">*</span>
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-primary dark:bg-meta-4 dark:text-white ${
                errors.subject ? 'border-danger' : 'border-stroke dark:border-strokedark'
              }`}
            >
              <option value="">Selecciona una asignatura</option>
              {availableSubjects.map((subject) => (
                <option key={subject.id} value={String(subject.id)}>
                  {subject.code} — {subject.name} ({subject.credits} cr.)
                </option>
              ))}
            </select>
            {errors.subject && (
              <p className="mt-1 text-xs text-danger">{errors.subject}</p>
            )}

            {/* Asignatura seleccionada */}
            {selectedSubject && (
              <div className="mt-2 flex items-center gap-2 rounded-lg bg-primary bg-opacity-5 px-3 py-2 text-xs text-primary">
                <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Seleccionada: <strong>{selectedSubject.name}</strong> — {selectedSubject.credits} créditos
              </div>
            )}
          </div>

          {/* Semestre sugerido */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-black dark:text-white">
              Semestre sugerido <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              min={1}
              max={12}
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value))}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-primary dark:bg-meta-4 dark:text-white ${
                errors.semester ? 'border-danger' : 'border-stroke dark:border-strokedark'
              }`}
            />
            {errors.semester && (
              <p className="mt-1 text-xs text-danger">{errors.semester}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-stroke px-6 py-4 dark:border-strokedark">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-black dark:border-strokedark dark:text-white"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-60"
          >
            {loading && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            Agregar al plan
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddSubjectToPlanModal