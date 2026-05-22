import React from 'react'

interface Props {
  status: 'all' | 'active' | 'inactive'
  credits: string
  onStatusChange: (value: 'all' | 'active' | 'inactive') => void
  onCreditsChange: (value: string) => void
  onClear: () => void
}

const SubjectFilters: React.FC<Props> = ({ status, credits, onStatusChange, onCreditsChange, onClear }) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="block text-sm font-semibold text-gray-700">Estado</label>
          <select
            value={status}
            onChange={(event) => onStatusChange(event.target.value as 'all' | 'active' | 'inactive')}
            className="mt-2 w-full rounded-md border border-stroke bg-white px-4 py-2 text-sm text-gray-700 outline-none transition focus:border-primary dark:border-strokedark dark:bg-boxdark dark:text-white"
          >
            <option value="all">Todos</option>
            <option value="active">Activo</option>
            <option value="inactive">Archivado</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">Créditos</label>
          <input
            type="number"
            min={0}
            value={credits}
            onChange={(event) => onCreditsChange(event.target.value)}
            placeholder="Min"
            className="mt-2 w-full rounded-md border border-stroke bg-white px-4 py-2 text-sm text-gray-700 outline-none transition focus:border-primary dark:border-strokedark dark:bg-boxdark dark:text-white"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onClear}
        className="inline-flex items-center justify-center rounded-md border border-stroke bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-strokedark dark:bg-boxdark dark:text-white"
      >
        Limpiar filtros
      </button>
    </div>
  )
}

export default SubjectFilters
