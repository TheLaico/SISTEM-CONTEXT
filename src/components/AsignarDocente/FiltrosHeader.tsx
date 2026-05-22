// src/components/AsignarDocente/FiltrosHeader.tsx
import { Semester } from '../../models/Semester'

interface Props {
  semesters: Semester[]
  filters: { semester: string; subject: string; teacher: string }
  onFilterChange: (key: string, value: string) => void
  view: 'groups' | 'history'
  onViewChange: (v: 'groups' | 'history') => void
}

const FiltrosHeader = ({ semesters, filters, onFilterChange, view, onViewChange }: Props) => {
  return (
    <div className="mb-6 rounded-sm border border-stroke bg-white px-6 py-5 shadow-default dark:border-strokedark dark:bg-boxdark">
      {/* Título y botones */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <h1 className="text-2xl font-bold text-black dark:text-white">
          Asignar Docente a Grupo
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => onViewChange('groups')}
            className={`rounded px-4 py-2 text-sm font-medium transition ${
              view === 'groups'
                ? 'bg-primary text-white'
                : 'border border-stroke bg-transparent text-black hover:bg-gray-100 dark:text-white dark:hover:bg-meta-4'
            }`}
          >
            + Nueva asignación
          </button>
          <button
            onClick={() => onViewChange('history')}
            className={`rounded px-4 py-2 text-sm font-medium transition ${
              view === 'history'
                ? 'bg-primary text-white'
                : 'border border-stroke bg-transparent text-black hover:bg-gray-100 dark:text-white dark:hover:bg-meta-4'
            }`}
          >
            Ver asignaciones
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col gap-1 min-w-[180px]">
          <label className="text-xs font-semibold uppercase text-bodydark2">Semestre</label>
          <select
            value={filters.semester}
            onChange={(e) => onFilterChange('semester', e.target.value)}
            className="rounded border border-stroke bg-transparent px-3 py-2 text-sm text-black outline-none focus:border-primary dark:border-strokedark dark:text-white dark:bg-form-input"
          >
            <option value="">Todos</option>
            {semesters.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-[180px]">
          <label className="text-xs font-semibold uppercase text-bodydark2">Asignatura</label>
          <input
            type="text"
            placeholder="Buscar asignatura..."
            value={filters.subject}
            onChange={(e) => onFilterChange('subject', e.target.value)}
            className="rounded border border-stroke bg-transparent px-3 py-2 text-sm text-black outline-none focus:border-primary dark:border-strokedark dark:text-white dark:bg-form-input"
          />
        </div>

        <div className="flex flex-col gap-1 min-w-[180px]">
          <label className="text-xs font-semibold uppercase text-bodydark2">Docente</label>
          <input
            type="text"
            placeholder="Buscar docente..."
            value={filters.teacher}
            onChange={(e) => onFilterChange('teacher', e.target.value)}
            className="rounded border border-stroke bg-transparent px-3 py-2 text-sm text-black outline-none focus:border-primary dark:border-strokedark dark:text-white dark:bg-form-input"
          />
        </div>
      </div>
    </div>
  )
}

export default FiltrosHeader