import React from 'react'
import {
    Career
} from '../../models/Career'
import {
    CreateSemesterDto,
    UpdateSemesterDto
} from '../../models/Semester'

interface Props {
  formData: CreateSemesterDto | UpdateSemesterDto
  onChange: (
    field: string,
    value: string | boolean
  ) => void
  onSubmit: () => void
  isEdit?: boolean
  careers?: Career[]
  loading?: boolean
}

const SemesterForm: React.FC<Props> = ({
  formData,
  onChange,
  onSubmit,
  isEdit = false,
  careers,
  loading = false
}) => {
  return (
    <div className="space-y-4">

      <div>
        <label className="block mb-1">
          Nombre
        </label>

        <input
          type="text"
          value={formData.name || ''}
          onChange={(e) =>
            onChange('name', e.target.value)
          }
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block mb-1">          Carrera asociada
        </label>

        <select
          value={formData.career_id || ''}
          onChange={(e) =>
            onChange('career_id', e.target.value)
          }
          className="w-full border rounded p-2"
        >
          <option value="">Seleccione una carrera</option>
          {careers?.map((career) => (
            <option key={career.id} value={career.id}>
              {career.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1">          Código
        </label>

        <input
          type="text"
          value={formData.code || ''}
          onChange={(e) =>
            onChange('code', e.target.value)
          }
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block mb-1">
          Fecha inicio
        </label>

        <input
          type="date"
          value={formData.start_date || ''}
          onChange={(e) =>
            onChange('start_date', e.target.value)
          }
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block mb-1">
          Fecha fin
        </label>

        <input
          type="date"
          value={formData.end_date || ''}
          onChange={(e) =>
            onChange('end_date', e.target.value)
          }
          className="w-full border rounded p-2"
        />
      </div>

      {'is_active' in formData && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.is_active || false}
            onChange={(e) =>
              onChange(
                'is_active',
                e.target.checked
              )
            }
          />

          <label>Activo</label>
        </div>
      )}

      <button
        type="button"
        onClick={onSubmit}
        disabled={loading}
        className="border border-blue-600 bg-transparent text-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (isEdit ? 'Actualizando...' : 'Guardando...') : isEdit ? 'Actualizar semestre' : 'Crear semestre'}
      </button>

    </div>
  )
}

export default SemesterForm