import { api } from '../interceptors/authInterceptor'

import { Criterion } from '../models/Criterion'
import { Evaluation } from '../models/Evaluation'
import { Rubric } from '../models/Rubric'
import { Scale } from '../models/Scale'

const BASE_URL = '/api/evaluation'

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return 'Ocurrió un error al ejecutar la operación'
}

export const misEvaluacionesService = {
  async getEvaluationsByGroupIds(groupIds: string[]): Promise<Evaluation[]> {
    try {
      const response = await api.get(`${BASE_URL}/evaluations`)
      const evaluations: Evaluation[] = response.data.data

      if (groupIds.length === 0) {
        return []
      }

      return evaluations.filter((evaluation) => {
        return Boolean(evaluation.group_id && groupIds.includes(evaluation.group_id))
      })
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async getRubricById(rubricId: string): Promise<Rubric> {
    try {
      const response = await api.get(`${BASE_URL}/rubrics/${rubricId}`)

      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async getCriteriaByRubricId(rubricId: string): Promise<Criterion[]> {
    try {
      const response = await api.get(`${BASE_URL}/criteria/search`, {
        params: {
          rubric_id: rubricId
        }
      })

      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async getScalesByCriterionId(criterionId: string): Promise<Scale[]> {
    try {
      const response = await api.get(`${BASE_URL}/scales/search`, {
        params: {
          criterion_id: criterionId
        }
      })

      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  }
}
