// src/hooks/useAdminStudyPlans.ts
import { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'

import {
  calcularTotalCreditos,
  filterAvailableSubjects,
  groupSubjectsBySemester,
  searchSubjects,
  sortStudyPlanVersions,
  validatePublishForm,
} from '../business/StudyPlanBusiness'
import { Career } from '../models/Career'
import { StudyPlan } from '../models/StudyPlan'
import { Subject } from '../models/Subject'
import { studyPlanService } from '../services/studyPlanService'
import { StudyPlanSubject } from '../types/studyPlan'

export type PlanStatus = 'all' | 'borrador' | 'publicado' | 'archivado'

export interface AdminStudyPlanFilters {
  careerId: string
  yearVersion: string
  status: PlanStatus
}

const useAdminStudyPlans = () => {
  // ── Datos base ────────────────────────────────────────────────────────────
  const [careers, setCareers] = useState<Career[]>([])
  const [allPlans, setAllPlans] = useState<StudyPlan[]>([])
  const [allSubjects, setAllSubjects] = useState<Subject[]>([])

  // ── Selección y detalle ───────────────────────────────────────────────────
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [planSubjects, setPlanSubjects] = useState<StudyPlanSubject[]>([])
  const [loadingPlanSubjects, setLoadingPlanSubjects] = useState(false)

  // ── Filtros ───────────────────────────────────────────────────────────────
  const [filters, setFilters] = useState<AdminStudyPlanFilters>({
    careerId: '',
    yearVersion: '',
    status: 'all',
  })

  // ── Búsqueda de asignatura para agregar ───────────────────────────────────
  const [subjectSearchQuery, setSubjectSearchQuery] = useState('')

  // ── UI state ──────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false)
  const [loadingAction, setLoadingAction] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ── Modales ───────────────────────────────────────────────────────────────
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isNewVersionModalOpen, setIsNewVersionModalOpen] = useState(false)
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false)
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false)
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false)
  const [planForAction, setPlanForAction] = useState<StudyPlan | null>(null)

  // ── Año para publicar ─────────────────────────────────────────────────────
  const [publishYear, setPublishYear] = useState<number>(new Date().getFullYear())

  // ── Carga inicial ─────────────────────────────────────────────────────────
  const loadInitialData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [careersData, plansData, subjectsData] = await Promise.all([
        studyPlanService.getCareers(),
        studyPlanService.getStudyPlans(),
        studyPlanService.getAllSubjects(),
      ])
      setCareers(careersData ?? [])
      setAllPlans(plansData ?? [])
      setAllSubjects(subjectsData ?? [])
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al cargar datos'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadInitialData()
  }, [loadInitialData])

  // ── Cargar asignaturas de un plan ─────────────────────────────────────────
  const loadPlanSubjects = useCallback(async (planId: string | number) => {
    setLoadingPlanSubjects(true)
    try {
      const data = await studyPlanService.getSubjectsByStudyPlan(planId)
      setPlanSubjects(data ?? [])
    } catch (err) {
      toast.error('No se pudieron cargar las asignaturas del plan')
      setPlanSubjects([])
    } finally {
      setLoadingPlanSubjects(false)
    }
  }, [])

  useEffect(() => {
    if (selectedPlanId) {
      loadPlanSubjects(selectedPlanId)
    } else {
      setPlanSubjects([])
    }
  }, [selectedPlanId, loadPlanSubjects])

  // ── Planes filtrados ──────────────────────────────────────────────────────
  const filteredPlans = useMemo(() => {
    let result = [...allPlans]

    if (filters.careerId) {
      result = result.filter((p) => String(p.career_id) === filters.careerId)
    }

    if (filters.yearVersion) {
      result = result.filter((p) => String(p.year) === filters.yearVersion)
    }

    if (filters.status !== 'all') {
      if (filters.status === 'publicado') {
        result = result.filter((p) => p.is_published)
      } else if (filters.status === 'borrador') {
        result = result.filter((p) => !p.is_published)
      }
      // 'archivado' se puede manejar con un campo adicional si el backend lo soporta
    }

    return sortStudyPlanVersions(result)
  }, [allPlans, filters])

  // ── Años disponibles para filtro ──────────────────────────────────────────
  const availableYears = useMemo(() => {
    const years = [...new Set(allPlans.map((p) => String(p.year)))].sort((a, b) => Number(b) - Number(a))
    return years
  }, [allPlans])

  // ── Asignaturas disponibles para agregar al plan ──────────────────────────
  const availableSubjectsForPlan = useMemo(
    () => filterAvailableSubjects(allSubjects, planSubjects),
    [allSubjects, planSubjects]
  )

  const filteredSubjectsForSearch = useMemo(
    () => searchSubjects(availableSubjectsForPlan, subjectSearchQuery),
    [availableSubjectsForPlan, subjectSearchQuery]
  )

  // ── Agrupación por semestre ───────────────────────────────────────────────
  const subjectsBySemester = useMemo(
    () => groupSubjectsBySemester(planSubjects),
    [planSubjects]
  )

  const totalCredits = useMemo(
    () => calcularTotalCreditos(planSubjects),
    [planSubjects]
  )

  // ── Plan seleccionado ─────────────────────────────────────────────────────
  const selectedPlan = useMemo(
    () => allPlans.find((p) => String(p.id) === selectedPlanId) ?? null,
    [allPlans, selectedPlanId]
  )

  const selectedPlanCareer = useMemo(
    () => careers.find((c) => String(c.id) === String(selectedPlan?.career_id)) ?? null,
    [careers, selectedPlan]
  )

  // ── Enriquecer planes con carrera ─────────────────────────────────────────
  const enrichedPlans = useMemo(
    () =>
      filteredPlans.map((plan) => ({
        ...plan,
        career: careers.find((c) => String(c.id) === String(plan.career_id)),
      })),
    [filteredPlans, careers]
  )

  // ── Acciones ──────────────────────────────────────────────────────────────
  const handleCreatePlan = async (payload: {
    career_id: string
    name: string
    year: number
  }) => {
    setLoadingAction(true)
    try {
      await studyPlanService.createStudyPlan({
        career_id: payload.career_id,
        name: payload.name,
        year: payload.year,
        subject_id: '',
        suggested_semester: 1,
      })
      toast.success('Plan de estudio creado correctamente')
      setIsCreateModalOpen(false)
      await loadInitialData()
    } catch (err: any) {
      toast.error(err?.message || 'No se pudo crear el plan')
    } finally {
      setLoadingAction(false)
    }
  }

  const handleAddSubjectToPlan = async (payload: {
    subject_id: number
    suggested_semester: number
    credits: number
  }) => {
    if (!selectedPlanId) return
    setLoadingAction(true)
    try {
      await studyPlanService.addSubjectToStudyPlan(
        Number(selectedPlanId),
        payload.subject_id,
        {
          subject_id: payload.subject_id,
          suggested_semester: payload.suggested_semester,
          credits: payload.credits,
        }
      )
      toast.success('Asignatura agregada al plan')
      setIsAddSubjectModalOpen(false)
      await loadPlanSubjects(selectedPlanId)
    } catch (err: any) {
      toast.error(err?.message || 'No se pudo agregar la asignatura')
    } finally {
      setLoadingAction(false)
    }
  }

  const handleRemoveSubjectFromPlan = async (subjectId: number) => {
    if (!selectedPlanId) return
    setLoadingAction(true)
    try {
      await studyPlanService.removeSubjectFromStudyPlan(
        Number(selectedPlanId),
        subjectId
      )
      toast.success('Asignatura removida del plan')
      await loadPlanSubjects(selectedPlanId)
    } catch (err: any) {
      toast.error(err?.message || 'No se pudo remover la asignatura')
    } finally {
      setLoadingAction(false)
    }
  }

  const handlePublishPlan = async (planId: string, year: number) => {
    const subjectsCount = planSubjects.length
    const validationError = validatePublishForm(year, subjectsCount)
    if (validationError) {
      toast.error(validationError)
      return
    }
    setLoadingAction(true)
    try {
      await studyPlanService.updateStudyPlan(planId, { is_published: true, year })
      toast.success('Plan publicado correctamente. Solo aplica a nuevas cohortes.')
      setIsPublishModalOpen(false)
      await loadInitialData()
    } catch (err: any) {
      toast.error(err?.message || 'No se pudo publicar el plan')
    } finally {
      setLoadingAction(false)
    }
  }

  const handleDuplicatePlan = async (plan: StudyPlan) => {
    setLoadingAction(true)
    try {
      const newPlan = await studyPlanService.createStudyPlan({
        career_id: String(plan.career_id),
        name: `${plan.name} (copia)`,
        year: new Date().getFullYear(),
        subject_id: '',
        suggested_semester: 1,
      })
      // Copiar asignaturas
      const subjects = await studyPlanService.getSubjectsByStudyPlan(plan.id)
      for (const subject of subjects) {
        try {
          await studyPlanService.addSubjectToStudyPlan(Number(newPlan.id), subject.subject_id, {
            subject_id: subject.subject_id,
            suggested_semester: subject.suggested_semester,
            credits: subject.credits,
          })
        } catch {
          // continúa con las demás
        }
      }
      toast.success('Versión duplicada correctamente')
      await loadInitialData()
    } catch (err: any) {
      toast.error(err?.message || 'No se pudo duplicar el plan')
    } finally {
      setLoadingAction(false)
    }
  }

  const handleFilterChange = (key: keyof AdminStudyPlanFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId)
  }

  const openPublishModal = (plan: StudyPlan) => {
    setPlanForAction(plan)
    setPublishYear(plan.year || new Date().getFullYear())
    setIsPublishModalOpen(true)
  }

  const openAddSubjectModal = (planId: string) => {
    setSelectedPlanId(planId)
    setSubjectSearchQuery('')
    setIsAddSubjectModalOpen(true)
  }

  return {
    // Data
    careers,
    allPlans,
    allSubjects,
    enrichedPlans,
    filteredPlans,
    availableYears,
    planSubjects,
    subjectsBySemester,
    totalCredits,
    availableSubjectsForPlan,
    filteredSubjectsForSearch,
    selectedPlan,
    selectedPlanId,
    selectedPlanCareer,
    planForAction,
    // Filters
    filters,
    handleFilterChange,
    // Loading
    loading,
    loadingAction,
    loadingPlanSubjects,
    error,
    // Selection
    handleSelectPlan,
    // Modals state
    isCreateModalOpen,
    setIsCreateModalOpen,
    isNewVersionModalOpen,
    setIsNewVersionModalOpen,
    isAddSubjectModalOpen,
    setIsAddSubjectModalOpen,
    isPublishModalOpen,
    setIsPublishModalOpen,
    isArchiveModalOpen,
    setIsArchiveModalOpen,
    openPublishModal,
    openAddSubjectModal,
    // Publish year
    publishYear,
    setPublishYear,
    // Subject search
    subjectSearchQuery,
    setSubjectSearchQuery,
    // Actions
    handleCreatePlan,
    handleAddSubjectToPlan,
    handleRemoveSubjectFromPlan,
    handlePublishPlan,
    handleDuplicatePlan,
    loadInitialData,
  }
}

export default useAdminStudyPlans