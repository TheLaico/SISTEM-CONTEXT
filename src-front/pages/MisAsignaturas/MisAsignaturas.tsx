import useMisAsignaturas from '../../hooks/useMisAsignaturas'
import { formatCredits } from '../../business/MisAsignaturasBusiness'

const MisAsignaturas = () => {
  const { asignaturas, loading, error } = useMisAsignaturas()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-black dark:text-white">
          Mis Asignaturas
        </h2>
        <p className="text-sm text-gray-500">
          Consulta las asignaturas inscritas en tu semestre activo.
        </p>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-strokedark dark:bg-boxdark">
          <p className="text-sm font-medium text-gray-500">
            Cargando...
          </p>
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
          {error}
        </div>
      ) : asignaturas.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-strokedark dark:bg-boxdark">
          <p className="text-sm text-gray-500">
            No tienes asignaturas inscritas en el semestre actual.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-strokedark dark:bg-boxdark">
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 text-left">
              <thead className="bg-gray-50 dark:bg-meta-4">
                <tr>
                  <th className="px-4 py-4 text-sm font-semibold text-gray-700 dark:text-white">
                    Asignatura
                  </th>
                  <th className="px-4 py-4 text-sm font-semibold text-gray-700 dark:text-white">
                    Código
                  </th>
                  <th className="px-4 py-4 text-sm font-semibold text-gray-700 dark:text-white">
                    Créditos
                  </th>
                  <th className="px-4 py-4 text-sm font-semibold text-gray-700 dark:text-white">
                    Grupo
                  </th>
                  <th className="px-4 py-4 text-sm font-semibold text-gray-700 dark:text-white">
                    Semestre
                  </th>
                </tr>
              </thead>

              <tbody>
                {asignaturas.map((asignatura) => (
                  <tr key={asignatura.enrollmentId} className="border-t transition hover:bg-gray-50 dark:border-strokedark dark:hover:bg-meta-4">
                    <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {asignatura.subjectName}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {asignatura.subjectCode}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {formatCredits(asignatura.credits)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {asignatura.groupName} ({asignatura.groupCode})
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {asignatura.semesterName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default MisAsignaturas
