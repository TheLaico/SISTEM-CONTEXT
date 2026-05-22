import React, { useEffect, useState } from 'react'
import { Subject } from '../../models/Subject'

interface Props {
  isOpen: boolean
  onClose: () => void
  subject?: Subject | null
  careerName?: string
  versionYear?: number
  onAdd: (payload: { subject_id: string; suggested_semester: number; credits: number }) => void
}

const AddSubjectModal: React.FC<Props> = ({ isOpen, onClose, subject, careerName, versionYear, onAdd }) => {
  const [semester, setSemester] = useState<number>(1)
  const [credits, setCredits] = useState<number>(4)

  useEffect(() => {
    setSemester(1)
    setCredits(4)
  }, [subject])

  if (!isOpen || !subject) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Agregar asignatura al plan</h3>
            <p className="text-sm text-gray-500">Carrera: {careerName || 'Sin carrera seleccionada'}</p>
            <p className="text-sm text-gray-500">Versión: {versionYear || 'N/A'}</p>
          </div>
          <button type="button" onClick={onClose} className="text-xl font-bold leading-none">×</button>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="text-sm font-medium">{subject.code}</div>
            <div className="text-sm text-gray-600">{subject.name}</div>
            <div className="text-xs text-gray-500">{subject.credits} créditos</div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Semestre sugerido</label>
            <input
              type="number"
              value={semester}
              min={1}
              max={12}
              onChange={(e) => setSemester(Number(e.target.value))}
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Créditos</label>
            <input
              type="number"
              value={credits}
              min={1}
              onChange={(e) => setCredits(Number(e.target.value))}
              className="w-full rounded border px-3 py-2"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded border border-gray-300 px-4 py-2 text-sm">Cancelar</button>
          <button type="button" onClick={() => onAdd({ subject_id: subject.id, suggested_semester: semester, credits })} className="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700">
            Agregar al plan
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddSubjectModal
