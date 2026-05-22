import { Link } from 'react-router-dom'

import { misEvaluacionesBusiness } from '../../business/MisEvaluacionesBusiness'
import useMisEvaluaciones from '../../hooks/useMisEvaluaciones'

const MisEvaluaciones = () => {
  const { evaluaciones, loading, error } = useMisEvaluaciones()

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300">
        <Link to="/" className="transition hover:text-primary">
          Inicio
        </Link>
        <span>&gt;</span>
        <span className="font-medium text-gray-700 dark:text-white">Mis evaluaciones</span>
      </nav>

      <div>
        <h2 className="text-2xl font-bold text-black dark:text-white">
          Mis evaluaciones
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-300">
          Visualiza las evaluaciones de tus asignaturas inscritas.
        </p>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-stroke bg-white p-8 shadow-sm dark:border-strokedark dark:bg-boxdark">
          <div className="space-y-3 animate-pulse">
            <div className="h-4 w-40 rounded bg-gray-200 dark:bg-meta-4" />
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-meta-4" />
            <div className="h-4 w-10/12 rounded bg-gray-200 dark:bg-meta-4" />
          </div>
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
          {error}
        </div>
      ) : evaluaciones.length === 0 ? (
        <div className="rounded-3xl border border-stroke bg-white p-8 text-center shadow-sm dark:border-strokedark dark:bg-boxdark">
          <p className="text-sm text-gray-500 dark:text-gray-300">
            No tienes evaluaciones registradas en tus asignaturas inscritas.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark">
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 text-left">
              <thead className="bg-gray-50 dark:bg-meta-4">
                <tr>
                  <th className="px-4 py-4 text-sm font-semibold text-gray-700 dark:text-white">
                    Evaluación
                  </th>
                  <th className="px-4 py-4 text-sm font-semibold text-gray-700 dark:text-white">
                    Código
                  </th>
                  <th className="px-4 py-4 text-sm font-semibold text-gray-700 dark:text-white">
                    Peso
                  </th>
                  <th className="px-4 py-4 text-sm font-semibold text-gray-700 dark:text-white">
                    Estado de rúbrica
                  </th>
                  <th className="px-4 py-4 text-sm font-semibold text-gray-700 dark:text-white text-right">
                    Acción
                  </th>
                </tr>
              </thead>

              <tbody>
                {evaluaciones.map((evaluacion, index) => {
                  const hasRubric = misEvaluacionesBusiness.hasRubric(evaluacion)

                  return (
                    <tr
                      key={evaluacion.id ?? `evaluation-${index}`}
                      className="border-t transition hover:bg-gray-50 dark:border-strokedark dark:hover:bg-meta-4"
                    >
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        {evaluacion.name || 'Evaluación sin nombre'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {misEvaluacionesBusiness.buildEvaluationCode(evaluacion)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {evaluacion.weight ?? 0}%
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            hasRubric
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-700 dark:bg-meta-4 dark:text-gray-300'
                          }`}
                        >
                          {hasRubric ? 'Rúbrica asociada' : 'Sin rúbrica'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        {hasRubric && evaluacion.id ? (
                          <Link
                            to={`/mis-evaluaciones/${evaluacion.id}/rubrica`}
                            className="inline-flex rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white transition hover:bg-opacity-90"
                          >
                            Ver rúbrica
                          </Link>
                        ) : (
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            No disponible
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default MisEvaluaciones
