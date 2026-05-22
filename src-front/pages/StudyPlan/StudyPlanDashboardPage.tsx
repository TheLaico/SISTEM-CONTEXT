import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { studyPlanBusiness } from '../../business/StudyPlanBusiness'
import AddSubjectModal from '../../components/StudyPlan/AddSubjectModal'
import DeleteSubjectModal from '../../components/StudyPlan/DeleteSubjectModal'
import PublishVersionModal from '../../components/StudyPlan/PublishVersionModal'
import StudyPlanCatalog from '../../components/StudyPlan/StudyPlanCatalog'
import StudyPlanDetailsCard from '../../components/StudyPlan/StudyPlanDetailsCard'
import StudyPlanSection from '../../components/StudyPlan/StudyPlanSection'
import StudyPlanVersionPanel from '../../components/StudyPlan/StudyPlanVersionPanel'
import useStudyPlans from '../../hooks/useStudyPlans'
import { StudyPlanVersion } from '../../models/StudyPlanVersion'
import { Subject } from '../../models/Subject'
import { studyPlanService } from '../../services/studyPlanService'
import { subjectService } from '../../services/subjectService'
import { StudyPlanSubject } from '../../types/studyPlan'
import EditSubjectModal from './EditSubjectModal'

const StudyPlanDashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const { studyPlans, careers, refresh: refreshPlans } = useStudyPlans()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [subjectSearch, setSubjectSearch] = useState('')
  const [selectedCareerId, setSelectedCareerId] = useState('')
  const [versions, setVersions] = useState<StudyPlanVersion[]>([])
  const [selectedVersion, setSelectedVersion] = useState<StudyPlanVersion | null>(null)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [planSubjects, setPlanSubjects] = useState<StudyPlanSubject[]>([])
  const [openAdd, setOpenAdd] = useState(false)
  const [selectedEditSubject, setSelectedEditSubject] = useState<{ planId: string; subject: StudyPlanSubject } | null>(null)
  const [selectedDeletePlan, setSelectedDeletePlan] = useState<{ planId: string; subjectId: string; subjectName: string } | null>(null)
  const [publishOpen, setPublishOpen] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (careers.length > 0 && !selectedCareerId) {
      setSelectedCareerId(String(careers[0].id))
    }
  }, [careers, selectedCareerId])

  useEffect(() => {
    if (selectedCareerId) {
      loadVersions(selectedCareerId)
    }
  }, [selectedCareerId])

  useEffect(() => {
    loadSubjects()
  }, [])

  useEffect(() => {
    if (versions.length > 0 && !selectedVersion) {
      const published = versions.find((version) => version.is_published)
      setSelectedVersion(published || versions[0])
    }
  }, [versions, selectedVersion])

  useEffect(() => {
    if (selectedVersion) {
      loadPlanSubjects(selectedVersion)
    }
  }, [selectedVersion])

  const loadPlanSubjects = async (version: StudyPlanVersion) => {
    try {
      if (version == null || version.id == null) {
        console.warn('StudyPlanDashboard: loadPlanSubjects called with empty version', version)
        setPlanSubjects([])
        return
      }

      const data = await studyPlanService.getSubjectsByStudyPlan(version.id)
      console.debug('StudyPlanDashboard: loaded plan subjects for version', version.id, 'count', Array.isArray(data) ? data.length : 0)
      setPlanSubjects(data)
    } catch (err) {
      console.error(err)
    }
  }

  const loadSubjects = async () => {
    try {
      const data = await subjectService.getSubjects()
      setSubjects(data)
    } catch (error) {
      console.error(error)
    }
  }

  const loadVersions = async (careerId: string) => {
    try {
      const data = await studyPlanService.getVersionsByCareer(careerId)
      console.debug('StudyPlanDashboard: loaded versions for career', careerId, 'count', Array.isArray(data) ? data.length : 0)
      setVersions(data)
      const published = data.find((version) => version.is_published)
      setSelectedVersion(published || data[0] || null)
    } catch (error) {
      console.error(error)
    }
  }

  const careerOptions = careers
  const filteredSubjects = subjects.filter((subject) => {
    const query = subjectSearch.trim().toLowerCase()
    return (
      !query ||
      subject.name.toLowerCase().includes(query) ||
      subject.code.toLowerCase().includes(query)
    )
  })

  const currentCareer = careers.find((career) => String(career.id) === selectedCareerId)

  const handleSelectCareer = (careerCode: string): void => {
    setSelectedCareerId(careerCode)
    setSelectedVersion(null)
  }

  const handleSelectVersion = (version: StudyPlanVersion) => {
    setSelectedVersion(version)
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleOpenAddModal = (subject: Subject) => {
    setSelectedSubject(subject)
    setOpenAdd(true)
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleAddSubject = async (payload: { subject_id: string; suggested_semester: number; credits: number }) => {
    if (!selectedCareerId || !selectedVersion) {
      Swal.fire({ icon: 'warning', title: 'Seleccione una carrera y versión antes de agregar' })
      return
    }

    const subject = subjects.find((subject) => String(subject.id) === payload.subject_id)
    const selectedSubjectCode = subject?.code || subject?.name || payload.subject_id

    try {
      await studyPlanBusiness.createStudyPlan({
        career_id: selectedCareerId,
        subject_id: payload.subject_id,
        name: selectedSubjectCode,
        year: selectedVersion.year,
        suggested_semester: payload.suggested_semester
      })

      Swal.fire({ icon: 'success', title: 'Asignatura agregada', text: 'Se agregó la asignatura al plan.' })
      setOpenAdd(false)
      setSelectedSubject(null)

      // Refresca tanto los planes como los subjects de la versión actual
      await refreshPlans()
      await loadPlanSubjects(selectedVersion)

      sectionRef.current?.scrollIntoView({ behavior: 'smooth' })
    } catch (error: any) {
      Swal.fire({ icon: 'error', title: 'No se pudo agregar', text: error?.message || 'Ocurrió un error al agregar la asignatura' })
    }
  }

  const handleEditClick = (subject: StudyPlanSubject) => {
    const matching = studyPlans.find(
      (plan) =>
        String(plan.subject_id) === String(subject.subject_id) &&
        String(plan.career_id) === selectedCareerId &&
        (!selectedVersion || plan.year === selectedVersion.year)
    )

    if (!matching) {
      Swal.fire({ icon: 'warning', title: 'No se encontró el plan', text: 'No se pudo identificar el registro a editar' })
      return
    }

    setSelectedEditSubject({ planId: String(matching.id), subject })
  }

  const handleDeleteClick = (subject: StudyPlanSubject) => {
    const matching = studyPlans.find(
      (plan) =>
        String(plan.subject_id) === String(subject.subject_id) &&
        String(plan.career_id) === selectedCareerId &&
        (!selectedVersion || plan.year === selectedVersion.year)
    )

    if (!matching) {
      Swal.fire({ icon: 'warning', title: 'No se encontró el plan', text: 'No se pudo identificar el registro a eliminar' })
      return
    }

    setSelectedDeletePlan({
      planId: String(matching.id),
      subjectId: String(matching.subject_id),
      subjectName: subject.subject_name
    })
  }

  const handlePublish = async (year: number) => {
    if (!selectedCareerId) {
      Swal.fire({ icon: 'warning', title: 'Seleccione una carrera' })
      return
    }

    try {
      const version = await studyPlanBusiness.createVersion({
        career_id: selectedCareerId,
        year,
        name: `Versión ${year}`
      })
      await studyPlanBusiness.publishVersion(String(version.id), { career_id: selectedCareerId, replace_previous: true })

      Swal.fire({ icon: 'success', title: 'Versión publicada', text: 'La nueva versión ha reemplazado a la anterior.' })
      setPublishOpen(false)
      await loadVersions(selectedCareerId)
      await refreshPlans()
    } catch (error: any) {
      Swal.fire({ icon: 'error', title: 'No se pudo publicar', text: error?.message || 'Verifica el contenido del plan antes de publicar.' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Plan de estudios</h1>
              <p className="mt-2 text-gray-600">Define y versiona las asignaturas por semestre de cada carrera.</p>
              {selectedVersion ? (
                <div className="mt-3 inline-flex items-center gap-3 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-sm text-green-700">
                  <span className="font-semibold">Versión activa:</span>
                  <span>{selectedVersion.year}</span>
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-green-800 shadow-sm">{selectedVersion.is_published ? 'Publicado' : 'Borrador'}</span>
                </div>
              ) : null}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">Carrera</label>
                <select
                  value={selectedCareerId}
                  onChange={(e) => handleSelectCareer(e.target.value)}
                  className="mt-1 w-full rounded border-gray-200 bg-white px-2 py-2 text-sm text-gray-700"
                >
                  <option value="">Seleccione una carrera</option>
                  {careerOptions.map((career) => (
                    <option key={career.id} value={String(career.id)}>{career.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setPublishOpen(true)}
                  className="rounded-lg bg-green-600 px-4 py-2 text-white text-sm font-medium hover:bg-green-700"
                >
                  Nueva versión
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/study-plans/versions')}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
                >
                  Historial de versiones
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-3">
            <StudyPlanCatalog
              subjects={filteredSubjects}
              search={subjectSearch}
              onSearch={setSubjectSearch}
              onAdd={handleOpenAddModal}
            />
          </div>

          <div className="col-span-12 lg:col-span-6" ref={sectionRef}>
            <StudyPlanSection
              subjects={planSubjects}
              careerName={currentCareer?.name}
              version={selectedVersion}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          </div>

          <div className="col-span-12 lg:col-span-3 space-y-6">
            <StudyPlanDetailsCard
              careerName={currentCareer?.name}
              version={selectedVersion}
              planItems={planSubjects}
            />
            <StudyPlanVersionPanel
              versions={versions}
              selectedVersionId={selectedVersion?.id != null ? String(selectedVersion.id) : undefined}
              onSelectVersion={handleSelectVersion}
            />
          </div>
        </div>
      </div>

      <AddSubjectModal
        isOpen={openAdd}
        onClose={() => setOpenAdd(false)}
        subject={selectedSubject}
        careerName={currentCareer?.name}
        versionYear={selectedVersion?.year}
        onAdd={handleAddSubject}
      />

      <EditSubjectModal
        isOpen={Boolean(selectedEditSubject)}
        onClose={() => setSelectedEditSubject(null)}
        planId={selectedEditSubject?.planId}
        subject={selectedEditSubject?.subject}
        onUpdated={async () => {
          await refreshPlans()
          if (selectedVersion) await loadPlanSubjects(selectedVersion)
        }}
      />

      <DeleteSubjectModal
        isOpen={Boolean(selectedDeletePlan)}
        onClose={() => setSelectedDeletePlan(null)}
        planId={selectedDeletePlan?.planId}
        subjectId={selectedDeletePlan?.subjectId}
        subjectName={selectedDeletePlan?.subjectName}
        onRemoved={async () => {
          setSelectedDeletePlan(null)
          await refreshPlans()
          if (selectedVersion) await loadPlanSubjects(selectedVersion)
        }}
      />

      <PublishVersionModal
        isOpen={publishOpen}
        onClose={() => setPublishOpen(false)}
        onPublish={handlePublish}
      />
    </div>
  )
}

export default StudyPlanDashboardPage