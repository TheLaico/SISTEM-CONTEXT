import React, { useState } from 'react'
import Swal from 'sweetalert2'
import { studyPlanBusiness } from '../../business/StudyPlanBusiness'

interface Props {
  isOpen: boolean
  onClose: () => void
  planId?: string
  subjectId?: string
  subjectName?: string
  onRemoved?: () => void
}

const DeleteSubjectModal: React.FC<Props> = ({
  isOpen,
  onClose,
  planId,
  subjectId,
  subjectName,
  onRemoved
}) => {
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  if (!isOpen) return null

  const handleConfirm = async () => {
    if (!planId || !subjectId) {
      setErrorMsg('Falta información del plan o asignatura')
      return
    }

    try {
      setLoading(true)
      setErrorMsg(null)
      await studyPlanBusiness.removeSubjectFromPlan(planId, subjectId)
      Swal.fire({ icon: 'success', title: 'Eliminado', text: 'La asignatura fue eliminada del plan' })
      onRemoved && onRemoved()
      onClose()
    } catch (err: any) {
      setErrorMsg(err?.message || 'No se pudo eliminar la asignatura')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setErrorMsg(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Eliminar asignatura</h3>
          <button type="button" onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        {errorMsg ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            ⚠️ {errorMsg}
          </div>
        ) : (
          <p className="text-sm text-gray-700">
            ¿Seguro que desea eliminar{' '}
            {subjectName ? <strong>"{subjectName}"</strong> : 'esta asignatura'}{' '}
            del plan? Esta acción no se puede deshacer.
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={handleClose}
            className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          {!errorMsg && (
            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-60"
            >
              {loading ? 'Eliminando...' : 'Eliminar'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default DeleteSubjectModal