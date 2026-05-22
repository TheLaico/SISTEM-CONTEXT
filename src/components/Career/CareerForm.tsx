// src/components/Career/CareerForm.tsx

import React from 'react'

import {
  CreateCareerDto,
  UpdateCareerDto
} from '../../models/Career'

interface Props {
  formData:
    | CreateCareerDto
    | UpdateCareerDto

  onChange: (
    field: string,
    value: string | boolean
  ) => void

  onSubmit: () => void

  loading?: boolean
}

const CareerForm: React.FC<Props> = ({
  formData,
  onChange,
  onSubmit,
  loading = false
}) => {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit() }} className="space-y-6">
      <div>
        <label htmlFor="code" className="block text-sm font-medium text-gray-900 mb-2">
          Código *
        </label>
        <input
          id="code"
          type="text"
          value={formData.code || ''}
          onChange={(e) =>
            onChange('code', e.target.value)
          }
          placeholder="Ej. ING-SIS"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
          Nombre *
        </label>
        <input
          id="name"
          type="text"
          value={formData.name || ''}
          onChange={(e) =>
            onChange('name', e.target.value)
          }
          placeholder="Ej. Ingeniería de Sistemas"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">
          Descripción
        </label>
        <textarea
          id="description"
          value={
            formData.description || ''
          }
          onChange={(e) =>
            onChange(
              'description',
              e.target.value
            )
          }
          placeholder="Describe la carrera..."
          rows={4}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3">
        <input
          id="is_active"
          type="checkbox"
          checked={formData.is_active ?? false}
          onChange={(e) =>
            onChange('is_active', e.target.checked)
          }
          className="h-4 w-4 rounded border-gray-300 text-blue-600"
        />
        <label htmlFor="is_active" className="text-sm font-medium text-gray-900">
          Carrera activa
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="rounded-lg border border-gray-300 px-6 py-2 font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          //className="rounded-lg bg-green-600 px-6 py-2 font-medium text-white hover:bg-green-700 disabled:bg-gray-400"
         // className="rounded-lg bg-gray px-6 py-2 font-medium text-yellow-400"
        className="border border-yellow-400 rounded-lg bg-gray-800 px-6 py-2 font-medium text-yellow-400"
        >
          {loading
            ? 'Guardando...'
            : 'Guardar carrera'}
        </button>
      </div>
    </form>
  )
}

export default CareerForm