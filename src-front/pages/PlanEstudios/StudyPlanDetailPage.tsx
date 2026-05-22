// src/pages/PlanEstudios/StudyPlanDetailPage.tsx
import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { StudyPlan } from '../../models/StudyPlan'
import { Career } from '../../models/Career'
import { studyPlanService } from '../../services/studyPlanService'
import { groupSubjectsBySemester, calcularTotalCreditos } from '../../business/StudyPlanBusiness'
import { StudyPlanSubject } from '../../types/studyPlan'
import SemesterStructureView from './components/SemesterStructureView'
import PlanSubjectsSection from './components/PlanSubjectsSection'
import VersionHistoryTable from './components/VersionHistoryTable'
import EditPlanModal from './components/EditPlanModal'

const StatusBadge: React.FC<{ isPublished: boolean }> = ({ isPublished }) => (
  <span
    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${isPublished
      ? 'bg-meta-3 bg-opacity-10 text-meta-3'
      : 'bg-warning bg-opacity-10 text-warning'
      }`}
  >
    {isPublished ? 'Publicado' : 'Borrador'}
  </span>
)

const StudyPlanDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const defaultTab = searchParams.get('tab') === 'history' ? 'history' : 'structure'

  const [plan, setPlan] = useState<StudyPlan | null>(null)
  const [career, setCareer] = useState<Career | null>(null)
  const [subjects, setSubjects] = useState<StudyPlanSubject[]>([])
  const [versions, setVersions] = useState<StudyPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'structure' | 'subjects' | 'history'>(defaultTab as any)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const subjectsBySemester = useMemo(() => groupSubjectsBySemester(subjects), [subjects])
  const totalCredits = useMemo(() => calcularTotalCreditos(subjects), [subjects])

  useEffect(() => {
    if (!id) return
    loadAll()
  }, [id])

  const loadAll = async () => {
    if (!id) return
    setLoading(true)
    try {
      const planData = await studyPlanService.getStudyPlanById(id)
      setPlan(planData)

      const [subjectsData, careersData] = await Promise.all([
        studyPlanService.getSubjectsByStudyPlan(id),
        studyPlanService.getCareers(),
      ])
      setSubjects(subjectsData ?? [])

      const foundCareer = careersData.find(
        (c) => String(c.id) === String(planData.career_id)
      )
      setCareer(foundCareer ?? null)

      // Cargar versiones de la misma carrera
      if (planData.career_id) {
        const versionsData = await studyPlanService.getVersionsByCareer(
          String(planData.career_id)
        )
        setVersions(versionsData ?? [])
      }
    } catch (err: any) {
      toast.error(err?.message || 'No se pudo cargar el plan')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-body dark:text-bodydark">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Cargando plan de estudios...
        </div>
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3">
        <p className="text-base font-medium text-black dark:text-white">Plan no encontrado</p>
        <button
          type="button"
          onClick={() => navigate('/plan-estudios')}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
        >
          Volver a planes
        </button>
      </div>
    )
  }

  const TABS = [
    { key: 'structure', label: 'Estructura por semestres' },
    { key: 'subjects', label: 'Tabla de asignaturas' },
    { key: 'history', label: 'Historial de versiones' },
  ] as const

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-5 flex items-center gap-2 text-sm text-body dark:text-bodydark">
        <Link to="/" className="font-medium hover:text-primary">Inicio</Link>
        <span>›</span>
        <Link to="/plan-estudios" className="font-medium hover:text-primary">Planes de Estudio</Link>
        <span>›</span>
        <span className="font-semibold text-black dark:text-white">{plan.name}</span>
      </nav>

      {/* Card de información general */}
      <div className="mb-6 rounded-2xl border border-stroke bg-white p-6 shadow-card dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-title-sm font-bold text-black dark:text-white">{plan.name}</h1>
              <StatusBadge isPublished={plan.is_published} />
            </div>
            <p className="mt-1 text-sm text-body dark:text-bodydark">
              {career?.name || `Carrera ${plan.career_id}`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-black transition hover:border-primary hover:text-primary dark:border-strokedark dark:text-white"
            >
              Editar
            </button>
            {!plan.is_published && (
              <button
                type="button"
                onClick={() => navigate(`/plan-estudios?publish=${id}`)}
                className="rounded-lg bg-success px-4 py-2 text-sm font-medium text-white transition hover:bg-opacity-90"
              >
                Publicar
              </button>
            )}
          </div>
        </div>

        {/* Información general */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <InfoCard label="Carrera" value={career?.name || `ID: ${plan.career_id}`} />
          <InfoCard label="Nombre" value={plan.name} />
          <InfoCard label="Año / Versión" value={String(plan.year)} />
          <InfoCard label="Estado" value={plan.is_published ? 'Publicado' : 'Borrador'} highlight={plan.is_published ? 'green' : 'yellow'} />
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-5 flex border-b border-stroke dark:border-strokedark">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-3 text-sm font-medium transition ${activeTab === tab.key
              ? 'border-b-2 border-primary text-primary'
              : 'text-body hover:text-black dark:text-bodydark dark:hover:text-white'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Estructura por semestres */}
      {activeTab === 'structure' && (
        <SemesterStructureView
          subjectsBySemester={subjectsBySemester}
          totalSubjects={subjects.length}
          totalCredits={totalCredits}
          updatedAt={plan.updated_at}
        />
      )}

      {/* Tab: Tabla de asignaturas */}
      {activeTab === 'subjects' && (
        <PlanSubjectsSection
          planId={id ?? null}
          subjects={subjects}
          isPublished={plan.is_published}
          onSubjectRemoved={loadAll}
          onAddSubject={() => navigate(`/plan-estudios?addSubject=${id}`)}
        />
      )}

      {/* Tab: Historial de versiones */}
      {activeTab === 'history' && (
        <VersionHistoryTable
          versions={versions}
          onDuplicate={async (v) => {
            toast.success('Duplicando versión...')
            // Se puede delegar a StudyPlanBusiness.handleDuplicatePlan
          }}
        />
      )}
      <EditPlanModal
        isOpen={isEditModalOpen}
        plan={plan}
        careers={career ? [career] : []}  
        onUpdated={() => {
          setIsEditModalOpen(false)
          loadAll()  
        }}
        onCancel={() => setIsEditModalOpen(false)}
      />
    </div>
  )
}

// Componente auxiliar
const InfoCard: React.FC<{
  label: string
  value: string
  highlight?: 'green' | 'yellow'
}> = ({ label, value, highlight }) => (
  <div className="rounded-xl bg-gray-2 p-3.5 dark:bg-meta-4">
    <p className="text-xs font-semibold uppercase tracking-wide text-body dark:text-bodydark">{label}</p>
    {highlight ? (
      <span
        className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${highlight === 'green'
          ? 'bg-meta-3 bg-opacity-10 text-meta-3'
          : 'bg-warning bg-opacity-10 text-warning'
          }`}
      >
        {value}
      </span>
    ) : (
      <p className="mt-1 text-sm font-medium text-black dark:text-white">{value}</p>
    )}
  </div>
)

export default StudyPlanDetailPage