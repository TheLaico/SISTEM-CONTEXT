// src/hooks/useDetalleGrupo.ts
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'

import { RootState } from '../store/store'

import { Group }      from '../models/Group'
import { Subject }    from '../models/Subject'
import { Semester }   from '../models/Semester'
import { Career }     from '../models/Career'
import { StudyPlan }  from '../models/StudyPlan'
import { Enrollment } from '../models/Enrollment'
import { Evaluation } from '../models/Evaluation'
import { Grade }      from '../models/Grade'
import { Rubric }     from '../models/Rubric'

import { groupService }      from '../services/groupService'
import { subjectService }    from '../services/subjectService'
import { semesterService }   from '../services/semesterService'
import { studyPlanService }  from '../services/studyPlanService'
import { careerService }     from '../services/careerService'
import { enrollmentService } from '../services/enrollmentService'
import {
  getEvaluationsByGroup,
  getGradesByGroup,
  getRubricsByGroup,
  createEvaluation,
  updateEvaluation,
  deleteEvaluation,
  associateRubric,
  saveGrade,
  registerFinalScores,
} from '../services/evaluacionService'

import {
  groupBusiness,
  GroupDetailInfo,
  GroupAcademicInfo,
  EnrolledStudentRow,
  EvaluationRow,
  AcademicProcessStatus,
  GradePayload,
} from '../business/GroupBusiness'

