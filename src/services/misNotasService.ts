import { api } from '../interceptors/authInterceptor'

import { Grade } from '../models/Grade'
import { GradeDetail } from '../models/GradeDetail'
import { Evaluation } from '../models/Evaluation'
import { Enrollment } from '../models/Enrollment'
import { Group } from '../models/Group'
import { Subject } from '../models/Subject'

const BASE_URL_EVALUATION = '/api/evaluation'
const BASE_URL_ACADEMIC = '/api/academic'

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return 'Ocurrió un error al ejecutar la operación'
}

export const misNotasService = {
  async getGradesByStudentId(studentId: string): Promise<Grade[]> {
    try {
      const response = await api.get(`${BASE_URL_EVALUATION}/grades/search`, {
        params: {
          student_id: studentId
        }
      })

      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async getGradeDetailsByGradeId(gradeId: string): Promise<GradeDetail[]> {
    try {
      const response = await api.get(`${BASE_URL_EVALUATION}/grade-details/search`, {
        params: {
          grade_id: gradeId
        }
      })

      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async getEvaluations(): Promise<Evaluation[]> {
    try {
      const response = await api.get(`${BASE_URL_EVALUATION}/evaluations`)

      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async getEnrollmentsByStudentId(studentId: number): Promise<Enrollment[]> {
    try {
      const response = await api.get(`${BASE_URL_ACADEMIC}/enrollments/search`, {
        params: {
          student_id: studentId
        }
      })

      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async getGroups(): Promise<Group[]> {
    try {
      const response = await api.get(`${BASE_URL_ACADEMIC}/groups`)

      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async getSubjects(): Promise<Subject[]> {
    try {
      const response = await api.get(`${BASE_URL_ACADEMIC}/subjects`)

      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  }
}
