import { api } from '../interceptors/authInterceptor'

import { Evaluation } from '../models/Evaluation'
import { Grade } from '../models/Grade'
import { Rubric } from '../models/Rubric'
import { Enrollment } from '../models/Enrollment'
import { Group } from '../models/Group'
import { Subject } from '../models/Subject'

import { EvaluationCreatePayload, GradePayload } from '../types/evaluacion'

// ── Re-exportar payloads para compatibilidad con código existente ──────────
export type { EvaluationCreatePayload, GradePayload }

// Alias para compatibilidad con código anterior que importaba EvaluacionCreatePayload
export type EvaluacionCreatePayload = EvaluationCreatePayload & {
  group_id: string | number
  subject_id: string | number
}

const EVAL_URL = '/api/evaluation'
const ACAD_URL = '/api/academic'

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return 'Error en operación de evaluación'
}

// ── Evaluaciones ─────────────────────────────────────────────────────────────

export async function getEvaluations(): Promise<Evaluation[]> {
  try {
    const response = await api.get(`${EVAL_URL}/evaluations`)
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function getEvaluationById(id: number | string): Promise<Evaluation> {
  try {
    const response = await api.get(`${EVAL_URL}/evaluations/${id}`)
    const data = response.data.data
    if (!data) throw new Error(`Evaluación ${id} no encontrada`)
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function getEvaluationsByGroup(groupId: number | string): Promise<Evaluation[]> {
  try {
    const response = await api.get(`${EVAL_URL}/evaluations/search`, {
      params: { group_id: groupId }
    })
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function createEvaluation(
  payload: EvaluationCreatePayload | EvaluacionCreatePayload
): Promise<Evaluation> {
  try {
    const response = await api.post(`${EVAL_URL}/evaluations`, payload)
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function updateEvaluation(
  id: number | string,
  payload: Partial<EvaluationCreatePayload>
): Promise<Evaluation> {
  try {
    const response = await api.put(`${EVAL_URL}/evaluations/${id}`, payload)
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function deleteEvaluation(id: number | string): Promise<void> {
  try {
    await api.delete(`${EVAL_URL}/evaluations/${id}`)
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function associateRubric(
  evaluationId: number | string,
  rubricId: number | string
): Promise<Evaluation> {
  try {
    const response = await api.patch(
      `${EVAL_URL}/evaluations/${evaluationId}/associate-rubric/${rubricId}`
    )
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

// ── Rúbricas ──────────────────────────────────────────────────────────────────

export async function getRubricById(rubricId: number | string): Promise<Rubric> {
  try {
    const response = await api.get(`${EVAL_URL}/rubrics/${rubricId}`)
    const data = response.data.data
    if (!data) throw new Error(`Rúbrica ${rubricId} no encontrada`)
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

/** No hay endpoint directo: obtiene rúbricas a partir de las evaluaciones del grupo */
export async function getRubricsByGroup(groupId: number | string): Promise<Rubric[]> {
  try {
    const evaluations = await getEvaluationsByGroup(groupId)
    const rubricIds = [
      ...new Set(
        evaluations
          .map((e) => e.rubric_id)
          .filter((id): id is number | string => id !== undefined && id !== null)
      )
    ]
    if (rubricIds.length === 0) return []
    return Promise.all(rubricIds.map((id) => getRubricById(id)))
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function getPublishedRubrics(): Promise<Rubric[]> {
  try {
    const response = await api.get(`${EVAL_URL}/rubrics`)
    return (response.data.data ?? []).filter((r: Rubric) => r.is_public === true)
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

// ── Calificaciones ────────────────────────────────────────────────────────────

export async function getGradesByGroup(groupId: number | string): Promise<Grade[]> {
  try {
    const response = await api.get(`${EVAL_URL}/grades/search`, {
      params: { group_id: groupId }
    })
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function getGradesByEnrollment(enrollmentId: number | string): Promise<Grade[]> {
  try {
    const response = await api.get(`${EVAL_URL}/grades/search`, {
      params: { enrollment_id: enrollmentId }
    })
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function saveGrade(payload: GradePayload): Promise<Grade> {
  try {
    const response = await api.post(`${EVAL_URL}/grades`, payload)
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function updateGrade(
  gradeId: number | string,
  payload: Partial<GradePayload>
): Promise<Grade> {
  try {
    const response = await api.put(`${EVAL_URL}/grades/${gradeId}`, payload)
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function registerFinalScores(groupId: number | string): Promise<void> {
  try {
    await api.post(`${EVAL_URL}/groups/${groupId}/register-final-scores`)
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

// ── Helpers para compatibilidad ───────────────────────────────────────────────

export async function getSubjects(): Promise<Subject[]> {
  try {
    const response = await api.get(`${ACAD_URL}/subjects`)
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function getGroupsByTeacher(teacherId: string | number): Promise<Group[]> {
  try {
    const response = await api.get(`${ACAD_URL}/groups/search`, {
      params: { teacher_id: teacherId }
    })
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

// getEnrollmentsByGroup NO se duplica aquí.
// Usar enrollmentService.searchEnrollments({ group_id }) desde el hook.

export { getRubricById as getRubricaById }
