import React from 'react'

import { Subject } from '../../models/Subject'
import SubjectActionDropdown from './SubjectActionDropdown'

interface Props {
  subjects: Subject[]
  selectedSubjectId?: string
  onSelect: (subject: Subject) => void
  onEdit: (subject: Subject) => void
  onArchive: (subject: Subject) => void

}

const formatDate = (value?: string) => {
  if (!value) return '-'
  const date = new Date(value)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const SubjectTable: React.FC<Props> = ({
  subjects,
  selectedSubjectId,
  onSelect,
  onEdit,
  onArchive
}) => {
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="max-w-full overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0 text-left">
          <thead>
            <tr className="bg-gray-2 dark:bg-meta-4">
            <th className="px-4 py-4 text-sm font-semibold text-gray-700">Código</th>
            <th className="px-4 py-4 text-sm font-semibold text-gray-700">Nombre</th>
            <th className="px-4 py-4 text-sm font-semibold text-gray-700">Descripción</th>
            <th className="px-4 py-4 text-sm font-semibold text-gray-700">Créditos</th>
            <th className="px-4 py-4 text-sm font-semibold text-gray-700">Estado</th>
            <th className="px-4 py-4 text-sm font-semibold text-gray-700">Última actualización</th>
            <th className="px-4 py-4 text-sm font-semibold text-gray-700 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
          {subjects.length === 0 ? (
            <tr>
              <td colSpan={7} className="border-b border-[#eee] px-4 py-5 text-center text-sm text-gray-500 dark:border-strokedark">
                No se encontraron asignaturas.
              </td>
            </tr>
          ) : (
            subjects.map((subject) => {
              const isSelected = subject.id === selectedSubjectId
              return (
                <tr
                  key={subject.id}
                  className={`${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'} border-t transition`}
                >
                  <td className="border-b border-[#eee] px-4 py-5 text-sm text-gray-900 dark:border-strokedark cursor-pointer" onClick={() => onSelect(subject)}>{subject.code}</td>
                  <td className="border-b border-[#eee] px-4 py-5 text-sm text-gray-900 dark:border-strokedark cursor-pointer" onClick={() => onSelect(subject)}>{subject.name}</td>
                  <td className="border-b border-[#eee] px-4 py-5 text-sm text-gray-600 dark:border-strokedark cursor-pointer" onClick={() => onSelect(subject)}>{subject.description || '-'}</td>
                  <td className="border-b border-[#eee] px-4 py-5 text-sm text-gray-900 dark:border-strokedark cursor-pointer" onClick={() => onSelect(subject)}>{subject.credits}</td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${subject.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'}`}>
                      {subject.is_active ? 'Activo' : 'Archivado'}
                    </span>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 text-sm text-gray-600 dark:border-strokedark cursor-pointer" onClick={() => onSelect(subject)}>{formatDate(subject.updated_at)}</td>
                  <td className="border-b border-[#eee] px-4 py-5 text-right dark:border-strokedark">
                    <SubjectActionDropdown
                      subject={subject}
                      onEdit={onEdit}
                      onArchive={onArchive}
                    />
                  </td>
                </tr>
              )
            })
          )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SubjectTable