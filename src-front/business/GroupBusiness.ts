// src/business/GroupBusiness.ts
// Lógica de negocio pura del módulo Grupos (Vista Docente) — Tareas 10 a 20.
// Sin efectos secundarios. Sin imports de React, hooks ni servicios.

import { Group, CreateGroupDto, UpdateGroupDto, GroupFilters as GroupServiceFilters } from '../models/Group'
import { Subject }    from '../models/Subject'
import { StudyPlan }  from '../models/StudyPlan'
import { Career }     from '../models/Career'
import { Enrollment } from '../models/Enrollment'
import { Evaluation } from '../models/Evaluation'
import { Grade }      from '../models/Grade'
import { Rubric }     from '../models/Rubric'
import { Criterion }  from '../models/Criterion'

import { groupService } from '../services/groupService'

// ─── Tipos internos del módulo ────────────────────────────────────────────────

export interface GroupFilters {
  searchSubject: string
  searchCode: string
  semesterName: string
  groupStatus: string
}

export const EMPTY_GROUP_UI_FILTERS: GroupFilters = {
  searchSubject: '',
  searchCode: '',
  semesterName: '',
  groupStatus: '',
}

export interface GroupCardData {
  id: number | string
  name: string
  groupCode: string
  subjectName: string
  semesterName: string
  studentCount: number
  groupStatus: 'Activo' | 'Sin estudiantes' | 'Cerrado'
  semesterStatus: 'Activo' | 'Cerrado'
  isEditable: boolean
  hasEvaluations: boolean
  hasLockedGrades: boolean
  evaluationCount: number
  publishedRubricCount: number
  gradeStatusLabel: string
  gradeStatusColor: 'green' | 'yellow' | 'red' | 'gray'
}

export interface GroupDetailInfo {
  name: string
  groupCode: string
  subjectName: string
  semesterName: string
  semesterIsActive: boolean
  studentCount: number
  capacity: number | null
  occupancyLabel: string
  statusLabel: string
  statusColor: 'green' | 'yellow' | 'red'
  isEditable: boolean
}

export interface GroupAcademicInfo {
  subjectName: string
  subjectCode: string
  credits: number
  creditsLabel: string
  careerName: string
  studyPlanName: string
  studyPlanYear: number | null
  suggestedSemester: number | null
  suggestedSemesterLabel: string
}

export interface EnrolledStudentRow {
  enrollmentId: number | string
  studentId: number | string
  fullName: string
  identification: string
  code: string
  enrollmentStatus: string
  hasGrade: boolean
  gradeStatus: string
  gradeStatusColor: 'green' | 'yellow' | 'red' | 'gray'
}

export interface EvaluationRow {
  id: number | string
  name: string
  description: string
  weight: number
  weightLabel: string
  hasRubric: boolean
  rubricTitle: string
  rubricIsPublic: boolean
  canAssociateRubric: boolean
  canEdit: boolean
  canDelete: boolean
}

export interface AcademicProcessStatus {
  pendingEvaluations: number
  studentsWithoutGrade: number
  unpublishedRubrics: number
  finalGradesRegistered: boolean
  completionPercentage: number
  statusLabel: string
  statusColor: 'green' | 'yellow' | 'red'
}

export interface GradePayload {
  enrollment_id: number | string
  rubric_id: number | string
  details: { scale_id: number | string; comment?: string }[]
  status: 'DRAFT' | 'SENT'
  observations?: string
}

// ─── Clase principal ──────────────────────────────────────────────────────────

class GroupBusiness {

  // ── Privado compartido ──────────────────────────────────────────────────────

  private calcGroupStatus(
    semesterIsActive: boolean,
    studentCount: number
  ): { label: 'Activo' | 'Sin estudiantes' | 'Cerrado'; color: 'green' | 'yellow' | 'red' } {
    if (!semesterIsActive) return { label: 'Cerrado',          color: 'red'    }
    if (studentCount === 0) return { label: 'Sin estudiantes', color: 'yellow' }
    return                         { label: 'Activo',          color: 'green'  }
  }

  // ── Métodos heredados (Tarea anterior) ─────────────────────────────────────

  async getGroups(filters?: GroupServiceFilters): Promise<Group[]> {
    const groups = await groupService.getGroups()
    if (!filters) return groups

    return groups.filter((group) => {
      const matchesSearch =
        !filters.search ||
        group.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        group.group_code.toLowerCase().includes(filters.search.toLowerCase())

      const matchesTeacher  = !filters.teacher_id  || String(group.teacher_id)  === String(filters.teacher_id)
      const matchesSemester = !filters.semester_id || String(group.semester_id) === String(filters.semester_id)
      const matchesSubject  = !filters.subject_id  || String(group.subject_id)  === String(filters.subject_id)

      return matchesSearch && matchesTeacher && matchesSemester && matchesSubject
    })
  }

  async getGroupById(id: string | number): Promise<Group | null> {
    return await groupService.getGroupById(String(id))
  }

  async createGroup(data: CreateGroupDto): Promise<Group | null> {
    if (!data.name.trim())       throw new Error('Group name is required')
    if (!data.group_code.trim()) throw new Error('Group code is required')
    if (!data.teacher_id)        throw new Error('Teacher is required')
    if (!data.subject_id)        throw new Error('Subject is required')
    if (!data.semester_id)       throw new Error('Semester is required')
    if (data.capacity <= 0)      throw new Error('Capacity must be greater than 0')
    return await groupService.createGroup(data)
  }

  async updateGroup(id: string, data: UpdateGroupDto): Promise<Group | null> {
    if (data.capacity !== undefined && data.capacity <= 0)
      throw new Error('Capacity must be greater than 0')
    return await groupService.updateGroup(id, data)
  }

  async deleteGroup(id: string): Promise<void> {
    if (!id) throw new Error('Group id is required')
    return await groupService.deleteGroup(id)
  }

  // ── Tarea 10: Validación de acceso ─────────────────────────────────────────

  validateGroupId(raw: string | null): number | null {
    if (raw === null || raw === '') return null
    const parsed = parseInt(raw, 10)
    if (isNaN(parsed) || parsed <= 0 || String(parsed) !== raw.trim()) return null
    return parsed
  }

  validateTeacherAccess(group: Group, teacherUserId: number | string): string | null {
    // NOTA: teacher_id en Group referencia User.id del docente, no Teacher.id.
    if (String(group.teacher_id) !== String(teacherUserId))
      return 'No tienes permiso para ver este grupo.'
    return null
  }

  isGroupOwnedByTeacher(group: Group, teacherUserId: number | string): boolean {
    return this.validateTeacherAccess(group, teacherUserId) === null
  }

  // ── Tareas 5-9: MisGrupos (GroupCardData) ──────────────────────────────────

  mapGroupsToCards(groups: Group[]): GroupCardData[] {
    return groups.map((group) => {
      const semesterIsActive = group.semester?.is_active ?? false
      const studentCount     = group.enrollments?.length ?? 0
      const status           = this.calcGroupStatus(semesterIsActive, studentCount)

      return {
        id:                  group.id,
        name:                group.name,
        groupCode:           group.group_code,
        subjectName:         group.subject?.name ?? '—',
        semesterName:        group.semester?.name ?? '—',
        studentCount,
        groupStatus:         status.label,
        semesterStatus:      semesterIsActive ? 'Activo' : 'Cerrado',
        isEditable:          semesterIsActive,
        hasEvaluations:      false,
        hasLockedGrades:     false,
        evaluationCount:     0,
        publishedRubricCount: 0,
        gradeStatusLabel:    '',
        gradeStatusColor:    'gray',
      }
    })
  }

  enrichGroupCard(
    card: GroupCardData,
    evaluations: Evaluation[],
    grades: Grade[],
    rubrics: Rubric[]
  ): GroupCardData {
    const gradeStatus = this.calcularGradeStatus(card.studentCount, grades)
    return {
      ...card,
      hasEvaluations:       evaluations.length > 0,
      hasLockedGrades:      grades.some((g) => g.is_locked),
      evaluationCount:      evaluations.length,
      publishedRubricCount: rubrics.filter((r) => r.is_public).length,
      gradeStatusLabel:     gradeStatus.label,
      gradeStatusColor:     gradeStatus.color,
    }
  }

