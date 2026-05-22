import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { studyPlanBusiness } from '../../business/StudyPlanBusiness'
import useCarreras from '../../hooks/useCareer'
import { StudyPlanVersion } from '../../models/StudyPlanVersion'

const VersionHistory: React.FC = () => {
  const navigate = useNavigate()
  const { careers, loading: careersLoading, error: careersError } = useCarreras()
  const [selectedCareerId, setSelectedCareerId] = useState('')
  const [versions, setVersions] = useState<StudyPlanVersion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (careers.length > 0 && !selectedCareerId) {
      setSelectedCareerId(careers[0].code)
    }
  }, [careers, selectedCareerId])

  useEffect(() => {
    if (selectedCareerId) {
      loadVersions(selectedCareerId)
    }
  }, [selectedCareerId])

  const loadVersions = async (careerId: string) => {
    setLoading(true)
    setError(null)

    try {
      const data = await studyPlanBusiness.getVersionsByCareer(careerId)
      setVersions(data)
    } catch (err: any) {
      setError(err?.message || 'No se pudieron cargar las versiones')
      setVersions([])
    } finally {
      setLoading(false)
    }
  }

  const currentCareer = careers.find((career) => career.code === selectedCareerId)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Historial de versiones</h1>
            <p className="mt-2 text-sm text-gray-600">Consulta las versiones del plan de estudios por carrera.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/study-plans/dashboard')}
            className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            Volver al dashboard
          </button>
        </div>

        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-700">Carrera</p>
              <p className="text-sm text-gray-500">Selecciona una carrera para ver su historial de versiones.</p>
            </div>
            <div className="w-full sm:w-1/3">
              <select
                value={selectedCareerId}
                onChange={(e) => setSelectedCareerId(e.target.value)}
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700"
              >
                <option value="">Seleccione una carrera</option>
                {careers.map((career) => (
                  <option key={career.id} value={career.code}>
                    {career.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Versiones de {currentCareer?.name || 'la carrera seleccionada'}</h2>
              <p className="text-sm text-gray-500">La versión publicada es la que se aplica a nuevas cohortes.</p>
            </div>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {versions.length} versiones
            </span>
          </div>

          {careersLoading || loading ? (
            <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center text-sm text-gray-500">Cargando versiones...</div>
          ) : error || careersError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error || careersError}</div>
          ) : versions.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center text-sm text-gray-500">No hay versiones para esta carrera.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Año</th>
                    <th className="px-4 py-3">Nombre</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3">Asignaturas</th>
                    <th className="px-4 py-3">Créditos</th>
                    <th className="px-4 py-3">Creado</th>
                    <th className="px-4 py-3">Actualizado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {versions.map((version) => (
                    <tr key={version.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 font-semibold text-gray-800">{version.year}</td>
                      <td className="px-4 py-4 text-gray-700">{version.name}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${version.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {version.is_published ? 'Publicado' : 'Borrador'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-700">{version.subjects_count ?? '-'}</td>
                      <td className="px-4 py-4 text-gray-700">{version.total_credits ?? '-'}</td>
                      <td className="px-4 py-4 text-gray-500">{version.created_at ? new Date(version.created_at).toLocaleDateString() : '-'}</td>
                      <td className="px-4 py-4 text-gray-500">{version.updated_at ? new Date(version.updated_at).toLocaleDateString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VersionHistory
