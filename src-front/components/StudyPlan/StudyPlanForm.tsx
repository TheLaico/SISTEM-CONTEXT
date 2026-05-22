import React from 'react'

import {
    CreateStudyPlanDto,
    UpdateStudyPlanDto
} from '../../models/StudyPlan'
import { Career } from '../../models/Career'

interface Props {
  formData:
    | CreateStudyPlanDto
    | UpdateStudyPlanDto

  onChange: (
    field: string,
    value: string | number | boolean
  ) => void

  onSubmit: () => void

  loading?: boolean

  careers: Career[]
}

const StudyPlanForm: React.FC<Props> = ({
  formData,
  onChange,
  onSubmit,
  loading = false,
  careers
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">
          Nombre del plan / asignatura
        </label>

        <input
          type="text"
          value={formData.name || ''}
          onChange={(e) =>
            onChange('name', e.target.value)
          }
          className="w-full rounded border p-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Carrera
        </label>

        <select
          value={formData.career_id || ''}
          onChange={(e) => onChange('career_id', e.target.value)}
          className="w-full rounded border p-2"
        >
          <option value="">-- Selecciona una carrera --</option>
          {careers.map((career) => (
            <option key={career.id} value={career.id}>
              {career.name} ({career.code})
            </option>
          ))}
        </select>
      </div>

      {/* subject_id removed: backend does not accept subject_id on study plan creation */}

      <div>
        <label className="mb-1 block text-sm font-medium">
          Año del plan
        </label>

        <input
          type="number"
          value={formData.year || 0}
          onChange={(e) =>
            onChange(
              'year',
              Number(e.target.value)
            )
          }
          className="w-full rounded border p-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Semestre sugerido
        </label>

        <input
          type="number"
          value={
            formData.suggested_semester || 0
          }
          onChange={(e) =>
            onChange(
              'suggested_semester',
              Number(e.target.value)
            )
          }
          className="w-full rounded border p-2"
        />
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={loading}
        className="rounded bg-primary px-4 py-2 text-white"
      >
        {loading
          ? 'Saving...'
          : 'Save Study Plan'}
      </button>
    </div>
  )
}

export default StudyPlanForm