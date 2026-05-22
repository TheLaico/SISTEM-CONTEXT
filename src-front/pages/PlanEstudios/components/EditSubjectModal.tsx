import { StudyPlanSubject } from '../../../types/studyPlan'

interface Props {
  isOpen: boolean
  subject: StudyPlanSubject | null
  formSemester: number | null
  formCredits: number | null
  onSemesterChange: (s: number) => void
  onCreditsChange: (c: number) => void
  onConfirm: () => void
  onCancel: () => void
  loadingAction: boolean
}

const EditSubjectModal = ({
  isOpen,
  subject,
  formSemester,
  formCredits,
  onSemesterChange,
  onCreditsChange,
  onConfirm,
  onCancel,
  loadingAction
}: Props) => {
  if (!isOpen || !subject) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-black dark:text-white">Editar asignatura del plan</h3>
        <p className="mt-1 text-sm text-gray-500">Actualiza el semestre o los créditos de la asignatura seleccionada.</p>

        <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Asignatura</p>
          <p className="mt-1 text-sm font-medium text-gray-900">{subject.subject_name}</p>
          <p className="text-sm text-gray-500">{subject.subject_code}</p>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Semestre sugerido</label>
            <select
              value={formSemester ?? ''}
              onChange={(event) => onSemesterChange(Number(event.target.value))}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            >
              <option value="" disabled>
                Selecciona semestre
              </option>
              {Array.from({ length: 10 }, (_, index) => index + 1).map((semester) => (
                <option key={semester} value={semester}>
                  Semestre {semester}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Créditos</label>
            <input
              type="number"
              min={1}
              value={formCredits ?? ''}
              onChange={(event) => onCreditsChange(Number(event.target.value))}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              placeholder="Ej. 4"
            />
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
            className="rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loadingAction ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditSubjectModal