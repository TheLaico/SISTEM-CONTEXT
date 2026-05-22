import { Career } from '../../../models/Career'
import { StudyPlan } from '../../../models/StudyPlan'

interface Props {
  plan: StudyPlan | undefined
  career: Career | undefined
  totalSubjects: number
  totalCredits: number
  allPlans: StudyPlan[]
  onSelectPlan: (id: number) => void
  onPublish: () => void
}

const StudyPlanSummary = ({ plan, career, totalSubjects, totalCredits, allPlans, onSelectPlan, onPublish }: Props) => {
  const activePlanId = plan ? Number(plan.id) : null

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-black dark:text-white">Detalles del plan</h3>
            <p className="mt-1 text-sm text-gray-500">Resumen del plan activo seleccionado.</p>
          </div>

          <button
            type="button"
            onClick={onPublish}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
          >
            Publicar plan
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Carrera</p>
            <p className="mt-1 text-sm font-medium text-gray-900">{career?.name || 'Sin carrera seleccionada'}</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Año</p>
            <p className="mt-1 text-sm font-medium text-gray-900">{plan?.year ?? '-'}</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Estado</p>
            <p className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${plan?.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {plan?.is_published ? 'Publicado' : 'Borrador'}
            </p>
          </div>
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Totales</p>
            <p className="mt-1 text-sm font-medium text-gray-900">{totalSubjects} asignaturas • {totalCredits} créditos</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-black dark:text-white">Historial de versiones</h3>
            <p className="mt-1 text-sm text-gray-500">Selecciona una versión para verla en detalle.</p>
          </div>
          <button
            type="button"
            onClick={onPublish}
            className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-100"
          >
            Ver todas las versiones
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {allPlans.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
              No hay versiones disponibles.
            </div>
          ) : (
            allPlans.map((version) => {
              const isActive = Number(version.id) === activePlanId

              return (
                <button
                  key={version.id}
                  type="button"
                  onClick={() => onSelectPlan(Number(version.id))}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                    isActive
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-200 bg-white hover:border-green-200 hover:bg-green-50/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{version.name}</p>
                      <p className="text-xs text-gray-500">Año {version.year}</p>
                    </div>
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${version.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {version.is_published ? 'Publicado' : 'Borrador'}
                    </span>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default StudyPlanSummary