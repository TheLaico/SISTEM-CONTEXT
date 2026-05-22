import React, { useEffect, useState } from 'react'
import { Subject, UpdateSubjectDto } from '../../models/Subject'
import SubjectForm from './SubjectForm'

interface Props {
  open: boolean
  subject?: Subject | null
  loading?: boolean
  canEdit?: boolean
  blockMessage?: string
  onClose: () => void
  onEdit: (payload: UpdateSubjectDto) => void
}

const EditSubjectModal: React.FC<Props> = ({ open, subject, loading = false, canEdit = true, blockMessage, onClose, onEdit }) => {
  const [formData, setFormData] = useState<UpdateSubjectDto>({
    name: '',
    description: '',
    credits: 0,
    code: ''
  })

  useEffect(() => {
    if (subject) {
      setFormData({
        name: subject.name,
        code: subject.code,
        description: subject.description,
        credits: subject.credits,
        is_active: subject.is_active
      })
    }
  }, [subject])

  if (!open || !subject) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Editar asignatura</h3>
            <p className="mt-1 text-sm text-gray-500">Actualiza los datos de la asignatura seleccionada.</p>
          </div>
          <button type="button" onClick={onClose} className="text-2xl font-semibold text-gray-500">×</button>
        </div>

        <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-700">
          <p className="font-semibold text-gray-900">Código</p>
          <p className="mt-1 text-gray-600">{subject.code}</p>
        </div>

        {!canEdit && (
          <div className="mt-4 rounded-2xl border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-800">
            {blockMessage || 'No se puede editar esta asignatura porque tiene grupos activos en el semestre vigente.'}
          </div>
        )}

        <div className="mt-4">
          <SubjectForm
            formData={formData}
            onChange={(field, value) => setFormData((prev) => ({ ...prev, [field]: value }))}
            onSubmit={() => onEdit(formData)}
            loading={loading}
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onEdit(formData)}
            disabled={loading || !canEdit}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditSubjectModal
