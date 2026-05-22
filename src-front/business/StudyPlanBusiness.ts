import {
  CreateStudyPlanDto,
  StudyPlan,
  UpdateStudyPlanDto
} from '../models/StudyPlan'

import { Subject } from '../models/Subject'

import { enrollmentService } from '../services/enrollmentService'
import { groupService } from '../services/groupService'
import { studyPlanService } from '../services/studyPlanService'

import { StudyPlanSubject } from '../types/studyPlan'

function normalizeText(value: string): string {
  return value.trim().toLowerCase()
}

function getTimestamp(value?: string): number {
  if (!value) {
    return 0
  }

  const timestamp = new Date(value).getTime()

  return Number.isNaN(timestamp) ? 0 : timestamp
}

/**
 * Filtra asignaturas del catálogo que no estén ya en el plan actual.
 */
export function filterAvailableSubjects(
  allSubjects: Subject[],
  planSubjects: StudyPlanSubject[]
): Subject[] {
  const planSubjectIds = new Set(
    planSubjects.map((subject) => String(subject.subject_id))
  )

  return allSubjects.filter(
    (subject) => !planSubjectIds.has(String(subject.id))
  )
}

/**
 * Filtra asignaturas del catálogo por texto (nombre o código), insensible a mayúsculas.
 */
export function searchSubjects(
  subjects: Subject[],
  query: string
): Subject[] {
  const normalizedQuery = normalizeText(query)

  if (!normalizedQuery) {
    return subjects
  }

  return subjects.filter((subject) => {
    const subjectName = normalizeText(subject.name)
    const subjectCode = normalizeText(subject.code)

    return (
      subjectName.includes(normalizedQuery) ||
      subjectCode.includes(normalizedQuery)
    )
  })
}

/**
 * Agrupa las asignaturas del plan por semestre sugerido.
 * Retorna un objeto { [semestre: number]: StudyPlanSubject[] } ordenado por semestre.
 */
export function groupSubjectsBySemester(
  subjects: StudyPlanSubject[]
): Record<number, StudyPlanSubject[]> {
  const grouped = subjects.reduce<Record<number, StudyPlanSubject[]>>(
    (accumulator, subject) => {
      const semester = subject.suggested_semester

      if (!accumulator[semester]) {
        accumulator[semester] = []
      }

      accumulator[semester].push(subject)

      return accumulator
    },
    {}
  )

  return Object.keys(grouped)
    .map(Number)
    .sort((left, right) => left - right)
    .reduce<Record<number, StudyPlanSubject[]>>((accumulator, semester) => {
      accumulator[semester] = grouped[semester]
      return accumulator
    }, {})
}

/**
 * Calcula el total de créditos de un array de asignaturas del plan.
 */
export function calcularTotalCreditos(
  subjects: StudyPlanSubject[]
): number {
  return subjects.reduce(
    (total, subject) => total + subject.credits,
    0
  )
}

/**
 * Valida el formulario de agregar asignatura al plan.
 * Retorna string con mensaje de error, o null si es válido.
 */
export function validateAddSubjectForm(
  subjectId: number | null,
  suggestedSemester: number | null,
  credits: number | null
): string | null {
  if (subjectId === null || subjectId === undefined) {
    return 'Debe seleccionar una asignatura'
  }

  if (suggestedSemester === null || suggestedSemester === undefined) {
    return 'Debe indicar el semestre sugerido'
  }

  if (suggestedSemester <= 0) {
    return 'El semestre sugerido debe ser mayor que cero'
  }

  if (credits === null || credits === undefined) {
    return 'Debe indicar los créditos'
  }

  if (credits <= 0) {
    return 'Los créditos deben ser mayores que cero'
  }

  return null
}

/**
 * Valida el formulario de publicar nueva versión.
 * Retorna string con mensaje de error, o null si es válido.
 * - El año debe ser >= año actual.
 * - Debe haber al menos una asignatura en el plan.
 */
export function validatePublishForm(
  year: number | null,
  totalSubjects: number
): string | null {
  if (year === null || year === undefined) {
    return 'Debe indicar el año'
  }

  const currentYear = new Date().getFullYear()

  if (year < currentYear) {
    return 'El año debe ser mayor o igual al año actual'
  }

  if (totalSubjects <= 0) {
    return 'Debe haber al menos una asignatura en el plan'
  }

  return null
}

/**
 * Ordena las versiones del plan de más reciente a más antigua.
 */
export function sortStudyPlanVersions(
  plans: StudyPlan[]
): StudyPlan[] {
  return [...plans].sort((left, right) => {
    const leftUpdatedAt = getTimestamp(left.updated_at)
    const rightUpdatedAt = getTimestamp(right.updated_at)

    if (rightUpdatedAt !== leftUpdatedAt) {
      return rightUpdatedAt - leftUpdatedAt
    }

    if (right.year !== left.year) {
      return right.year - left.year
    }

    return String(right.id).localeCompare(String(left.id))
  })
}

/**
 * Retorna el plan publicado más reciente de una carrera dado un array de planes.
 * Si no hay ninguno publicado, retorna undefined.
 */
export function getActivePlan(
  plans: StudyPlan[]
): StudyPlan | undefined {
  const publishedPlans = plans.filter(
    (plan) => plan.is_published
  )

  if (publishedPlans.length === 0) {
    return undefined
  }

  return sortStudyPlanVersions(publishedPlans)[0]
}

class StudyPlanBusiness {
  async getStudyPlans() {
    return await studyPlanService.getStudyPlans()
  }

  async getStudyPlanById(id: string) {
    return await studyPlanService.getStudyPlanById(id)
  }

