import { useParams } from 'react-router-dom'

import useDetalleGrupo from '../../hooks/useDetalleGrupo'
import AcademicInfoCard from '../../components/Group/AcademicInfoCard'

export default function DetalleGrupo() {
  const { id } = useParams<{ id: string }>()
  const { group, isLoading, error, academicInfo, isLoadingAcademic } =
    useDetalleGrupo(id ?? '')

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded dark:bg-gray-700" />
          <div className="h-4 w-64 bg-gray-200 rounded dark:bg-gray-700" />
        </div>
      </div>
    )
  }

  if (error || !group) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-500">{error ?? 'Grupo no encontrado.'}</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* ── Header (Tarea 11) ─────────────────────────────────────────── */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-5">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {group.name}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Código: <span className="font-medium">{group.group_code}</span>
          {' · '}Capacidad:{' '}
          <span className="font-medium">{group.capacity}</span>
        </p>
      </div>

      {/* ── Sección académica ─────────────────────────────────────────── */}
      {isLoadingAcademic && <AcademicInfoCard skeleton />}

      {!isLoadingAcademic && academicInfo && (
        <AcademicInfoCard info={academicInfo} />
      )}

      {!isLoadingAcademic && !academicInfo && (
        <p className="text-sm text-gray-400 dark:text-gray-500 italic">
          No se pudo cargar la información académica.
        </p>
      )}

      {/* ── TODO: secciones de tareas posteriores ─────────────────────── */}
    </div>
  )
}
