// src/components/AsignarDocente/GruposTable.tsx
import { Group } from '../../models/Group'
import { Semester } from '../../models/Semester'

interface Props {
  groups: Group[]
  loading: boolean
  activeSemester: Semester | null
  onAssign: (group: Group) => void
}

const GruposTable = ({ groups, loading, activeSemester, onAssign }: Props) => {
  if (loading) {
    return (
      <div className="rounded-sm border border-stroke bg-white px-6 py-10 text-center shadow-default dark:border-strokedark dark:bg-boxdark">
        <p className="text-bodydark2">Cargando grupos...</p>
      </div>
    )
  }

  if (groups.length === 0) {
    return (
      <div className="rounded-sm border border-stroke bg-white px-6 py-10 text-center shadow-default dark:border-strokedark dark:bg-boxdark">
        <p className="text-bodydark2 italic">
          No hay grupos disponibles para el semestre seleccionado.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 dark:bg-meta-4 text-left">
              {['Código', 'Nombre grupo', 'Asignatura', 'Semestre', 'Docente actual', 'Estado', 'Acciones'].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-4 text-xs font-semibold uppercase text-bodydark2"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <GrupoRow
                key={group.id}
                group={group}
                activeSemester={activeSemester}
                onAssign={onAssign}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Fila individual ──────────────────────────────────────────────────────────

interface RowProps {
  group: Group
  activeSemester: Semester | null
  onAssign: (group: Group) => void
}

const GrupoRow = ({ group, activeSemester, onAssign }: RowProps) => {
  const hasSubject = !!group.subject
  const hasTeacher = !!group.teacher_id
  const hasNotes = !!(group as any).has_notes
  const semesterIsActive = activeSemester
    ? String(group.semester_id) === String(activeSemester.id)
    : false

  // Estado del grupo
  const statusLabel = !semesterIsActive
    ? 'Cerrado'
    : (group.enrollments?.length ?? 0) === 0
    ? 'Sin estudiantes'
    : 'Activo'
  const statusColor =
    statusLabel === 'Activo'
      ? 'text-success bg-success'
      : statusLabel === 'Sin estudiantes'
      ? 'text-warning bg-warning'
      : 'text-danger bg-danger'

  // Nombre del docente actual (viene en group.teacher)
  const teacherName = group.teacher
    ? `${group.teacher.first_name ?? ''} ${group.teacher.last_name ?? ''}`.trim()
    : null

  return (
    <tr className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4 transition">
      {/* Código */}
      <td className="px-4 py-3 font-mono text-xs font-semibold text-primary">
        {group.group_code}
      </td>

      {/* Nombre */}
      <td className="px-4 py-3 text-sm text-black dark:text-white">{group.name}</td>

      {/* Asignatura */}
      <td className="px-4 py-3 text-sm">
        {hasSubject ? (
          <span className="text-black dark:text-white">{group.subject!.name}</span>
        ) : (
          <span className="inline-flex items-center gap-1 text-warning text-xs font-medium">
            ⚠️ Sin asignatura
          </span>
        )}
      </td>

      {/* Semestre */}
      <td className="px-4 py-3 text-sm text-bodydark2">{group.semester?.name ?? '—'}</td>

      {/* Docente actual */}
      <td className="px-4 py-3 text-sm">
        {teacherName ? (
          <span className="inline-block rounded-full bg-primary bg-opacity-10 px-3 py-0.5 text-xs font-medium text-primary">
            {teacherName}
          </span>
        ) : (
          <span className="text-xs text-bodydark2 italic">Sin docente</span>
        )}
      </td>

      {/* Estado */}
      <td className="px-4 py-3">
        <span
          className={`inline-block rounded-full bg-opacity-10 px-3 py-0.5 text-xs font-semibold ${statusColor}`}
        >
          {statusLabel}
        </span>
      </td>

      {/* Acciones */}
      <td className="px-4 py-3">
        {!hasSubject ? (
          <span
            className="text-xs text-bodydark2 cursor-help"
            title="Este grupo no tiene asignatura asignada"
          >
            🔒 Sin asignatura
          </span>
        ) : !semesterIsActive ? (
          <span className="text-xs text-bodydark2">Semestre cerrado</span>
        ) : hasNotes ? (
          <span
            className="text-xs text-bodydark2 cursor-help"
            title="No se puede reasignar: el grupo tiene notas registradas"
          >
            🔒 Con notas
          </span>
        ) : (
          <button
            onClick={() => onAssign(group)}
            className="rounded bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-opacity-90 transition"
          >
            {hasTeacher ? 'Reasignar' : 'Asignar docente'}
          </button>
        )}
      </td>
    </tr>
  )
}

export default GruposTable