// src/components/AsignarDocente/SemesterActivoBanner.tsx
import { Semester } from '../../models/Semester'

interface Props {
  activeSemester: Semester | null
}

const SemesterActivoBanner = ({ activeSemester }: Props) => {
  if (!activeSemester) {
    return (
      <div className="mb-4 flex items-center gap-3 rounded-sm border border-warning bg-warning bg-opacity-10 px-5 py-3">
        <span className="text-warning text-lg">⚠️</span>
        <p className="text-sm font-medium text-warning">
          No hay semestre activo. Solo se pueden asignar docentes durante un semestre activo.
        </p>
      </div>
    )
  }

  return (
    <div className="mb-4 flex items-center gap-3 rounded-sm border border-success bg-success bg-opacity-10 px-5 py-3">
      <span className="inline-block h-3 w-3 rounded-full bg-success animate-pulse" />
      <div>
        <span className="text-sm text-bodydark2 mr-2">Semestre activo:</span>
        <strong className="text-sm font-semibold text-success">{activeSemester.name}</strong>
        <span className="ml-3 text-xs text-bodydark2">
          Solo se muestran grupos del semestre activo disponibles para asignación.
        </span>
      </div>
    </div>
  )
}

export default SemesterActivoBanner