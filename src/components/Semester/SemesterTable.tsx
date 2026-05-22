import React from 'react'
import { Semester } from '../../models/Semester'
import ActionDropdown from '../common/ActionDropdown'

interface Props {
  semesters: Semester[]
  onEdit: (semester: Semester) => void
  onDelete?: (id: string) => void
  onArchive?: (semester: Semester) => void
  onView?: (semester: Semester) => void
}

const SemesterTable: React.FC<Props> = ({
  semesters,
  onEdit,
  onDelete,
  onArchive,
  onView
}) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="w-full">

        <thead className="border-b bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Código</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nombre</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Carrera</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Fecha inicio</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Fecha fin</th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Estado</th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {semesters.map((semester) => (
            <tr key={semester.id} className="border-b hover:bg-gray-50 transition">

              <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                {semester.code}
              </td>

              <td className="px-6 py-4 text-sm text-gray-900">
                {semester.name}
              </td>

              <td className="px-6 py-4 text-sm text-gray-600">
                {semester.career_name || '-'}
              </td>

              <td className="px-6 py-4 text-sm text-gray-600">
                {semester.start_date}
              </td>

              <td className="px-6 py-4 text-sm text-gray-600">
                {semester.end_date}
              </td>

              <td className="px-6 py-4 text-center">
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                  semester.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {
                    semester.is_active
                      ? 'Activo'
                      : 'Cerrado'
                  }
                </span>
              </td>

              <td className="px-6 py-4 text-center">
                <div className="flex items-center justify-center">
                  <ActionDropdown
                    items={[
                      {
                        key: 'edit',
                        label: 'Editar período',
                        onClick: () => onEdit(semester),
                        icon: (
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6 6L21 11l-6-6-6 6z" />
                          </svg>
                        )
                      },
                      {
                        key: 'view',
                        label: 'Ver detalle',
                        onClick: () => onView && onView(semester),
                        icon: (
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7S3.732 16.057 2.458 12z" />
                          </svg>
                        )
                      },
                      {
                        key: 'archive',
                        label: 'Cerrar período',
                        onClick: () => (onArchive ? onArchive(semester) : onDelete && onDelete(semester.id)),
                        colorClass: 'text-red-500',
                        icon: (
                          <svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M10 11v6m4-6v6M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12" />
                          </svg>
                        )
                      }
                    ]}
                    align="right"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  )
}

export default SemesterTable