  calcularGradeStatus(
    studentCount: number,
    grades: Grade[]
  ): { label: string; color: 'green' | 'yellow' | 'red' | 'gray' } {
    if (studentCount === 0)                         return { label: 'Sin estudiantes',    color: 'gray'   }
    if (grades.length === 0)                        return { label: 'Sin calificar',      color: 'red'    }
    if (grades.some((g) => g.is_locked))            return { label: 'Notas consolidadas', color: 'green'  }
    if (grades.every((g) => g.status === 'SENT'))   return { label: 'Calificado',         color: 'green'  }
    if (grades.some((g) => g.status === 'SENT' || g.status === 'DRAFT'))
                                                    return { label: 'En progreso',        color: 'yellow' }
    return                                                 { label: 'Pendiente',          color: 'red'    }
  }

  getGroupStatusSummary(card: GroupCardData): string {
    const parts = [
      `Grupo ${card.groupStatus.toLowerCase()}`,
      `${card.evaluationCount} evaluación${card.evaluationCount !== 1 ? 'es' : ''}`,
      card.gradeStatusLabel || 'Sin calificar',
    ]
    return parts.join(' · ')
  }

  filterGroups(cards: GroupCardData[], filters: GroupFilters): GroupCardData[] {
    const { searchSubject, searchCode, semesterName, groupStatus } = filters
    if (!searchSubject && !searchCode && !semesterName && !groupStatus) return cards

    return cards.filter((card) => {
      const matchSubject  = !searchSubject  || card.subjectName.toLowerCase().includes(searchSubject.toLowerCase())
      const matchCode     = !searchCode     || card.groupCode.toLowerCase().includes(searchCode.toLowerCase())
      const matchSemester = !semesterName   || card.semesterName === semesterName
      const matchStatus   = !groupStatus    || card.groupStatus  === groupStatus
      return matchSubject && matchCode && matchSemester && matchStatus
    })
  }

  getUniqueSemesters(cards: GroupCardData[]): string[] {
    return [...new Set(cards.map((c) => c.semesterName))].sort()
  }

  // ── Tarea 11: Info general del grupo ───────────────────────────────────────

  buildGroupDetailInfo(group: Group): GroupDetailInfo {
    const semesterIsActive = group.semester?.is_active ?? false
    const studentCount     = group.enrollments?.length ?? 0
    const capacity         = group.capacity ?? null
    const status           = this.calcGroupStatus(semesterIsActive, studentCount)

    const occupancyLabel = capacity != null
      ? `${studentCount} / ${capacity} estudiantes`
      : `${studentCount} estudiante${studentCount !== 1 ? 's' : ''}`

    return {
      name:             group.name,
      groupCode:        group.group_code,
      subjectName:      group.subject?.name   ?? '—',
      semesterName:     group.semester?.name  ?? '—',
      semesterIsActive,
      studentCount,
      capacity,
      occupancyLabel,
      statusLabel:      status.label,
      statusColor:      status.color,
      isEditable:       semesterIsActive,
    }
  }

  // ── Tarea 12: Info académica ───────────────────────────────────────────────

  buildAcademicInfo(
    subject: Subject,
    studyPlans: StudyPlan[],
    career: Career | null
  ): GroupAcademicInfo {
    const plan    = studyPlans[0] ?? null
    const credits = subject.credits ?? 0

    return {
      subjectName:            subject.name,
      subjectCode:            subject.code,
      credits,
      creditsLabel:           `${credits} crédito${credits !== 1 ? 's' : ''}`,
      careerName:             career?.name    ?? 'Carrera no encontrada',
      studyPlanName:          plan?.name      ?? 'Plan no asociado',
      studyPlanYear:          plan?.year      ?? null,
      suggestedSemester:      plan?.suggested_semester ?? null,
      suggestedSemesterLabel: plan?.suggested_semester
        ? `Semestre ${plan.suggested_semester}`
        : 'No especificado',
    }
  }

  filterStudyPlansBySubject(plans: StudyPlan[], subjectId: number | string): StudyPlan[] {
    return plans.filter((p) =>
      // Filtra por array subjects[] si existe; fallback a subject_id directo
      p.subjects
        ? p.subjects.some((s) => String(s.id) === String(subjectId))
        : String(p.subject_id) === String(subjectId)
    )
  }

  // ── Tarea 13: Estudiantes inscritos ────────────────────────────────────────

