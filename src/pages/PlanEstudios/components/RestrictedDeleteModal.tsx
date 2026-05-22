import { StudyPlanSubject } from '../../../types/studyPlan'

interface Props {
  isOpen: boolean
  subject: StudyPlanSubject | null
  onClose: () => void
}

const RestrictedDeleteModal = ({ isOpen, subject, onClose }: Props) => {
  if (!isOpen || !subject) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86l-7.42 12.84A2 2 0 004.6 20h14.8a2 2 0 001.73-3.3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-black dark:text-white">No se puede eliminar</h3>
            <p className="mt-1 text-sm text-gray-500">
              La asignatura <span className="font-semibold text-gray-900">{subject.subject_name}</span> tiene inscripciones activas asociadas.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Revisa las inscripciones activas antes de intentar eliminarla nuevamente.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-700"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  )
}

export default RestrictedDeleteModal