import { EvaluationCreatePayload } from '../types/evaluacion'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Ocurrió un error inesperado'
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDetalleGrupo(groupId: number) {
  const navigate = useNavigate()
  const user     = useSelector((state: RootState) => state.user.user)

  // ── Datos crudos ────────────────────────────────────────────────────────────
  const [group,       setGroup]       = useState<Group | null>(null)
  const [subject,     setSubject]     = useState<Subject | null>(null)
  const [semester,    setSemester]    = useState<Semester | null>(null)
  const [career,      setCareer]      = useState<Career | null>(null)
  const [studyPlans,  setStudyPlans]  = useState<StudyPlan[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [grades,      setGrades]      = useState<Grade[]>([])
  const [rubrics,     setRubrics]     = useState<Rubric[]>([])

  // ── Estados de carga ────────────────────────────────────────────────────────
  const [isLoading,         setIsLoading]         = useState(false)
  const [isLoadingAcademic, setIsLoadingAcademic] = useState(false)
  const [isLoadingStudents, setIsLoadingStudents] = useState(false)
  const [isLoadingEvals,    setIsLoadingEvals]    = useState(false)

  // ── Errores ─────────────────────────────────────────────────────────────────
  const [error,         setError]         = useState<string | null>(null)
  const [academicError, setAcademicError] = useState<string | null>(null)

  // ── Fase 2: Info académica ──────────────────────────────────────────────────
  const loadAcademicInfo = useCallback(async (subjectId: number | string) => {
    setIsLoadingAcademic(true)
    setAcademicError(null)
    try {
      const plans    = await studyPlanService.getStudyPlansBySubject(subjectId)
      const filtered = groupBusiness.filterStudyPlansBySubject(plans, subjectId)
      setStudyPlans(filtered)

      if (filtered[0]?.career_id) {
        const car = await careerService.getCareerById(String(filtered[0].career_id))
        setCareer(car)
      }
    } catch (err) {
      const msg = extractMessage(err)
      setAcademicError(msg)
      // No bloquea el resto de la página — error silencioso en UI académica
    } finally {
      setIsLoadingAcademic(false)
    }
  }, [])

  // ── Fase 3: Datos del grupo ─────────────────────────────────────────────────
  const loadGroupData = useCallback(async (gid: number) => {
    setIsLoadingStudents(true)
    setIsLoadingEvals(true)
    try {
      const results = await Promise.allSettled([
        enrollmentService.searchEnrollments({ group_id: String(gid) }),
        getEvaluationsByGroup(String(gid) as any),
        getGradesByGroup(String(gid) as any),
        getRubricsByGroup(String(gid) as any),
      ])

      if (results[0].status === 'fulfilled') {
        setEnrollments(results[0].value)
      } else {
        toast.error(`Estudiantes: ${extractMessage(results[0].reason)}`)
      }

      if (results[1].status === 'fulfilled') {
        setEvaluations(results[1].value)
      } else {
        toast.error(`Evaluaciones: ${extractMessage(results[1].reason)}`)
      }

      if (results[2].status === 'fulfilled') {
        setGrades(results[2].value)
      } else {
        toast.error(`Calificaciones: ${extractMessage(results[2].reason)}`)
      }

      if (results[3].status === 'fulfilled') {
        setRubrics(results[3].value)
      } else {
        toast.error(`Rúbricas: ${extractMessage(results[3].reason)}`)
      }
    } finally {
      setIsLoadingStudents(false)
      setIsLoadingEvals(false)
    }
  }, [])

  // ── Fase 1: Carga principal del grupo ───────────────────────────────────────
  useEffect(() => {
    if (!groupId || !user?.id) return

    let cancelled = false

    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await groupService.getGroupById(String(groupId))

        if (!data) throw new Error('Grupo no encontrado')

        const accessError = groupBusiness.validateTeacherAccess(data, user.id!)
        if (accessError) {
          setError(accessError)
          toast.error(accessError)
          setTimeout(() => navigate('/teacher/grupos'), 2000)
          return
        }

        if (cancelled) return

        setGroup(data)

        // Resolver subject y semester desde relaciones anidadas o cargar por separado
        let resolvedSubject: Subject | null  = data.subject  ?? null
        let resolvedSemester: Semester | null = data.semester ?? null

        if (!resolvedSubject || !resolvedSemester) {
          const [sub, sem] = await Promise.allSettled([
            resolvedSubject  ? Promise.resolve(resolvedSubject)  : subjectService.getSubjectById(String(data.subject_id)),
            resolvedSemester ? Promise.resolve(resolvedSemester) : semesterService.getSemesterById(String(data.semester_id)),
          ])
          if (sub.status  === 'fulfilled') resolvedSubject  = sub.value
          if (sem.status  === 'fulfilled') resolvedSemester = sem.value
        }

        if (cancelled) return

        if (resolvedSubject)  setSubject(resolvedSubject)
        if (resolvedSemester) setSemester(resolvedSemester)

        // Disparar fases 2 y 3 en paralelo
        const subId = resolvedSubject?.id ?? data.subject_id
        void loadAcademicInfo(subId)
        void loadGroupData(groupId)

      } catch (err) {
        if (!cancelled) {
          const msg = extractMessage(err)
          setError(msg)
          toast.error(msg)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [groupId, user?.id, loadAcademicInfo, loadGroupData, navigate])

  // ── Datos derivados ─────────────────────────────────────────────────────────

  const groupDetail = useMemo<GroupDetailInfo | null>(
    () => group ? groupBusiness.buildGroupDetailInfo(group) : null,
    [group]
  )

  const academicInfo = useMemo<GroupAcademicInfo | null>(
    () =>
      subject && studyPlans.length > 0
        ? groupBusiness.buildAcademicInfo(subject, studyPlans, career)
        : null,
    [subject, studyPlans, career]
  )

  const enrolledStudents = useMemo<EnrolledStudentRow[]>(
    () => groupBusiness.mapEnrollmentsToRows(enrollments, grades),
    [enrollments, grades]
  )

  const evaluationRows = useMemo<EvaluationRow[]>(
    () => groupBusiness.mapEvaluationsToRows(evaluations, semester?.is_active ?? false),
    [evaluations, semester]
  )

  const academicStatus = useMemo<AcademicProcessStatus | null>(
    () =>
      group
        ? groupBusiness.buildAcademicProcessStatus(evaluations, enrollments, grades, rubrics)
        : null,
    [evaluations, enrollments, grades, rubrics, group]
  )

  // ── Helpers de recarga ──────────────────────────────────────────────────────

  const reloadEvaluations = useCallback(async () => {
    const updated = await getEvaluationsByGroup(groupId)
    setEvaluations(updated)
  }, [groupId])

  const reloadGrades = useCallback(async () => {
    const updated = await getGradesByGroup(groupId)
    setGrades(updated)
  }, [groupId])

  // ── Handlers — Evaluaciones ─────────────────────────────────────────────────

  const handleCreateEvaluation = useCallback(async (payload: EvaluationCreatePayload) => {
    const validationError = groupBusiness.validateEvaluation(payload)
    if (validationError) { toast.error(validationError); return }

    const weightError = groupBusiness.validateTotalWeight(evaluations, payload.weight)
    if (weightError) { toast.error(weightError); return }

    if (groupBusiness.isDuplicateEvaluation(evaluations, payload.name)) {
      toast.error('Ya existe una evaluación con ese nombre.')
      return
    }

    try {
      await createEvaluation(payload)
      await reloadEvaluations()
      toast.success('Evaluación creada.')
    } catch (err) {
      toast.error(extractMessage(err))
    }
  }, [evaluations, reloadEvaluations])

  const handleUpdateEvaluation = useCallback(async (
    id: number | string,
    payload: Partial<EvaluationCreatePayload>
  ) => {
    if (payload.name !== undefined || payload.weight !== undefined) {
      const partial = {
        name:   payload.name   ?? '',
        weight: payload.weight ?? 0,
      }
      const validationError = groupBusiness.validateEvaluation(partial)
      if (validationError) { toast.error(validationError); return }
    }

    if (payload.weight !== undefined) {
      const weightError = groupBusiness.validateTotalWeight(evaluations, payload.weight, id)
      if (weightError) { toast.error(weightError); return }
    }

    try {
      await updateEvaluation(id, payload)
      await reloadEvaluations()
      toast.success('Evaluación actualizada.')
    } catch (err) {
      toast.error(extractMessage(err))
    }
  }, [evaluations, reloadEvaluations])

  const handleDeleteEvaluation = useCallback(async (id: number | string) => {
    try {
      await deleteEvaluation(id)
      await reloadEvaluations()
      toast.success('Evaluación eliminada.')
    } catch (err) {
      toast.error(extractMessage(err))
    }
  }, [reloadEvaluations])

  const handleAssociateRubric = useCallback(async (
    evaluationId: number | string,
    rubricId: number | string
  ) => {
    const rubric = rubrics.find((r) => String(r.id) === String(rubricId))
    if (!rubric) { toast.error('Rúbrica no encontrada.'); return }

    const canAssociate = groupBusiness.canAssociateRubricToEvaluation(
      rubric,
      semester?.is_active ?? false
    )
    if (canAssociate) { toast.error(canAssociate); return }

    try {
      await associateRubric(String(evaluationId), String(rubricId))
      await reloadEvaluations()
      toast.success('Rúbrica asociada.')
    } catch (err) {
      toast.error(extractMessage(err))
    }
  }, [rubrics, semester, reloadEvaluations])

  // ── Handler — Calificaciones ────────────────────────────────────────────────

  const handleSaveGrade = useCallback(async (payload: GradePayload) => {
    if (payload.status === 'SENT') {
      const rubric   = rubrics.find((r) => String(r.id) === String(payload.rubric_id))
      const criteria = rubric?.criteria ?? []
      const selected = payload.details.map((d) => ({
        criterionId: d.scale_id, // aproximación: scale → criterion via rubric
        scaleId:     d.scale_id,
      }))
      const sendError = groupBusiness.validateGradeBeforeSend(criteria, selected)
      if (sendError) { toast.error(sendError); return }
    }

    try {
      await saveGrade(payload as any)
      await reloadGrades()
      toast.success(payload.status === 'SENT' ? 'Nota enviada.' : 'Borrador guardado.')
    } catch (err) {
      toast.error(extractMessage(err))
    }
  }, [rubrics, reloadGrades])

  // ── Handler — Notas finales ─────────────────────────────────────────────────

  const handleRegisterFinalScores = useCallback(async () => {
    const canRegister = groupBusiness.canRegisterFinalScores(grades, enrollments)
    if (canRegister) { toast.error(canRegister); return }

    try {
      await registerFinalScores(groupId)
      await reloadGrades()
      toast.success('Notas finales registradas.')
    } catch (err) {
      toast.error(extractMessage(err))
    }
  }, [grades, enrollments, groupId, reloadGrades])

  // ── Recarga manual ──────────────────────────────────────────────────────────

  const handleRefresh = useCallback(() => {
    void loadGroupData(groupId)
  }, [groupId, loadGroupData])

  // ── Retorno ─────────────────────────────────────────────────────────────────

  return {
    // Datos crudos
    group,
    enrollments,
    evaluations,
    grades,
    rubrics,

    // Datos derivados para la UI
    groupDetail,
    academicInfo,
    enrolledStudents,
    evaluationRows,
    academicStatus,

    // Estados de carga
    isLoading,
    isLoadingAcademic,
    isLoadingStudents,
    isLoadingEvals,

    // Errores
    error,
    academicError,

    // Handlers
    handleCreateEvaluation,
    handleUpdateEvaluation,
    handleDeleteEvaluation,
    handleAssociateRubric,
    handleSaveGrade,
    handleRegisterFinalScores,
    handleRefresh,
  }
}