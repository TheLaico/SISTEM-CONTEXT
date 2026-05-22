// src/pages/PlanEstudios/components/VersionHistoryTable.tsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { StudyPlan } from '../../../models/StudyPlan'

interface Props {
  versions: StudyPlan[]
  onDuplicate: (plan: StudyPlan) => void
  loading?: boolean
}

const VersionHistoryTable: React.FC<Props> = ({ versions, onDuplicate, loading }) => {
  const navigate = useNavigate()

  return (
    <div className="rounded-2xl border border-stroke bg-white shadow-card dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke px-5 py-4 dark:border-strokedark">
        <h3 className="text-base font-semibold text-black dark:text-white">Historial de versiones</h3>
        <p className="mt-0.5 text-xs text-body dark:text-bodydark">
          La versión publicada aplica a nuevas cohortes
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8 text-sm text-body dark:text-bodydark">
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Cargando versiones...
        </div>
      ) : versions.length === 0 ? (
        <div className="py-8 text-center text-sm text-body dark:text-bodydark">
          No hay versiones para este plan.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-stroke dark:divide-strokedark">
            <thead>
              <tr className="bg-gray dark:bg-meta-4">
                {['Año / Versión', 'Nombre', 'Fecha publicación', 'Estado', 'Asignaturas', 'Acciones'].map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-body dark:text-bodydark"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stroke dark:divide-strokedark">
              {versions.map((version) => (
                <tr key={version.id} className="transition hover:bg-gray dark:hover:bg-meta-4">
                  <td className="px-4 py-3 text-sm font-semibold text-black dark:text-white">
                    {version.year}
                  </td>
                  <td className="px-4 py-3 text-sm text-black dark:text-white">{version.name}</td>
                  <td className="px-4 py-3 text-sm text-body dark:text-bodydark">
                    {version.is_published && version.updated_at
                      ? new Date(version.updated_at).toLocaleDateString('es-CO')
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        version.is_published
                          ? 'bg-meta-3 bg-opacity-10 text-meta-3'
                          : 'bg-warning bg-opacity-10 text-warning'
                      }`}
                    >
                      {version.is_published ? 'Publicado' : 'Borrador'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-center text-black dark:text-white">
                    {(version as any).total_subjects ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/study-plans/${version.id}`)}
                        className="rounded border border-stroke px-2.5 py-1 text-xs font-medium text-black transition hover:border-primary hover:text-primary dark:border-strokedark dark:text-white"
                      >
                        Ver versión
                      </button>
                      <button
                        type="button"
                        onClick={() => onDuplicate(version)}
                        className="rounded border border-stroke px-2.5 py-1 text-xs font-medium text-black transition hover:border-primary hover:text-primary dark:border-strokedark dark:text-white"
                      >
                        Duplicar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default VersionHistoryTable