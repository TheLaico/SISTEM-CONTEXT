import React from 'react'
import { Career } from '../../../models/Career'

interface Props {
  isOpen: boolean
  career?: Career | null
  activeSemesters?: { name: string; period: string }[]
  onClose: () => void
  onConfirm?: () => void
}

const ArchiveCareerModal: React.FC<Props> = ({
  isOpen,
  career,
  activeSemesters = [],
  onClose,
  onConfirm
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-yellow-100 p-3">
            <svg className="h-8 w-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.257 3.099c.765-1.36 2.72-1.36 3.486 0l6.518 11.592c.75 1.334-.213 2.98-1.742 2.98H3.481c-1.53 0-2.492-1.646-1.742-2.98L8.257 3.1zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-1-7a1 1 0 00-.993.883L9 7v4a1 1 0 001.993.117L11 11V7a1 1 0 00-1-1z" />
            </svg>
          </div>

          <h3 className="text-lg font-semibold">¿Estás seguro que deseas archivar esta carrera?</h3>

          <p className="text-sm text-gray-600">No se puede archivar porque tiene semestres activos asociados.</p>

          <div className="w-full rounded-lg border p-4 text-left">
            <p className="text-sm text-gray-700"><strong>Carrera:</strong> {career?.name || '-'}</p>
            <div className="mt-2">
              <p className="text-sm font-medium">Semestres activos:</p>
              {activeSemesters.length === 0 ? (
                <p className="text-sm text-gray-500">Ninguno</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {activeSemesters.map((s, idx) => (
                    <li key={idx} className="flex items-center justify-between rounded-md border p-2">
                      <span className="text-sm">{s.name}</span>
                      <span className="text-xs text-gray-500">{s.period}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={onClose}
              className="rounded-lg border border-stroke px-4 py-2"
            >
              Cerrar
            </button>

            <button
              onClick={() => onConfirm && onConfirm()}
              className="rounded-lg bg-red-500 px-4 py-2 text-Red"
            >
              Archivar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArchiveCareerModal
