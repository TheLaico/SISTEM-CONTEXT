import React from 'react'
import { Subject } from '../../models/Subject'

interface Props {
  subjects: Subject[]
  search: string
  onSearch: (value: string) => void
  onAdd: (subject: Subject) => void
}

const StudyPlanCatalog: React.FC<Props> = ({ subjects, search, onSearch, onAdd }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-black dark:text-white">Catálogo de asignaturas</h3>
      <div className="flex items-center gap-2">
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Buscar por nombre o código"
          className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-primary dark:border-strokedark dark:bg-boxdark dark:text-white"
        />
        <button type="button" className="rounded-md border border-stroke bg-white px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 dark:border-strokedark dark:bg-boxdark dark:text-white">
          Filtros
        </button>
      </div>

      <div className="text-sm text-gray-600">
        Mostrando {subjects.length} asignaturas disponibles
      </div>

      <div className="max-h-[420px] space-y-2 overflow-y-auto">
        {subjects.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">No hay asignaturas disponibles</div>
        ) : (
          subjects.map((subject) => (
            <div key={subject.id} className="flex items-center justify-between rounded-md border border-stroke p-3 transition hover:bg-gray-50 dark:border-strokedark dark:hover:bg-meta-4">
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">{subject.code}</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">{subject.name}</div>
                <div className="text-xs text-gray-500">{subject.credits} créditos</div>
              </div>
              <button
                type="button"
                onClick={() => onAdd(subject)}
                className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1 text-sm font-medium text-white transition hover:bg-opacity-90"
              >
                +
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default StudyPlanCatalog
