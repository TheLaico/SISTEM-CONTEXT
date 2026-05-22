import React, { useEffect, useState } from 'react'
import { CreateSubjectDto } from '../../models/Subject'
import SubjectForm from './SubjectForm'

interface Props {
  open: boolean
  onClose: () => void
  onCreate: (payload: CreateSubjectDto) => void
  loading?: boolean
}

const CreateSubjectModal: React.FC<Props> = ({ open, onClose, onCreate, loading = false }) => {
  const [formData, setFormData] = useState<CreateSubjectDto>({
    code: '',
    name: '',
    description: '',
    credits: 0,
    is_active: true
  })

  useEffect(() => {
    if (!open) {
      setFormData({ code: '', name: '', description: '', credits: 0, is_active: true })
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Nueva asignatura</h3>
            <p className="mt-1 text-sm text-gray-500">Registra una nueva asignatura en el catálogo.</p>
          </div>
          <button type="button" onClick={onClose} className="text-2xl font-semibold text-gray-500">×</button>
        </div>

        <SubjectForm
          formData={formData}
          onChange={(field, value) => setFormData((prev) => ({ ...prev, [field]: value }))}
          onSubmit={() => onCreate(formData)}
          loading={loading}
        />

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            Cancelar
          </button>
          <button type="button" onClick={() => onCreate(formData)} disabled={loading} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            {loading ? 'Guardando...' : 'Crear asignatura'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateSubjectModal
