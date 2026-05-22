import React from 'react'
import { Subject } from '../../models/Subject'

interface Props {
  subject?: Subject | null
}

const SubjectDetailsCard: React.FC<Props> = ({ subject }) => {
  const formatDate = (value?: string) => {
    if (!value) return 'N/A'
    return new Date(value).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (!subject) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm font-semibold text-gray-700">Selecciona una asignatura</p>
        <p className="mt-2 text-sm text-gray-500">
          Para editar o archivar una asignatura, selecciónala desde la tabla y elige la acción correspondiente.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Asignatura</p>
          <h2 className="mt-2 text-2xl font-semibold text-gray-900">{subject.name}</h2>
          <p className="mt-1 text-sm text-gray-500">{subject.code}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${subject.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'}`}>
          {subject.is_active ? 'Activo' : 'Archivado'}
        </span>
      </div>

      <div className="space-y-4 text-sm text-gray-700">
        <div>
          <p className="font-semibold text-gray-900">Descripción</p>
          <p className="mt-2 text-sm text-gray-600">{subject.description || 'Sin descripción'}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="border border-gray-200 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Créditos</p>
            <p className="mt-2 text-lg font-semibold text-gray-900">{subject.credits}</p>
          </div>

          <div className="border border-gray-200 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Creado el</p>
            <p className="mt-2 text-lg font-semibold text-gray-900">{formatDate(subject.created_at)}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="border border-gray-200 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Última actualización</p>
            <p className="mt-2 text-lg font-semibold text-gray-900">{formatDate(subject.updated_at)}</p>
          </div>

          <div className="border border-gray-200 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Actualizado por</p>
            <p className="mt-2 text-lg font-semibold text-gray-900">N/A</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubjectDetailsCard
