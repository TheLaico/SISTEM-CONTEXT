import { Search, X } from 'lucide-react'
import {  GroupFilters as GroupUIFilters } from '../../business/GroupBusiness'

interface GroupFiltersBarProps {
  filters: GroupUIFilters
  uniqueSemesters: string[]
  totalGroups: number
  filteredCount: number
  onChange: (filters: GroupUIFilters) => void
  onReset: () => void
}

const GROUP_STATUS_OPTIONS = ['Activo', 'Sin estudiantes', 'Cerrado'] as const

const hasActiveFilters = (filters: GroupUIFilters): boolean =>
  !!(
    filters.searchSubject ||
    filters.searchCode ||
    filters.semesterName ||
    filters.groupStatus
  )

const GroupFiltersBar = ({
  filters,
  uniqueSemesters,
  totalGroups,
  filteredCount,
  onChange,
  onReset,
}: GroupFiltersBarProps) => {
  const isFiltered = hasActiveFilters(filters)

  const update = (field: keyof GroupUIFilters, value: string) =>
    onChange({ ...filters, [field]: value })

  return (
    <div className="mb-6 rounded-xl border border-stroke bg-white p-4 shadow-sm dark:border-strokedark dark:bg-boxdark">
      {/* Fila superior: búsqueda de texto */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Buscar por asignatura */}
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-bodydark2"
          />
          <input
            type="text"
            value={filters.searchSubject}
            onChange={(e) => update('searchSubject', e.target.value)}
            placeholder="Buscar por asignatura..."
            className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-9 pr-4 text-sm text-black outline-none transition focus:border-primary dark:border-strokedark dark:text-white dark:focus:border-primary"
          />
        </div>

        {/* Buscar por código */}
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-bodydark2"
          />
          <input
            type="text"
            value={filters.searchCode}
            onChange={(e) => update('searchCode', e.target.value)}
            placeholder="Buscar por código..."
            className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-9 pr-4 text-sm text-black outline-none transition focus:border-primary dark:border-strokedark dark:text-white dark:focus:border-primary"
          />
        </div>
      </div>

      {/* Fila inferior: selects */}
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        {/* Filtro por semestre */}
        <select
          value={filters.semesterName}
          onChange={(e) => update('semesterName', e.target.value)}
          className="flex-1 rounded-lg border border-stroke bg-transparent py-2 px-3 text-sm text-black outline-none transition focus:border-primary dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary"
        >
          <option value="">Todos los semestres</option>
          {uniqueSemesters.map((semester) => (
            <option key={semester} value={semester}>
              {semester}
            </option>
          ))}
        </select>

        {/* Filtro por estado */}
        <select
          value={filters.groupStatus}
          onChange={(e) => update('groupStatus', e.target.value)}
          className="flex-1 rounded-lg border border-stroke bg-transparent py-2 px-3 text-sm text-black outline-none transition focus:border-primary dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary"
        >
          <option value="">Todos los estados</option>
          {GROUP_STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Pie: contador + botón limpiar */}
      <div className="mt-3 flex items-center justify-between">
        <p
          className={`text-xs font-medium ${
            isFiltered ? 'text-primary' : 'text-bodydark2'
          }`}
        >
          Mostrando {filteredCount} de {totalGroups} grupo
          {totalGroups !== 1 ? 's' : ''}
        </p>

        {isFiltered && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-danger transition hover:bg-red-50 dark:hover:bg-meta-4"
          >
            <X size={13} />
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  )
}

export default GroupFiltersBar