  mapEnrollmentsToRows(
    enrollments: Enrollment[],
    grades: Grade[]
  ): EnrolledStudentRow[] {
    return enrollments.map((enrollment) => {
      const enrollmentGrades = grades.filter(
        (g) => String(g.enrollment_id) === String(enrollment.id)
      )
      const hasGrade    = enrollmentGrades.length > 0
      const gradeStatus = this.calcularGradeStatus(1, enrollmentGrades)

      return {
        enrollmentId:      enrollment.id ?? '',
        studentId:         enrollment.student_id ?? enrollment.student?.id ?? '',
        fullName:          [
                             enrollment.student?.first_name,
                             enrollment.student?.last_name,
                           ].filter(Boolean).join(' ') || '—',
        identification:    enrollment.student?.identification ?? '—',
        code:              (enrollment.student as any)?.code  ?? '—',
        enrollmentStatus:  enrollment.status,
        hasGrade,
        gradeStatus:       hasGrade ? gradeStatus.label : 'Sin calificar',
        gradeStatusColor:  hasGrade ? gradeStatus.color : 'gray',
      }
    })
  }

  // ── Tarea 14: Evaluaciones del grupo ───────────────────────────────────────

  mapEvaluationsToRows(
    evaluations: Evaluation[],
    semesterIsActive: boolean
  ): EvaluationRow[] {
    return evaluations.map((ev) => {
      const hasRubric = ev.rubric_id != null
      return {
        id:                 ev.id ?? '',
        name:               ev.name        ?? '',
        description:        ev.description ?? '',
        weight:             ev.weight       ?? 0,
        weightLabel:        `${ev.weight ?? 0}%`,
        hasRubric,
        rubricTitle:        ev.rubric?.title    ?? 'Sin rúbrica',
        rubricIsPublic:     ev.rubric?.is_public ?? false,
        canAssociateRubric: semesterIsActive && !hasRubric,
        canEdit:            semesterIsActive,
        canDelete:          semesterIsActive && !hasRubric,
      }
    })
  }

  validateEvaluation(payload: { name: string; weight: number; description?: string }): string | null {
    if (!payload.name.trim())                          return 'El nombre es requerido.'
    if (payload.weight <= 0 || payload.weight > 100)   return 'El peso debe estar entre 1 y 100.'
    return null
  }

  validateTotalWeight(
    evaluations: Evaluation[],
    newWeight: number,
    excludeId?: number | string
  ): string | null {
    const currentTotal = evaluations
      .filter((e) => String(e.id) !== String(excludeId))
      .reduce((sum, e) => sum + (e.weight ?? 0), 0)

    if (currentTotal + newWeight > 100)
      return 'El peso total de las evaluaciones supera el 100%.'
    return null
  }

  // ── Tareas 15-16: Rúbricas y criterios ────────────────────────────────────

  filterPublicRubrics(rubrics: Rubric[]): Rubric[] {
    return rubrics.filter((r) => r.is_public === true && r.is_archived === false)
  }

  filterRubricsByTeacher(rubrics: Rubric[], teacherRubricIds: (number | string)[]): Rubric[] {
    // Nota: el backend no filtra rúbricas por docente directamente.
    // Este método filtra localmente por IDs conocidos del docente.
    const ids = teacherRubricIds.map(String)
    return rubrics.filter((r) => r.id !== undefined && ids.includes(String(r.id)))
  }

  validateCriterionWeight(
    criteria: Criterion[],
    newWeight: number,
    excludeId?: number | string
  ): string | null {
    const currentTotal = criteria
      .filter((c) => String(c.id) !== String(excludeId))
      .reduce((sum, c) => sum + (c.weight ?? 0), 0)

    if (currentTotal + newWeight > 100)
      return 'La suma de pesos de los criterios supera el 100%.'
    return null
  }

  canPublishRubric(rubric: Rubric, criteria: Criterion[]): string | null {
    if (criteria.length === 0)
      return 'La rúbrica debe tener al menos un criterio.'

    const totalWeight = criteria.reduce((sum, c) => sum + (c.weight ?? 0), 0)
    if (totalWeight !== 100)
      return 'Los pesos deben sumar exactamente 100.'

    for (const criterion of criteria) {
      const scaleCount = criterion.scales?.length ?? 0
      if (scaleCount < 2 || scaleCount > 5)
        return 'Cada criterio debe tener entre 2 y 5 escalas.'
    }

    return null
  }

  // ── Tareas 17-18: Calificaciones y notas ──────────────────────────────────

  buildGradePayload(
    enrollmentId: number | string,
    rubricId: number | string,
    selectedScales: { criterionId: number | string; scaleId: number | string; comment?: string }[],
    status: 'DRAFT' | 'SENT',
    observations?: string
  ): GradePayload {
    return {
      enrollment_id: enrollmentId,
      rubric_id:     rubricId,
      details:       selectedScales.map((s) => ({
        scale_id: s.scaleId,
        comment:  s.comment,
      })),
      status,
      observations,
    }
  }

  validateGradeBeforeSend(
    criteria: Criterion[],
    selectedScales: { criterionId: number | string; scaleId: number | string }[]
  ): string | null {
    const selectedIds = selectedScales.map((s) => String(s.criterionId))
    const allCovered  = criteria.every((c) => selectedIds.includes(String(c.id)))
    if (!allCovered)
      return 'Debes calificar todos los criterios antes de enviar.'
    return null
  }

  canEditGrade(grade: Grade): string | null {
    if (grade.is_locked) return 'Esta nota está bloqueada y no puede editarse.'
    return null
  }

  canRegisterFinalScores(grades: Grade[], enrollments: Enrollment[]): string | null {
    if (enrollments.length === 0)
      return 'No hay estudiantes inscritos en el grupo.'

    const allSent = enrollments.every((e) =>
      grades.some(
        (g) => String(g.enrollment_id) === String(e.id) && g.status === 'SENT'
      )
    )
    if (!allSent)
      return 'Todos los estudiantes deben tener calificaciones enviadas.'

    if (grades.some((g) => g.is_locked))
      return 'Las notas ya están consolidadas.'

    return null
  }

  // ── Tarea 19: Estado del proceso académico ────────────────────────────────

  buildAcademicProcessStatus(
    evaluations: Evaluation[],
    enrollments: Enrollment[],
    grades: Grade[],
    rubrics: Rubric[]
  ): AcademicProcessStatus {
    const pendingEvaluations    = evaluations.filter((e) => e.rubric_id == null).length
    const studentsWithoutGrade  = enrollments.filter(
      (e) => !grades.some(
        (g) => String(g.enrollment_id) === String(e.id) && g.status === 'SENT'
      )
    ).length
    const unpublishedRubrics    = rubrics.filter((r) => !r.is_public && !r.is_archived).length
    const finalGradesRegistered = grades.some((g) => g.is_locked)

    const total                 = enrollments.length
    const completionPercentage  = total > 0
      ? Math.round(((total - studentsWithoutGrade) / total) * 100)
      : 0

    let statusLabel: string
    let statusColor: 'green' | 'yellow' | 'red'

    if (completionPercentage === 100 && finalGradesRegistered) {
      statusLabel = 'Proceso completo'; statusColor = 'green'
    } else if (completionPercentage > 0) {
      statusLabel = 'En progreso';      statusColor = 'yellow'
    } else {
      statusLabel = 'Sin iniciar';      statusColor = 'red'
    }

    return {
      pendingEvaluations,
      studentsWithoutGrade,
      unpublishedRubrics,
      finalGradesRegistered,
      completionPercentage,
      statusLabel,
      statusColor,
    }
  }

  // ── Tarea 20: Validaciones del grupo ──────────────────────────────────────

  canAssociateRubricToEvaluation(rubric: Rubric, semesterIsActive: boolean): string | null {
    if (!rubric.is_public)     return 'Solo se pueden asociar rúbricas publicadas.'
    if (rubric.is_archived)    return 'No se pueden asociar rúbricas archivadas.'
    if (!semesterIsActive)     return 'No se pueden modificar evaluaciones en semestres cerrados.'
    return null
  }

  canRegisterGradeInSemester(semesterIsActive: boolean): string | null {
    if (!semesterIsActive)
      return 'No se pueden registrar notas en semestres cerrados.'
    return null
  }

  canModifyOfficialGrade(grade: Grade): string | null {
    if (grade.is_locked)
      return 'No se puede modificar una nota oficial ya registrada.'
    return null
  }

  isDuplicateEvaluation(
    evaluations: Evaluation[],
    name: string,
    excludeId?: number | string
  ): boolean {
    const normalized = name.trim().toLowerCase()
    return evaluations.some(
      (e) =>
        String(e.id) !== String(excludeId) &&
        (e.name ?? '').trim().toLowerCase() === normalized
    )
  }
}

// ─── Singleton ────────────────────────────────────────────────────────────────
export const groupBusiness = new GroupBusiness()