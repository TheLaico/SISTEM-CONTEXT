import React from 'react'
import { Subject } from '../../models/Subject'

interface Props {
  open: boolean
  subject?: Subject | null
  loading?: boolean
  reason?: string
  onClose: () => void
  onConfirm: () => void
}

const ArchiveSubjectModal: React.FC<Props> = ({ open, subject, loading = false, reason, onClose, onConfirm }) => {
  if (!open || !subject) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Archivar asignatura</h3>
            <p className="mt-1 text-sm text-gray-500">Confirma si deseas archivar esta asignatura del catálogo.</p>
          </div>
          <button type="button" onClick={onClose} className="text-2xl font-semibold text-gray-500">×</button>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
          <p className="text-sm font-semibold text-gray-700">Asignatura</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">{subject.name}</p>
          <p className="text-sm text-gray-500">{subject.code}</p>
        </div>

        {reason ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-semibold">No se puede archivar</p>
            <p className="mt-2">{reason}</p>
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-700">
            <p>Si archivas esta asignatura, no podrá asociarse a nuevos grupos ni versiones del plan de estudios.</p>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onConfirm()}
            disabled={loading || Boolean(reason)}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
          >
            {loading ? 'Archivando...' : 'Archivar asignatura'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ArchiveSubjectModal
