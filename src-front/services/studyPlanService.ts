import { api } from '../interceptors/authInterceptor'

import { Career } from '../models/Career'
import { StudyPlan } from '../models/StudyPlan'
import { Subject } from '../models/Subject'

import {
  AddSubjectToStudyPlanPayload,
  StudyPlanSubject
} from '../types/studyPlan'

type StudyPlanPayload = Omit<StudyPlan, 'id' | 'is_published' | 'created_at' | 'updated_at'>

const BASE_URL = '/api/academic'

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return 'Error al ejecutar la operación de plan de estudios'
}

export const studyPlanService = {
  async getStudyPlans(): Promise<StudyPlan[]> {
    try {
      const response = await api.get(`${BASE_URL}/study-plans`)

      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async getStudyPlanById(id: string | number): Promise<StudyPlan> {
    try {
      const response = await api.get(`${BASE_URL}/study-plans/${id}`)

      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async getStudyPlansByCareer(careerId: number): Promise<StudyPlan[]> {
    try {
      const response = await api.get(`${BASE_URL}/study-plans/search`, {
        params: {
          career_id: careerId
        }
      })

      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async createStudyPlan(
    payload: StudyPlanPayload
  ): Promise<StudyPlan> {
    try {
      const response = await api.post(`${BASE_URL}/study-plans`, {
        career_id: payload.career_id,
        name: payload.name,
        year: payload.year,
        suggested_semester: payload.suggested_semester
      })

      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

    async getSubjectsByStudyPlan(
      studyPlanId: string | number
    ): Promise<StudyPlanSubject[]> {
      try {
        const response = await api.get(
          `${BASE_URL}/study-plans/${studyPlanId}/subjects`
        )
      const raw = response.data.data

      // Normaliza la respuesta del API al tipo StudyPlanSubject
      return (raw ?? []).map((item: any): StudyPlanSubject => ({
        subject_id:         item.subject_id         ?? item.id               ?? 0,
        subject_name:       item.subject_name        ?? item.subject?.name    ?? item.name  ?? '',
        subject_code:       item.subject_code        ?? item.subject?.code    ?? item.code  ?? '',
        credits:            item.credits             ?? item.subject?.credits ?? 0,
        suggested_semester: item.suggested_semester  ?? 0
      }))
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

async addSubjectToStudyPlan(
  studyPlanId: number,
  subjectId: number,
  _payload?: AddSubjectToStudyPlanPayload  // se mantiene para no romper los tipos existentes
): Promise<void> {
  try {
    const response = await api.post(
      `${BASE_URL}/study-plans/${studyPlanId}/subjects/${subjectId}`
      // sin body — el backend solo necesita los IDs en la URL
    )
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
},

  async removeSubjectFromStudyPlan(
    studyPlanId: number,
    subjectId: number
  ): Promise<void> {
    try {
      const response = await api.delete(
        `${BASE_URL}/study-plans/${studyPlanId}/subjects/${subjectId}`
      )

      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async getVersionsByCareer(careerId: string): Promise<StudyPlan[]> {
    try {
      const response = await api.get(`${BASE_URL}/study-plans/search`, {
        params: { career_id: careerId }
      })

      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async createVersion(
    payload: {
      career_id: string
      year: number
      name: string
    }
  ): Promise<StudyPlan> {
    try {
      const response = await api.post(`${BASE_URL}/study-plans`, payload)
      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async getVersionById(id: string): Promise<StudyPlan> {
    try {
      const response = await api.get(`${BASE_URL}/study-plans/${id}`)
      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async publishVersion(
    payload: {
      version_id: string
      replace_previous?: boolean
    }
  ): Promise<StudyPlan> {
    try {
      const response = await api.patch(
        `/api/evaluation/rubrics/${payload.version_id}/publish`
      )
      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async getCareers(): Promise<Career[]> {
    try {
      const response = await api.get(`${BASE_URL}/careers`)

      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async getAllSubjects(): Promise<Subject[]> {
    try {
      const response = await api.get(`${BASE_URL}/subjects`)

      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async updateStudyPlan(id: string | number, payload: unknown): Promise<StudyPlan> {
    try {
      const response = await api.put(
        `${BASE_URL}/study-plans/${id}`,
        payload
      )

      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async deleteStudyPlan(id: string): Promise<void> {
    try {
      await api.delete(`${BASE_URL}/study-plans/${id}`)
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async searchStudyPlans(filters: Record<string, unknown>): Promise<StudyPlan[]> {
    try {
      const response = await api.get(`${BASE_URL}/study-plans/search`, {
        params: filters
      })

      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },
  // Obtiene planes de estudio que contienen una asignatura específica.
  // Usa subject_id como filtro directo en el backend (/search?subject_id=...).
  // Si el backend no soporta el filtro, retorna todos los planes y
  // filterStudyPlansBySubject (en GroupBusiness) aplica el filtro local.
  async getStudyPlansBySubject(subjectId: number | string): Promise<StudyPlan[]> {
    try {
      const response = await api.get(`${BASE_URL}/study-plans/search`, {
        params: { subject_id: subjectId }
      })
      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async getSubjectsByPlan(planId: number | string): Promise<Subject[]> {
    try {
      const response = await api.get(`${BASE_URL}/study-plans/${planId}/subjects`)
      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async addSubjectToPlan(planId: number | string, subjectId: number | string): Promise<void> {
    try {
      await api.post(`${BASE_URL}/study-plans/${planId}/subjects/${subjectId}`)
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async removeSubjectFromPlan(planId: number | string, subjectId: number | string): Promise<void> {
    try {
      await api.delete(`${BASE_URL}/study-plans/${planId}/subjects/${subjectId}`)
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  }
  
}