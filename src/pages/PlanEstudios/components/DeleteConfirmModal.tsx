import { StudyPlanSubject } from '../../../types/studyPlan'

interface Props {
  isOpen: boolean
  subject: StudyPlanSubject | null
  onConfirm: () => void
  onCancel: () => void
  loadingAction: boolean
}

const DeleteConfirmModal = ({ isOpen, subject, onConfirm, onCancel, loadingAction }: Props) => {
  if (!isOpen || !subject) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-700">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86l-7.42 12.84A2 2 0 004.6 20h14.8a2 2 0 001.73-3.3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-black dark:text-white">Eliminar asignatura</h3>
            <p className="mt-1 text-sm text-gray-500">
              ¿Deseas eliminar <span className="font-semibold text-gray-900">{subject.subject_name}</span> del plan?
            </p>
            <p className="mt-2 text-sm font-medium text-yellow-700">Esta acción no se puede deshacer.</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loadingAction}
            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loadingAction ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmModal