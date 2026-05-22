import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { careerBusiness } from '../../business/CareerBusiness'
import { registrationBusiness } from '../../business/RegistrationBusiness'
import { semesterBusiness } from '../../business/SemesterBusiness'
import { studyPlanBusiness } from '../../business/StudyPlanBusiness'
import { Career } from '../../models/Career'
import { Semester } from '../../models/Semester'

const DetailCareer = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [career, setCareer] = useState<Career | null>(null)
  const [semesters, setSemesters] = useState<Semester[]>([])
  const [studentCount, setStudentCount] = useState(0)
  const [studyPlanCount, setStudyPlanCount] = useState(0)

  useEffect(() => {
    if (id) {
      loadCareerDetails(id)
    }
  }, [id])

  const loadCareerDetails = async (careerId: string) => {
    try {
      setLoading(true)
      const [careers, semestersList, registrations, studyPlans] = await Promise.all([
        careerBusiness.getCareers(),
        semesterBusiness.getSemesters(),
        registrationBusiness.getRegistrations(),
        studyPlanBusiness.getStudyPlans()
      ])

      const found = careers.find((c) => c.id === careerId)
      if (!found) {
        Swal.fire({
          title: 'Error',
          text: 'Carrera no encontrada',
          icon: 'error'
        })
        navigate('/carreras/list')
        return
      }

      setCareer(found)
      const associatedSemesters = semestersList.filter((s) => s.career_id === careerId)
      setSemesters(associatedSemesters)
      const students = registrations.filter(
        (r) => r.career_id === careerId && r.is_active
      ).length
      setStudentCount(students)
      const plans = studyPlans.filter((p) => p.career_id === careerId).length
      setStudyPlanCount(plans)
    } catch (error: any) {
      Swal.fire({
        title: 'Error',
        text: error.message || 'No se pudieron cargar los detalles',
        icon: 'error'
      })
      navigate('/carreras/list')
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

  if (!career) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-red-600">Carrera no encontrada</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => navigate('/carreras/list')}
          className="mb-4 inline-flex items-center rounded-lg bg-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 transition-colors"
        >
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </button>
        <h1 className="text-3xl font-bold text-gray-900">{career.name}</h1>
        <p className="mt-2 text-gray-600">Código: {career.code}</p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {/* Card: Descripción */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Descripción</h3>
          <p className="mt-2 text-gray-900">{career.description || 'Sin descripción'}</p>
        </div>

        {/* Card: Estado */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Estado</h3>
          <div className="mt-2">
            <span
              className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                career.is_active
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {career.is_active ? 'Activa' : 'Archivada'}
            </span>
          </div>
        </div>

        {/* Card: Estadísticas */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Estadísticas</h3>
          <div className="mt-2 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Períodos:</span>
              <span className="font-semibold text-gray-900">{semesters.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estudiantes:</span>
              <span className="font-semibold text-gray-900">{studentCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Planes:</span>
              <span className="font-semibold text-gray-900">{studyPlanCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Semesters Table */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Períodos Académicos</h2>
        {semesters.length === 0 ? (
          <p className="text-center py-4 text-gray-500">No hay períodos asociados a esta carrera</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Código</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nombre</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Fechas</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Estado</th>
                </tr>
              </thead>
              <tbody>
                {semesters.map((semester) => (
                  <tr key={semester.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">{semester.code}</td>
                    <td className="px-6 py-3 text-sm text-gray-900">{semester.name}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">
                      {semester.start_date} hasta {semester.end_date}
                    </td>
                    <td className="px-6 py-3 text-center">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          semester.is_active
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {semester.is_active ? 'Activo' : 'Cerrado'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate(`/carreras/edit/${career.id}`)}
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Editar
        </button>
        <button
          onClick={() => navigate('/carreras/list')}
          className="inline-flex items-center rounded-lg bg-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400 transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  )
}

export default DetailCareer
