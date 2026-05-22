// src/pages/PlanEstudios/components/PlanSubjectsSection.tsx
import React, { useState } from 'react'
import { StudyPlanSubject } from '../../../types/studyPlan'
import { studyPlanService } from '../../../services/studyPlanService'
import toast from 'react-hot-toast'

interface Props {
  planId: string | null
  subjects: StudyPlanSubject[]
  isPublished: boolean
  loading?: boolean
  onSubjectRemoved: () => void
  onAddSubject: () => void
}

const PlanSubjectsSection: React.FC<Props> = ({
  planId,
  subjects,
  isPublished,
  loading,
  onSubjectRemoved,
  onAddSubject,
}) => {
  const [removingId, setRemovingId] = useState<number | null>(null)
  const [editingSubject, setEditingSubject] = useState<StudyPlanSubject | null>(null)
  const [editSemester, setEditSemester] = useState<number>(1)

  const handleRemove = async (subjectId: number, subjectName: string) => {
    if (!planId) return
    if (!window.confirm(`¿Remover "${subjectName}" del plan?`)) return
    setRemovingId(subjectId)
    try {
      await studyPlanService.removeSubjectFromStudyPlan(Number(planId), subjectId)
      toast.success('Asignatura removida del plan')
      onSubjectRemoved()
    } catch (err: any) {
      toast.error(err?.message || 'No se pudo remover la asignatura')
    } finally {
      setRemovingId(null)
    }
  }

  const handleEditSemester = async () => {
    if (!planId || !editingSubject) return
    try {
      // Actualiza el semestre sugerido vía removeSubject + addSubject
      await studyPlanService.removeSubjectFromStudyPlan(Number(planId), editingSubject.subject_id)
      await studyPlanService.addSubjectToStudyPlan(Number(planId), editingSubject.subject_id, {
        subject_id: editingSubject.subject_id,
        suggested_semester: editSemester,
        credits: editingSubject.credits,
      })
      toast.success('Semestre actualizado')
      setEditingSubject(null)
      onSubjectRemoved() // refresca
    } catch (err: any) {
      toast.error(err?.message || 'No se pudo actualizar el semestre')
    }
  }

  return (
    <div className="rounded-2xl border border-stroke bg-white shadow-card dark:border-strokedark dark:bg-boxdark">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stroke px-5 py-4 dark:border-strokedark">
        <div>
          <h3 className="text-base font-semibold text-black dark:text-white">
            Asignaturas del plan
          </h3>
          <p className="mt-0.5 text-xs text-body dark:text-bodydark">
            {subjects.length} asignatura{subjects.length !== 1 ? 's' : ''} registrada{subjects.length !== 1 ? 's' : ''}
          </p>
        </div>

        {!isPublished && planId && (
          <button
            type="button"
            onClick={onAddSubject}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-medium text-white transition hover:bg-opacity-90"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Agregar asignatura
          </button>
        )}
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="flex items-center justify-center py-10 text-sm text-body dark:text-bodydark">
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Cargando asignaturas...
        </div>
      ) : subjects.length === 0 ? (
        <div className="py-10 text-center text-sm text-body dark:text-bodydark">
          No hay asignaturas en este plan. {!isPublished && 'Agrega una para comenzar.'}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-stroke dark:divide-strokedark">
            <thead>
              <tr className="bg-gray dark:bg-meta-4">
                {['Código', 'Nombre', 'Créditos', 'Semestre sugerido', 'Estado', 'Acciones'].map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-body dark:text-bodydark"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stroke dark:divide-strokedark">
              {subjects.map((subject) => (
                <tr
                  key={subject.subject_id}
                  className="transition hover:bg-gray dark:hover:bg-meta-4"
                >
                  <td className="px-4 py-3 text-xs font-mono text-black dark:text-white">
                    {subject.subject_code}
                  </td>
                  <td className="px-4 py-3 text-sm text-black dark:text-white">
                    {subject.subject_name}
                  </td>
                  <td className="px-4 py-3 text-sm text-center text-black dark:text-white">
                    {subject.credits}
                  </td>
                  <td className="px-4 py-3 text-sm text-center text-black dark:text-white">
                    Semestre {subject.suggested_semester}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-meta-3 bg-opacity-10 px-2.5 py-1 text-xs font-semibold text-meta-3">
                      Activa
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {!isPublished && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSubject(subject)
                            setEditSemester(subject.suggested_semester)
                          }}
                          className="rounded border border-stroke px-2.5 py-1 text-xs font-medium text-black transition hover:border-primary hover:text-primary dark:border-strokedark dark:text-white"
                        >
                          Editar semestre
                        </button>
                        <button
                          type="button"
                          disabled={removingId === subject.subject_id}
                          onClick={() => handleRemove(subject.subject_id, subject.subject_name)}
                          className="rounded border border-danger px-2.5 py-1 text-xs font-medium text-danger transition hover:bg-danger hover:text-white disabled:opacity-50"
                        >
                          {removingId === subject.subject_id ? '...' : 'Remover'}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal editar semestre inline */}
      {editingSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-boxdark">
            <h3 className="mb-1 text-base font-semibold text-black dark:text-white">
              Editar semestre sugerido
            </h3>
            <p className="mb-4 text-sm text-body dark:text-bodydark">
              {editingSubject.subject_name}
            </p>
            <label className="mb-1.5 block text-sm font-medium text-black dark:text-white">
              Semestre sugerido
            </label>
            <input
              type="number"
              min={1}
              max={12}
              value={editSemester}
              onChange={(e) => setEditSemester(Number(e.target.value))}
              className="mb-4 w-full rounded-lg border border-stroke px-3 py-2 text-sm outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingSubject(null)}
                className="rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-black dark:border-strokedark dark:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleEditSemester}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PlanSubjectsSection