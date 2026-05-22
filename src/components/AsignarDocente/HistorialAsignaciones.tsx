// src/components/AsignarDocente/HistorialAsignaciones.tsx
import { AssignmentRecord } from '../../pages/Group/AsignarDocente'

interface Props {
  history: AssignmentRecord[]
}

const HistorialAsignaciones = ({ history }: Props) => {
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="px-6 py-4 border-b border-stroke dark:border-strokedark">
        <h2 className="text-lg font-semibold text-black dark:text-white">
          Historial de asignaciones
        </h2>
      </div>

      {history.length === 0 ? (
        <div className="px-6 py-10 text-center">
          <p className="text-bodydark2 italic">
            No hay asignaciones registradas en esta sesión.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 dark:bg-meta-4 text-left">
                {['Grupo', 'Asignatura', 'Docente', 'Fecha asignación', 'Estado'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-4 text-xs font-semibold uppercase text-bodydark2"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.map((record) => {
                const profile = record.teacher?.profile as any
                const teacherName = profile
                  ? `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim()
                  : '—'

                return (
                  <tr
                    key={record.id}
                    className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4 transition"
                  >
                    <td className="px-4 py-3 text-sm text-black dark:text-white">
                      <span className="font-mono text-xs text-primary mr-2">
                        {record.group.group_code}
                      </span>
                      {record.group.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-bodydark2">
                      {record.group.subject?.name ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-black dark:text-white">
                      {teacherName}
                    </td>
                    <td className="px-4 py-3 text-sm text-bodydark2">
                      {new Date(record.assignedAt).toLocaleString('es-CO', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block rounded-full bg-success bg-opacity-10 px-3 py-0.5 text-xs font-semibold text-success">
                        Activo
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default HistorialAsignaciones