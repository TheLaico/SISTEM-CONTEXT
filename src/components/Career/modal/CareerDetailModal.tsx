import React from 'react'
import { Career } from '../../../models/Career'
import { Semester } from '../../../models/Semester'

interface Props {
  isOpen: boolean
  career: Career | null
  associatedSemesters: Semester[]
  totalStudents: number
  totalStudyPlans: number
  onClose: () => void
}

const formatDate = (value?: string) => {
  if (!value) return '-'
  const date = new Date(value)
  return new Intl.DateTimeFormat('es-PE', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  }).format(date)
}

const CareerDetailModal: React.FC<Props> = ({
  isOpen,
  career,
  associatedSemesters,
  totalStudents,
  totalStudyPlans,
  onClose
}) => {
  if (!isOpen || !career) return null

  const activeSemesters = associatedSemesters.filter(
    (semester) => semester.is_active
  ).length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-xl">
        <div className="border-b border-gray-200 px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
                Detalle de carrera
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                {career.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-full border border-gray-200 bg-white p-2 text-gray-500 transition hover:border-gray-300 hover:text-gray-900"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="space-y-6 px-6 py-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
              <h3 className="text-sm font-semibold text-gray-900">Información general</h3>
              <div className="mt-4 space-y-3 text-sm text-gray-700">
                <div className="grid grid-cols-2 gap-4">
                  <span className="font-medium text-gray-800">Nombre</span>
                  <span>{career.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <span className="font-medium text-gray-800">Código</span>
                  <span>{career.code}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <span className="font-medium text-gray-800">Estado</span>
                  <span>
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      career.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {career.is_active ? 'Activa' : 'Archivada'}
                    </span>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <span className="font-medium text-gray-800">Fecha creación</span>
                  <span>{formatDate(career.created_at)}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <span className="font-medium text-gray-800">Fecha actualización</span>
                  <span>{formatDate(career.updated_at)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
              <h3 className="text-sm font-semibold text-gray-900">Información académica</h3>
              <div className="mt-4 space-y-3 text-sm text-gray-700">
                <div className="grid grid-cols-2 gap-4">
                  <span className="font-medium text-gray-800">Total semestres asociados</span>
                  <span>{associatedSemesters.length}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <span className="font-medium text-gray-800">Semestres activos</span>
                  <span>{activeSemesters}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <span className="font-medium text-gray-800">Total estudiantes matriculados</span>
                  <span>{totalStudents}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <span className="font-medium text-gray-800">Total planes de estudio</span>
                  <span>{totalStudyPlans}</span>
                </div>
              </div>
            </div>
          </div>

          <section className="rounded-3xl border border-gray-200 p-5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Semestres asociados</h3>
                <p className="text-sm text-gray-500">Lista de semestres que pertenecen a esta carrera.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-gray-700">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Código</th>
                    <th className="px-4 py-3 font-semibold">Nombre</th>
                    <th className="px-4 py-3 font-semibold">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {associatedSemesters.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                        No hay semestres asociados a esta carrera.
                      </td>
                    </tr>
                  ) : (
                    associatedSemesters.map((semester) => (
                      <tr key={semester.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-900">{semester.code}</td>
                        <td className="px-4 py-3 text-gray-700">{semester.name}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            semester.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {semester.is_active ? 'Activo' : 'Cerrado'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="rounded-2xl bg-gray-100 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CareerDetailModal
