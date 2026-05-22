import React from 'react'

import { StudyPlan } from '../../models/StudyPlan'

interface Props {
  studyPlans: StudyPlan[]
  onEdit: (studyPlan: StudyPlan) => void
  onDelete: (studyPlan: StudyPlan) => void
}

const StudyPlanListTable: React.FC<Props> = ({ studyPlans, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border">
        <thead className="bg-gray-100 text-left text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="border px-3 py-3">Nombre</th>
            <th className="border px-3 py-3">Carrera</th>
            <th className="border px-3 py-3">Año</th>
            <th className="border px-3 py-3">Semestre sugerido</th>
            <th className="border px-3 py-3">Estado</th>
            <th className="border px-3 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {studyPlans.length === 0 ? (
            <tr>
              <td colSpan={6} className="border px-3 py-6 text-center text-sm text-gray-500">
                No hay planes de estudio registrados.
              </td>
            </tr>
          ) : (
            studyPlans.map((plan, index) => (
              <tr key={`${plan.id}-${index}`} className="hover:bg-gray-50">
                <td className="border px-3 py-3 font-medium">{plan.name}</td>
                <td className="border px-3 py-3">
                  {plan.career?.name ?? String(plan.career_id)}
                </td>
                <td className="border px-3 py-3">{plan.year}</td>
                <td className="border px-3 py-3">{plan.suggested_semester}</td>
                <td className="border px-3 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                      plan.is_published
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {plan.is_published ? 'Publicado' : 'Borrador'}
                  </span>
                </td>
                <td className="border px-3 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(plan)}
                      className="rounded bg-blue-600 px-3 py-1 text-white text-xs hover:bg-blue-700"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(plan)}
                      className="rounded bg-red-600 px-3 py-1 text-white text-xs hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default StudyPlanListTable