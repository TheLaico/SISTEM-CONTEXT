// src/components/Grupos/CalificacionesSection.tsx
import { useState } from 'react'
import { Lock, PenLine } from 'lucide-react'
import { EnrolledStudentRow, EvaluationRow, GradePayload } from '../../business/GroupBusiness'
import { Grade } from '../../models/Grade'
import { Rubric } from '../../models/Rubric'

interface CalificacionesSectionProps {
  students: EnrolledStudentRow[]
  evaluations: EvaluationRow[]
  grades: Grade[]
  rubrics: Rubric[]
  isLoading?: boolean
  isReadOnly?: boolean
  onSaveGrade: (payload: GradePayload) => Promise<void>
}

interface ScaleSelection { criterionId: string; scaleId: string; comment?: string }

export default function CalificacionesSection({
  students, evaluations, grades, rubrics, isLoading, isReadOnly, onSaveGrade,
}: CalificacionesSectionProps) {
  const [selectedEvalId, setSelectedEvalId] = useState<string>('')
  const [modalStudent, setModalStudent]     = useState<EnrolledStudentRow | null>(null)
  const [selections, setSelections]         = useState<ScaleSelection[]>([])
  const [observations, setObservations]     = useState('')
  const [saving, setSaving]                 = useState(false)

  // Evaluaciones con rúbrica publicada
  const evaluableEvals = evaluations.filter((e) => e.hasRubric && e.rubricIsPublic)
  const activeEval     = evaluableEvals.find((e) => String(e.id) === selectedEvalId) ?? null
  const activeRubric   = activeEval
    ? rubrics.find((r) => r.is_public && !r.is_archived)
    : null
  const criteria = activeRubric?.criteria ?? []

  const openModal = (student: EnrolledStudentRow) => {
    setModalStudent(student)
    setSelections(criteria.map((c) => ({ criterionId: String(c.id), scaleId: '' })))
    setObservations('')
  }
  const closeModal = () => { setModalStudent(null); setSelections([]); setObservations('') }

  const setScale = (criterionId: string, scaleId: string) => {
    setSelections((prev) =>
      prev.map((s) => s.criterionId === criterionId ? { ...s, scaleId } : s)
    )
  }

  const handleSave = async (status: 'DRAFT' | 'SENT') => {
    if (!modalStudent || !activeRubric) return
    const enrollment = grades.find((g) =>
      String((g as any).enrollment_id) === String(modalStudent.enrollmentId)
    )
    setSaving(true)
    try {
      await onSaveGrade({
        enrollment_id: modalStudent.enrollmentId,
        rubric_id:     activeRubric.id!,
        details:       selections.map((s) => ({ scale_id: s.scaleId, comment: s.comment })),
        status,
        observations:  observations || undefined,
      })
      closeModal()
    } finally {
      setSaving(false)
    }
  }

  const GRADE_COLOR: Record<string, string> = {
    green: 'bg-green-100 text-green-700', yellow: 'bg-yellow-100 text-yellow-700',
    red:   'bg-red-100 text-red-700',     gray:   'bg-gray-100 text-gray-500',
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <PenLine className="w-5 h-5 text-indigo-500" />
        <h2 className="text-base font-semibold text-gray-800">Calificaciones</h2>
      </div>

      {evaluableEvals.length === 0 ? (
        <p className="text-sm text-gray-400 italic py-4">
          Asocia una rúbrica publicada a una evaluación para calificar.
        </p>
      ) : (
        <>
          {/* Selector de evaluación */}
          <div className="mb-4">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
              Evaluación
            </label>
            <select
              value={selectedEvalId}
              onChange={(e) => setSelectedEvalId(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 w-full md:w-auto"
            >
              <option value="">Seleccionar evaluación…</option>
              {evaluableEvals.map((ev) => (
                <option key={String(ev.id)} value={String(ev.id)}>{ev.name}</option>
              ))}
            </select>
          </div>

          {/* Tabla de estudiantes */}
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse h-12 bg-gray-100 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b text-xs text-gray-400 uppercase tracking-wide">
                    <th className="px-4 py-2 font-medium">Estudiante</th>
                    <th className="px-4 py-2 font-medium">Estado</th>
                    <th className="px-4 py-2 font-medium">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((s) => {
                    const grade = grades.find((g) =>
                      String((g as any).enrollment_id) === String(s.enrollmentId)
                    )
                    const locked = grade?.is_locked
                    return (
                      <tr key={String(s.enrollmentId)} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-800">{s.fullName}</p>
                          <p className="text-xs text-gray-400">{s.identification}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${GRADE_COLOR[s.gradeStatusColor]}`}>
                            {s.gradeStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {locked ? (
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <Lock className="w-3.5 h-3.5" /> Bloqueada
                            </span>
                          ) : (
                            <button
                              onClick={() => openModal(s)}
                              disabled={isReadOnly || !selectedEvalId}
                              className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              <PenLine className="w-3.5 h-3.5" /> Calificar
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Modal de calificación */}
      {modalStudent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-semibold text-gray-800">
              Calificar: {modalStudent.fullName}
            </h3>

            {criteria.length === 0 ? (
              <p className="text-sm text-gray-400">Esta rúbrica no tiene criterios.</p>
            ) : (
              <div className="space-y-4">
                {criteria.map((criterion) => (
                  <div key={String(criterion.id)} className="border rounded-lg p-3">
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      {criterion.name}
                      <span className="ml-1 text-xs text-gray-400 font-normal">({criterion.weight}%)</span>
                    </p>
                    <div className="space-y-1">
                      {criterion.scales?.map((scale) => (
                        <label key={String(scale.id)} className="flex items-start gap-2 cursor-pointer group">
                          <input
                            type="radio"
                            name={`criterion-${criterion.id}`}
                            value={String(scale.id)}
                            checked={selections.find((s) => s.criterionId === String(criterion.id))?.scaleId === String(scale.id)}
                            onChange={() => setScale(String(criterion.id), String(scale.id))}
                            className="mt-0.5"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-indigo-700">
                            {scale.name}
                            {scale.value != null && <span className="ml-1 text-xs text-gray-400">({scale.value} pts)</span>}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                Observaciones
              </label>
              <textarea
                rows={2}
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                placeholder="Observaciones opcionales…"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button onClick={closeModal} className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button
                onClick={() => handleSave('DRAFT')}
                disabled={saving}
                className="px-4 py-2 text-sm rounded-lg border border-indigo-300 text-indigo-600 hover:bg-indigo-50 transition-colors disabled:opacity-40"
              >
                Guardar borrador
              </button>
              <button
                onClick={() => handleSave('SENT')}
                disabled={saving || selections.some((s) => !s.scaleId)}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-40"
              >
                Enviar calificación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}