import React from 'react'

import { StudyPlanSubject } from '../../../types/studyPlan'

interface Props {
  subjects: StudyPlanSubject[]
  onEdit: (subject: StudyPlanSubject) => void
  onDelete: (subject: StudyPlanSubject) => void
}

const StudyPlanTable: React.FC<Props> = ({ subjects, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border">
        <thead className="bg-gray-100 text-left text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="border px-3 py-3">Semestre sugerido</th>
            <th className="border px-3 py-3">Código</th>
            <th className="border px-3 py-3">Asignatura</th>
            <th className="border px-3 py-3">Créditos</th>
            <th className="border px-3 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {subjects.length === 0 ? (
            <tr>
              <td colSpan={5} className="border px-3 py-6 text-center text-sm text-gray-500">
                No hay asignaturas en este plan.
              </td>
            </tr>
          ) : (
            subjects.map((subject, index) => (
              <tr
                key={`${subject.subject_id}-${subject.suggested_semester}-${index}`}
                className="hover:bg-gray-50"
              >
                <td className="border px-3 py-3">{subject.suggested_semester}</td>
                <td className="border px-3 py-3">{subject.subject_code}</td>
                <td className="border px-3 py-3">{subject.subject_name}</td>
                <td className="border px-3 py-3">{subject.credits}</td>
                <td className="border px-3 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(subject)}
                      className="rounded bg-blue-600 px-3 py-1 text-white text-xs hover:bg-blue-700"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(subject)}
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

export default StudyPlanTable