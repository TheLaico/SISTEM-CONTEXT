// src/components/AsignarDocente/DocenteCard.tsx
import { User } from '../../models/User'

interface Props {
  teacher: User
  onClear: () => void
}

const DocenteCard = ({ teacher, onClear }: Props) => {
  const profile = teacher.profile as any
  const firstName = profile?.first_name ?? ''
  const lastName = profile?.last_name ?? ''
  const specialty = profile?.specialty ?? 'No registrada'
  const identification = profile?.identification ?? teacher.code ?? '—'
  const assignedGroups: any[] = profile?.groups ?? []

  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase() || '?'

  return (
    <div className="rounded-sm border border-stroke bg-gray-2 p-4 dark:border-strokedark dark:bg-meta-4">
      <div className="flex items-start justify-between gap-4">
        {/* Avatar */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white font-bold text-sm flex-shrink-0">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-black dark:text-white">
              {firstName} {lastName}
            </p>
            <p className="text-xs text-bodydark2">CC: {identification}</p>
          </div>
        </div>
        <button
          onClick={onClear}
          title="Cambiar docente"
          className="text-bodydark2 hover:text-danger transition text-lg leading-none"
        >
          ✕
        </button>
      </div>

      {/* Detalles */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-xs text-bodydark2 uppercase font-semibold">Especialidad</span>
          <p className="text-black dark:text-white">{specialty}</p>
        </div>
        <div>
          <span className="text-xs text-bodydark2 uppercase font-semibold">Estado</span>
          <p>
            <span
              className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium bg-opacity-10 ${
                teacher.is_active
                  ? 'bg-success text-success'
                  : 'bg-danger text-danger'
              }`}
            >
              {teacher.is_active ? 'Activo' : 'Inactivo'}
            </span>
          </p>
        </div>
        <div>
          <span className="text-xs text-bodydark2 uppercase font-semibold">Grupos asignados</span>
          <p className="text-black dark:text-white">{assignedGroups.length}</p>
        </div>
      </div>
    </div>
  )
}

export default DocenteCard