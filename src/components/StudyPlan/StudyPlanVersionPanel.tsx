import React from 'react'
import { StudyPlanVersion } from '../../models/StudyPlanVersion'

interface Props {
  versions: StudyPlanVersion[]
  selectedVersionId?: string
  onSelectVersion: (version: StudyPlanVersion) => void
}

const StudyPlanVersionPanel: React.FC<Props> = ({ versions, selectedVersionId, onSelectVersion }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-black dark:text-white">Historial de versiones</h3>
      <div className="space-y-3">
        {versions.length === 0 ? (
          <div className="text-sm text-gray-500">No hay versiones disponibles.</div>
        ) : (
          versions.map((version) => (
            <div
              key={version.id}
              className={`flex items-center justify-between rounded-md border px-4 py-3 ${selectedVersionId === version.id ? 'border-primary bg-blue-50 dark:bg-meta-4' : 'border-stroke bg-white dark:border-strokedark dark:bg-boxdark'}`}
            >
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                  <span>{version.name || version.year}</span>
                  {version.is_published && <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">Publicado</span>}
                </div>
                <div className="mt-1 text-xs text-gray-500">{version.subjects_count ?? 0} asignaturas • {version.total_credits ?? 0} créditos</div>
              </div>
              <button
                type="button"
                onClick={() => onSelectVersion(version)}
                className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1 text-sm font-medium text-white transition hover:bg-opacity-90"
              >
                Ver
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default StudyPlanVersionPanel
