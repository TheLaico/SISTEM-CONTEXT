import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'

import { studyPlanBusiness, calcularTotalCreditos, filterAvailableSubjects, getActivePlan, groupSubjectsBySemester, searchSubjects, validateAddSubjectForm, validatePublishForm } from '../business/StudyPlanBusiness'
import { Career } from '../models/Career'
import { StudyPlan } from '../models/StudyPlan'
import { Subject } from '../models/Subject'
import { StudyPlanSubject } from '../types/studyPlan'
import { studyPlanService } from '../services/studyPlanService'

const toNumberId = (value: string | number | undefined | null): number | null => {
  if (value === undefined || value === null) {
    return null
  }

  const parsedValue = Number(value)
  return Number.isNaN(parsedValue) ? null : parsedValue
}

const buildStudyPlanSubjectFromCatalog = (
  subject: Subject,
  suggestedSemester: number | null = null
): StudyPlanSubject => ({
  subject_id: toNumberId(subject.id) ?? 0,
  subject_name: subject.name,
  subject_code: subject.code,
  credits: subject.credits,
  suggested_semester: suggestedSemester ?? 1
})

const useStudyPlan = () => {
  const [careers, setCareers] = useState<Career[]>([])
  const [selectedCareerId, setSelectedCareerId] = useState<number | null>(null)
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([])
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null)
  const [planSubjects, setPlanSubjects] = useState<StudyPlanSubject[]>([])
  const [allSubjects, setAllSubjects] = useState<Subject[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingAction, setLoadingAction] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false)
  const [isRestrictedDeleteModalOpen, setIsRestrictedDeleteModalOpen] = useState(false)
  const [selectedSubjectForAction, setSelectedSubjectForAction] = useState<StudyPlanSubject | null>(null)

  const [formSubjectId, setFormSubjectId] = useState<number | null>(null)
  const [formSemester, setFormSemester] = useState<number | null>(null)
  const [formCredits, setFormCredits] = useState<number | null>(null)
  const [publishYear, setPublishYear] = useState<number | null>(null)

  const activePlan = useMemo(() => getActivePlan(studyPlans), [studyPlans])

  const availableSubjects = useMemo(
    () => filterAvailableSubjects(allSubjects, planSubjects),
    [allSubjects, planSubjects]
  )

  const filteredSubjects = useMemo(
    () => searchSubjects(availableSubjects, searchQuery),
    [availableSubjects, searchQuery]
  )

  const subjectsBySemester = useMemo(
    () => groupSubjectsBySemester(planSubjects),
    [planSubjects]
  )

  const totalCredits = useMemo(
    () => calcularTotalCreditos(planSubjects),
    [planSubjects]
  )

  const loadInitialData = async () => {
    setLoading(true)
    setError(null)

    try {
      const [careersData, subjectsData] = await Promise.all([
        studyPlanService.getCareers(),
        studyPlanService.getAllSubjects()
      ])

      setCareers(careersData)
      setAllSubjects(subjectsData)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error inesperado'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const loadCareerPlans = async (careerId: number, preferredPlanId?: number | null) => {
    setLoading(true)
    setError(null)

    try {
      const plans = await studyPlanService.getStudyPlansByCareer(careerId)
      setStudyPlans(plans)

      const latestActivePlan = getActivePlan(plans)
      const fallbackPlanId = toNumberId(latestActivePlan?.id) ?? toNumberId(plans[0]?.id)
      const preferredExists = preferredPlanId !== null && preferredPlanId !== undefined
        ? plans.some((plan) => toNumberId(plan.id) === preferredPlanId)
        : false

      const nextSelectedPlanId = preferredExists
        ? preferredPlanId ?? null
        : fallbackPlanId

      setSelectedPlanId(nextSelectedPlanId)

      if (nextSelectedPlanId !== null) {
        const subjects = await studyPlanService.getSubjectsByStudyPlan(nextSelectedPlanId)
        setPlanSubjects(subjects)
      } else {
        setPlanSubjects([])
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error inesperado'
      setStudyPlans([])
      setPlanSubjects([])
      setSelectedPlanId(null)
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const refreshCurrentPlanData = async () => {
    if (selectedCareerId === null) {
      return
    }

    await loadCareerPlans(selectedCareerId, selectedPlanId)
  }

  const handleSelectCareer = (careerId: number): void => {
    setSelectedCareerId(careerId)
    setSelectedPlanId(null)
    setPlanSubjects([])
    setSearchQuery('')
    void loadCareerPlans(careerId)
  }

  const handleSelectPlan = (planId: number): void => {
    setSelectedPlanId(planId)
    setPlanSubjects([])
    void (async () => {
      setLoading(true)
      setError(null)

      try {
        const subjects = await studyPlanService.getSubjectsByStudyPlan(planId)
        setPlanSubjects(subjects)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error inesperado'
        setError(message)
        toast.error(message)
      } finally {
        setLoading(false)
      }
    })()
  }

  const handleSearchChange = (query: string): void => {
    setSearchQuery(query)
  }

  const handleOpenAddModal = (subject: Subject): void => {
    setSelectedSubjectForAction(buildStudyPlanSubjectFromCatalog(subject))
    setFormSubjectId(toNumberId(subject.id))
    setFormSemester(null)
    setFormCredits(subject.credits)
    setIsAddModalOpen(true)
  }

  const handleOpenEditModal = (subject: StudyPlanSubject): void => {
    setSelectedSubjectForAction(subject)
    setFormSubjectId(subject.subject_id)
    setFormSemester(subject.suggested_semester)
    setFormCredits(subject.credits)
    setIsEditModalOpen(true)
  }

  const handleOpenDeleteModal = (subject: StudyPlanSubject): void => {
    setSelectedSubjectForAction(subject)
    setIsDeleteModalOpen(true)
  }

  const handleOpenPublishModal = (): void => {
    setPublishYear(new Date().getFullYear())
    setIsPublishModalOpen(true)
  }

  const handleCloseAllModals = (): void => {
    setIsAddModalOpen(false)
    setIsEditModalOpen(false)
    setIsDeleteModalOpen(false)
    setIsPublishModalOpen(false)
    setIsRestrictedDeleteModalOpen(false)
    setSelectedSubjectForAction(null)
    setFormSubjectId(null)
    setFormSemester(null)
    setFormCredits(null)
    setPublishYear(null)
  }

  const handleAddSubject = async (): Promise<void> => {
    const validationError = validateAddSubjectForm(formSubjectId, formSemester, formCredits)

    if (validationError) {
      setError(validationError)
      toast.error(validationError)
      return
    }

    if (selectedCareerId === null || selectedPlanId === null) {
      const message = 'Selecciona una carrera y un plan antes de agregar una asignatura'
      setError(message)
      toast.error(message)
      return
    }

    setLoadingAction(true)
    setError(null)

    try {
      await studyPlanService.addSubjectToStudyPlan(
        selectedPlanId,
        formSubjectId as number,
        {
          subject_id: formSubjectId as number,
          suggested_semester: formSemester as number,
          credits: formCredits as number
        }
      )

      await refreshCurrentPlanData()
      handleCloseAllModals()
      toast.success('Asignatura agregada correctamente.')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error inesperado'
      setError(message)
      toast.error(message)
    } finally {
      setLoadingAction(false)
    }
  }

  const handleEditSubject = async (): Promise<void> => {
    const validationError = validateAddSubjectForm(formSubjectId, formSemester, formCredits)

    if (validationError) {
      setError(validationError)
      toast.error(validationError)
      return
    }

    if (selectedCareerId === null || selectedPlanId === null || selectedSubjectForAction === null) {
      const message = 'No se pudo determinar la asignatura a editar'
      setError(message)
      toast.error(message)
      return
    }

    setLoadingAction(true)
    setError(null)

    try {
      await studyPlanService.addSubjectToStudyPlan(
        selectedPlanId,
        selectedSubjectForAction.subject_id,
        {
          subject_id: formSubjectId as number,
          suggested_semester: formSemester as number,
          credits: formCredits as number
        }
      )

      await refreshCurrentPlanData()
      handleCloseAllModals()
      toast.success('Asignatura actualizada correctamente.')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error inesperado'
      setError(message)
      toast.error(message)
    } finally {
      setLoadingAction(false)
    }
  }

  const handleDeleteSubject = async (): Promise<void> => {
    if (selectedCareerId === null || selectedPlanId === null || selectedSubjectForAction === null) {
      const message = 'No se pudo determinar la asignatura a eliminar'
      setError(message)
      toast.error(message)
      return
    }

    setLoadingAction(true)
    setError(null)

    try {
      await studyPlanService.removeSubjectFromStudyPlan(selectedPlanId, selectedSubjectForAction.subject_id)

      await refreshCurrentPlanData()
      handleCloseAllModals()
      toast.success('Asignatura eliminada correctamente.')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error inesperado'
      const status = (err as { response?: { status?: number } })?.response?.status

      if (status === 400) {
        setIsDeleteModalOpen(false)
        setIsRestrictedDeleteModalOpen(true)
        setError(message)
        toast.error(message)
        return
      }

      setError(message)
      toast.error(message)
    } finally {
      setLoadingAction(false)
    }
  }

  const handlePublishPlan = async (): Promise<void> => {
    const validationError = validatePublishForm(publishYear, planSubjects.length)

    if (validationError) {
      setError(validationError)
      toast.error(validationError)
      return
    }

    if (selectedCareerId === null) {
      const message = 'Selecciona una carrera antes de publicar'
      setError(message)
      toast.error(message)
      return
    }

    setLoadingAction(true)
    setError(null)

    try {
      const version = await studyPlanBusiness.createVersion({
        career_id: String(selectedCareerId),
        year: publishYear as number,
        name: `Versión ${publishYear}`
      })

      await studyPlanBusiness.publishVersion(version.id, {
        career_id: String(selectedCareerId),
        replace_previous: true
      })

      await loadCareerPlans(selectedCareerId, selectedPlanId)
      handleCloseAllModals()
      toast.success('Plan publicado correctamente.')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error inesperado'
      setError(message)
      toast.error(message)
    } finally {
      setLoadingAction(false)
    }
  }

  useEffect(() => {
    void loadInitialData()
  }, [])

  return {
    careers,
    selectedCareerId,
    studyPlans,
    activePlan,
    selectedPlanId,
    planSubjects,
    allSubjects,
    availableSubjects,
    searchQuery,
    filteredSubjects,
    subjectsBySemester,
    totalCredits,
    loading,
    loadingAction,
    error,
    isAddModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    isPublishModalOpen,
    isRestrictedDeleteModalOpen,
    selectedSubjectForAction,
    formSubjectId,
    formSemester,
    formCredits,
    publishYear,
    handleSelectCareer,
    handleSelectPlan,
    handleSearchChange,
    handleOpenAddModal,
    handleOpenEditModal,
    handleOpenDeleteModal,
    handleOpenPublishModal,
    handleCloseAllModals,
    handleAddSubject,
    handleEditSubject,
    handleDeleteSubject,
    handlePublishPlan,
    setFormSubjectId,
    setFormSemester,
    setFormCredits,
    setPublishYear
  }
}

export default useStudyPlan
