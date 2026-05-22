import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { semesterBusiness } from '../../business/SemesterBusiness'
import useCarreras from '../../hooks/useCareer'
import { Semester } from '../../models/Semester'

const DetailSemester = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [semester, setSemester] = useState<Semester | null>(null)
  const [careerName, setCareerName] = useState('')
  const { careers } = useCarreras()

  useEffect(() => {
    if (id) {
      loadSemesterDetails(id)
    }
  }, [id])

  useEffect(() => {
    if (semester && careers.length > 0) {
      const career = careers.find((c) => c.id === semester.career_id)
      setCareerName(career?.name || 'Carrera no encontrada')
    }
  }, [semester, careers])

  const loadSemesterDetails = async (semesterId: string) => {
    try {
      setLoading(true)
      const semesters = await semesterBusiness.getSemesters()
      const found = semesters.find((s) => s.id === semesterId)
      if (!found) {
        Swal.fire({
          title: 'Error',
          text: 'Período académico no encontrado',
          icon: 'error'
        })
        navigate('/semestres/list')
        return
      }
      setSemester(found)
    } catch (error: any) {
      Swal.fire({
        title: 'Error',
        text: error.message || 'No se pudieron cargar los detalles',
        icon: 'error'
      })
      navigate('/semestres/list')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500">Cargando...</p>
      </div>
    )
  }

  if (!semester) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-red-600">Período académico no encontrado</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => navigate('/semestres/list')}
          className="mb-4 inline-flex items-center rounded-lg bg-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 transition-colors"
        >
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </button>
        <h1 className="text-3xl font-bold text-gray-900">{semester.name}</h1>
        <p className="mt-2 text-gray-600">Código: {semester.code}</p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {/* Card: Carrera */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Carrera Asociada</h3>
          <p className="mt-2 text-lg font-semibold text-gray-900">{careerName}</p>
        </div>

        {/* Card: Estado */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Estado</h3>
          <div className="mt-2">
            <span
              className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                semester.is_active
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {semester.is_active ? 'Activo' : 'Cerrado'}
            </span>
          </div>
        </div>

        {/* Card: Fecha Inicio */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Fecha de Inicio</h3>
          <p className="mt-2 text-lg font-semibold text-gray-900">{semester.start_date}</p>
        </div>

        {/* Card: Fecha Fin */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Fecha de Fin</h3>
          <p className="mt-2 text-lg font-semibold text-gray-900">{semester.end_date}</p>
        </div>
      </div>

      {/* Duración */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Período Completo</h3>
        <p className="text-gray-900">
          <strong>Desde:</strong> {semester.start_date} <strong>Hasta:</strong> {semester.end_date}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate(`/semestres/edit/${semester.id}`)}
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Editar
        </button>
        <button
          onClick={() => navigate('/semestres/list')}
          className="inline-flex items-center rounded-lg bg-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400 transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  )
}

export default DetailSemester
