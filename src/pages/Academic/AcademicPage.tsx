import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { careerBusiness } from '../../business/CareerBusiness'
import { semesterBusiness } from '../../business/SemesterBusiness'
import CareerTable from '../../components/Career/CareerTable'
import SemesterTable from '../../components/Semester/SemesterTable'
import useCarreras from '../../hooks/useCareer'
import { useSemester } from '../../hooks/useSemester'
import { Career } from '../../models/Career'
import { Semester } from '../../models/Semester'



const AcademicPage = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'careers' | 'semesters'>('careers')
  const {
    careers,
    loading: careerLoading,
    error: careerError,
    refresh: refreshCareers
  } = useCarreras()
  const { semesters, loading: semesterLoading, error: semesterError, loadSemesters } = useSemester()

  useEffect(() => {
    loadSemesters()
  }, [])

  const handleCareerEdit = (career: Career) => {
    navigate(`/carreras/edit/${career.id}`)
  }

  const handleCareerView = (career: Career) => {
    navigate(`/carreras/detail/${career.id}`)
  }

  const handleCareerArchive = async (career: Career) => {
    const result = await Swal.fire({
      title: '¿Archivar carrera?',
      text: `¿Está seguro de que desea archivar "${career.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, archivar',
      cancelButtonText: 'Cancelar',
      buttonsStyling: true
    })

    if (result.isConfirmed) {
      try {
        await careerBusiness.deleteCareer(career.id)
        Swal.fire({
          title: 'Éxito',
          text: 'Carrera archivada correctamente',
          icon: 'success'
        })
        await refreshCareers()
      } catch (error: any) {
        Swal.fire({
          title: 'Error',
          text: error?.message || 'No se pudo archivar la carrera',
          icon: 'error'
        })
      }
    }
  }

  const handleSemesterEdit = (semester: Semester) => {
    navigate(`/semestres/edit/${semester.id}`)
  }

  const handleSemesterView = (semester: Semester) => {
    navigate(`/semestres/detail/${semester.id}`)
  }

  const handleSemesterArchive = async (semester: Semester) => {
    const result = await Swal.fire({
      title: '¿Cerrar semestre?',
      text: `¿Está seguro de que desea cerrar "${semester.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar',
      cancelButtonText: 'Cancelar',
      buttonsStyling: true
    })

    if (result.isConfirmed) {
      try {
        await semesterBusiness.updateSemester(semester.id, { is_active: false })
        Swal.fire({
          title: 'Éxito',
          text: 'Semestre cerrado correctamente',
          icon: 'success'
        })
        loadSemesters()
      } catch (error: any) {
        Swal.fire({
          title: 'Error',
          text: error?.message || 'No se pudo cerrar el semestre',
          icon: 'error'
        })
      }
    }
  }

  return (
    <div className="space-y-8">
      {/* TAB NAVIGATION */}
      <div className="border-b border-gray-200 bg-white">
        <div className="flex gap-8">
          {/* Careers Tab */}
          <button
            onClick={() => setActiveTab('careers')}
            className={`px-1 py-4 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === 'careers'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17.25c0 5.105 3.07 9.408 7.5 11.398m0-23c5.5 0 10 4.745 10 10.997v13m0-13c5.43 1.99 8.5 6.293 8.5 11.398 0 5.105-3.07 9.408-7.5 11.398" />
              </svg>
              Carreras
            </div>
          </button>

          {/* Semesters Tab */}
          <button
            onClick={() => setActiveTab('semesters')}
            className={`px-1 py-4 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === 'semesters'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Períodos Académicos
            </div>
          </button>
        </div>
      </div>

      {/* TAB CONTENT: CAREERS */}
      {activeTab === 'careers' && (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Carreras Académicas</h2>
            <button
              onClick={() => navigate('/carreras/create')}
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-black hover:bg-blue-700 transition-colors"
            >
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nueva Carrera
            </button>
          </div>
          {careerLoading ? (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
              <p className="text-gray-500">Cargando carreras...</p>
            </div>
          ) : careerError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
              <p className="text-red-600">Error al cargar las carreras</p>
            </div>
          ) : (
            <CareerTable
              careers={careers || []}
              onEdit={handleCareerEdit}
              onView={handleCareerView}
              onArchive={handleCareerArchive}
            />
          )}
        </div>
      )}

      {/* TAB CONTENT: SEMESTERS */}
      {activeTab === 'semesters' && (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Períodos Académicos</h2>
       
              <button
                onClick={() => navigate('/semestres/create')}
                className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nuevo Período
              </button> 
          </div>
          {semesterLoading ? (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
              <p className="text-gray-500">Cargando períodos académicos...</p>
            </div>
          ) : semesterError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
              <p className="text-red-600">Error al cargar los períodos académicos</p>
            </div>
          ) : (
            <SemesterTable
              semesters={semesters || []}
              onEdit={handleSemesterEdit}
              onView={handleSemesterView}
              onArchive={handleSemesterArchive}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default AcademicPage
