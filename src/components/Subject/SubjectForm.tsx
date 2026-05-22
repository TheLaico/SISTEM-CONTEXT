import React from 'react'

import {
    CreateSubjectDto,
    UpdateSubjectDto
} from '../../models/Subject'

interface Props {
  formData: CreateSubjectDto | UpdateSubjectDto
  showCode?: boolean
  codeReadOnly?: boolean

  onChange: (
    field: string,
    value: string | number | boolean
  ) => void

  onSubmit: () => void

  loading?: boolean
}

const SubjectForm: React.FC<Props> = ({
  formData,
  showCode = true,
  codeReadOnly = false,
  onChange,
  onSubmit,
  loading = false
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Nombre</label>
        <input
          type="text"
          value={formData.name || ''}
          onChange={(e) => onChange('name', e.target.value)}
          className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {showCode && (
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Código</label>
          <input
            type="text"
            value={formData.code || ''}
            onChange={(e) => onChange('code', e.target.value)}
            readOnly={codeReadOnly}
            className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
          />
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Descripción</label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => onChange('description', e.target.value)}
          className="min-h-[120px] w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Créditos</label>
        <input
          type="number"
          min={0}
          value={formData.credits || 0}
          onChange={(e) => onChange('credits', Number(e.target.value))}
          className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {'is_active' in formData && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.is_active ?? false}
            onChange={(e) => onChange('is_active', e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600"
          />
          <label className="text-sm font-medium text-gray-700">Asignatura activa</label>
        </div>
      )}

      <button
        type="button"
        onClick={onSubmit}
        disabled={loading}
        className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
      >
        {loading ? 'Guardando...' : 'Guardar'}
      </button>
    </div>
  )
}

export default SubjectForm