  async createStudyPlan(
    payload: CreateStudyPlanDto
  ) {
    this.validateStudyPlanPayload(payload)

    return await studyPlanService.createStudyPlan(
      payload
    )
  }

  async updateStudyPlan(
    id: string,
    payload: UpdateStudyPlanDto
  ) {
    if (!id) {
      throw new Error('Study plan id is required')
    }

    this.validateUpdateStudyPlan(payload)

    return await studyPlanService.updateStudyPlan(
      id,
      payload
    )
  }

  async deleteStudyPlan(id: string) {
    if (!id) {
      throw new Error('Study plan id is required')
    }

    return await studyPlanService.deleteStudyPlan(id)
  }

  async addSubjectToPlan(planId: string, payload: { subject_id: string; suggested_semester: number; credits: number }) {
    if (!planId) throw new Error('Plan id is required')

    if (!payload.subject_id) throw new Error('Subject is required')

    if (payload.suggested_semester <= 0 || payload.suggested_semester > 12) {
      throw new Error('Suggested semester must be between 1 and 12')
    }

    if (!payload.credits || payload.credits <= 0) {
      throw new Error('Credits must be greater than zero')
    }

    // prevent duplicates
    const subjects = await studyPlanService.getSubjectsByPlan(planId)

    const exists = subjects.some((s: any) => s.subject_id === payload.subject_id)

    if (exists) {
      throw new Error('La asignatura ya está presente en el plan')
    }

    return await studyPlanService.addSubjectToPlan(planId, payload)
  }

  async removeSubjectFromPlan(planId: string, subjectId: string) {
    if (!planId || !subjectId) throw new Error('Plan id and subject id are required')

    // Check groups for this subject
    const groups = await groupService.getGroups()

    const relatedGroups = groups.filter((g: any) => g.subject_id === subjectId)

    if (relatedGroups.length > 0) {
      throw new Error('No se puede eliminar la asignatura porque tiene grupos asociados')
    }

    // Check enrollments in groups of that subject
    const enrollments = await enrollmentService.getEnrollments()

    const hasEnrollments = enrollments.some((e: any) => relatedGroups.some((g: any) => g.id === e.group_id))

    if (hasEnrollments) {
      throw new Error('No se puede eliminar la asignatura porque tiene inscripciones activas en algún grupo')
    }

    return await studyPlanService.removeSubjectFromPlan(planId, subjectId)
  }

  async createVersion(payload: { career_id: string; year: number; name: string }) {
    // basic validations
    if (!payload.career_id) throw new Error('Career is required')
    if (!payload.year || payload.year <= 0) throw new Error('Year is invalid')
    if (!payload.name?.trim()) throw new Error('Version name is required')

    // create version via service
    return await studyPlanService.createVersion(payload)
  }

  async getVersionsByCareer(careerId: string) {
    if (!careerId) throw new Error('Career id is required')
    return await studyPlanService.getVersionsByCareer(careerId)
  }

  async publishVersion(versionId: string, options: { career_id: string; replace_previous?: boolean }) {
    if (!versionId) throw new Error('Version id is required')
    if (!options?.career_id) throw new Error('Career id is required')

    // Get the version to be published
    const version = await studyPlanService.getVersionById(versionId)
    
    if (!version) {
      throw new Error('Study plan version not found')
    }

    // Verify version belongs to the specified career
    if (version.career_id !== options.career_id) {
      throw new Error('Study plan version does not belong to the specified career')
    }

    // Check if version has subjects
    const subjects = await studyPlanService.getSubjectsByPlan(versionId)
    if (!subjects || subjects.length === 0) {
      throw new Error('Cannot publish a version without subjects')
    }

    // Check for existing published version in same career
    const versions = await studyPlanService.getVersionsByCareer(options.career_id)
    const alreadyPublished = versions.find((v: any) => v.is_published && v.id !== versionId)

    if (alreadyPublished && !options.replace_previous) {
      throw new Error('There is already a published version for this career. Set replace_previous to true to replace it.')
    }

    // If replacing, unpublish the previous version
    if (alreadyPublished && options.replace_previous) {
      await studyPlanService.updateStudyPlan(alreadyPublished.id, { is_published: false })
    }

    return await studyPlanService.publishVersion({ version_id: versionId, replace_previous: !!options.replace_previous })
  }

  private validateStudyPlanPayload(
    payload: CreateStudyPlanDto
  ): void {
    if (!payload.name?.trim()) {
      throw new Error(
        'Study plan name is required'
      )
    }

    if (!payload.career_id) {
      throw new Error(
        'Career is required'
      )
    }

    if (!payload.subject_id) {
      throw new Error(
        'Subject is required'
      )
    }

    if (payload.year <= 0) {
      throw new Error(
        'Year is invalid'
      )
    }

    if (
      payload.suggested_semester <= 0 ||
      payload.suggested_semester > 12
    ) {
      throw new Error(
        'Suggested semester must be between 1 and 12'
      )
    }
  }

  private validateUpdateStudyPlan(
    payload: UpdateStudyPlanDto
  ): void {
    if (
      payload.name !== undefined &&
      !payload.name.trim()
    ) {
      throw new Error(
        'Study plan name cannot be empty'
      )
    }

    if (
      payload.year !== undefined &&
      payload.year <= 0
    ) {
      throw new Error(
        'Year is invalid'
      )
    }

    if (
      payload.suggested_semester !== undefined &&
      (payload.suggested_semester <= 0 ||
        payload.suggested_semester > 12)
    ) {
      throw new Error(
        'Suggested semester must be between 1 and 12'
      )
    }
  }
}

export const studyPlanBusiness =
  new StudyPlanBusiness()