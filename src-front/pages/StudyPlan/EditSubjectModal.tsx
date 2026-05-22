import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { studyPlanBusiness } from '../../business/StudyPlanBusiness'
import { StudyPlanSubject } from '../../types/studyPlan'

interface Props {
  isOpen: boolean
  onClose: () => void
  planId?: string          // id del StudyPlan (el registro que vincula plan + asignatura)
  subject?: StudyPlanSubject | null
  onUpdated?: () => void
}

const EditSubjectModal: React.FC<Props> = ({ isOpen, onClose, planId, subject, onUpdated }) => {
  const [suggestedSemester, setSuggestedSemester] = useState(1)
  const [credits, setCredits] = useState(0)
  const [saving, setSaving] = useState(false)

  // Sincroniza el formulario cuando cambia la asignatura seleccionada
  useEffect(() => {
    if (subject) {
      setSuggestedSemester(subject.suggested_semester)
      setCredits(subject.credits)
    }
  }, [subject])

  if (!isOpen || !subject) return null

  const handleSubmit = async () => {
    if (!planId) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se encontró el ID del plan' })
      return
    }

    if (suggestedSemester <= 0 || suggestedSemester > 12) {
      Swal.fire({ icon: 'warning', title: 'Semestre inválido', text: 'El semestre sugerido debe estar entre 1 y 12' })
      return
    }

    if (credits <= 0) {
      Swal.fire({ icon: 'warning', title: 'Créditos inválidos', text: 'Los créditos deben ser mayores que cero' })
      return
    }

    try {
      setSaving(true)
      await studyPlanBusiness.updateStudyPlan(planId, {
        suggested_semester: suggestedSemester
      })
      Swal.fire({ icon: 'success', title: 'Actualizado', text: 'Los cambios han sido guardados.' })
      onUpdated && onUpdated()
      onClose()
    } catch (err: any) {
      Swal.fire({ icon: 'error', title: 'No se pudo actualizar', text: err?.message || 'Ocurrió un error al guardar los cambios' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Editar asignatura del plan</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="mb-4 rounded-md bg-gray-50 px-4 py-3 text-sm text-gray-700">
          <p className="font-medium">{subject.subject_name}</p>
          <p className="text-gray-500">Código: {subject.subject_code}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Semestre sugerido
            </label>
            <input
              type="number"
              min={1}
              max={12}
              value={suggestedSemester}
              onChange={(e) => setSuggestedSemester(Number(e.target.value))}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Créditos
            </label>
            <input
              type="number"
              min={1}
              value={credits}
              onChange={(e) => setCredits(Number(e.target.value))}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditSubjectModal