import { Career } from '../../models/Career'
import ActionDropdown from '../common/ActionDropdown'

interface Props {
  careers: Career[]
  onEdit: (career: Career) => void
  onDelete?: (id: string) => void
  onArchive?: (career: Career) => void
  onView?: (career: Career) => void
}

export default function CareerTable({
  careers,
  onEdit,
  onDelete,
  onArchive,
  onView
}: Props) {

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="w-full">

        <thead className="border-b bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Código</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nombre</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Descripción</th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Estado</th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Acciones</th>
          </tr>
        </thead>

        <tbody>

          {
            careers.map((career) => (

              <tr key={career.id} className="border-b hover:bg-gray-50 transition">

                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{career.code}</td>

                <td className="px-6 py-4 text-sm text-gray-900">{career.name}</td>

                <td className="px-6 py-4 text-sm text-gray-600">{career.description || '-'}</td>

                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                    career.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {
                      career.is_active
                        ? 'Activa'
                        : 'Archivada'
                    }
                  </span>
                </td>

                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center">
                    <ActionDropdown
                      items={[
                        {
                          key: 'edit',
                          label: 'Editar carrera',
                          onClick: () => onEdit(career),
                          icon: (
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6 6L21 11l-6-6-6 6z" />
                            </svg>
                          )
                        },
                        {
                          key: 'view',
                          label: 'Ver detalle',
                          onClick: () => onView && onView(career),
                          icon: (
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7S3.732 16.057 2.458 12z" />
                            </svg>
                          )
                        },
                        {
                          key: 'archive',
                          label: 'Archivar carrera',
                          onClick: () => (onArchive ? onArchive(career) : onDelete && onDelete(career.id)),
                          colorClass: 'text-yellow-600',
                          icon: (
                            <svg className="h-4 w-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M8 7v10a2 2 0 002 2h4a2 2 0 002-2V7" />
                              <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M9 7V5a3 3 0 016 0v2" />
                            </svg>
                          )
                        }
                      ]}
                      align="right"
                    />
                  </div>
                </td>

              </tr>
            ))
          }

        </tbody>

      </table>
    </div>
  )
}