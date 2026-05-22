import { Subject } from '../../../models/Subject'

interface Props {
  isOpen: boolean
  availableSubjects: Subject[]
  formSubjectId: number | null
  formSemester: number | null
  formCredits: number | null
  onSubjectChange: (id: number) => void
  onSemesterChange: (s: number) => void
  onCreditsChange: (c: number) => void
  onConfirm: () => void
  onCancel: () => void
  loadingAction: boolean
}

const AddSubjectModal = ({
  isOpen,
  availableSubjects,
  formSubjectId,
  formSemester,
  formCredits,
  onSubjectChange,
  onSemesterChange,
  onCreditsChange,
  onConfirm,
  onCancel,
  loadingAction
}: Props) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-black dark:text-white">Agregar asignatura</h3>
            <p className="mt-1 text-sm text-gray-500">Selecciona la materia y completa los datos del plan.</p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Asignatura</label>
            <select
              value={formSubjectId ?? ''}
              onChange={(event) => onSubjectChange(Number(event.target.value))}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            >
              <option value="" disabled>
                Selecciona una asignatura
              </option>
              {availableSubjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.code} - {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            {loadingAction ? 'Agregando...' : 'Agregar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddSubjectModal