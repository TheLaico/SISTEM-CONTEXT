import React from 'react'
import { StudyPlanVersion } from '../../models/StudyPlanVersion'
import { StudyPlanSubject } from '../../types/studyPlan'

interface Props {
  careerName?: string
  version?: StudyPlanVersion | null
  planItems: StudyPlanSubject[]
}

const StudyPlanDetailsCard: React.FC<Props> = ({ careerName, version, planItems }) => {
  const totalCredits = planItems.reduce((sum, item) => sum + (item.credits || 0), 0)

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-black dark:text-white">Detalles del plan</h3>
      <div className="space-y-2 text-sm text-gray-700">
        <div>Carrera: {careerName || 'Sin carrera seleccionada'}</div>
        <div>Versión: {version ? `${version.year}` : 'Sin versión'}</div>
        <div>
          Estado:
          <span className={`ml-2 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${version?.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {version?.is_published ? 'Publicado' : 'Borrador'}
          </span>
        </div>
        <div>Total asignaturas: {planItems.length}</div>
        <div>Total créditos: {totalCredits}</div>
        <div>Última actualización: {version?.updated_at || 'N/A'}</div>
      </div>
    </div>
  )
}

export default StudyPlanDetailsCard
