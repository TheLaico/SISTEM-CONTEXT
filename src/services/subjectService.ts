import { api } from '../interceptors/authInterceptor'

import {
  Subject,
  CreateSubjectDto,
  UpdateSubjectDto,
  SubjectFilters
} from '../models/Subject'

const BASE_URL = '/api/academic'

export const subjectService = {
  async createSubject(
    payload: CreateSubjectDto
  ): Promise<Subject> {
    const response = await api.post(
      `${BASE_URL}/subjects`,
      payload
    )

    return response.data.data
  },

  async getSubjects(): Promise<Subject[]> {
    const response = await api.get(
      `${BASE_URL}/subjects`
    )

    return response.data.data
  },

  async getSubjectById(
    id: string
  ): Promise<Subject> {
    const response = await api.get(
      `${BASE_URL}/subjects/${id}`
    )

    return response.data.data
  },

  async updateSubject(
    id: string,
    payload: UpdateSubjectDto
  ): Promise<Subject> {
    const response = await api.put(
      `${BASE_URL}/subjects/${id}`,
      payload
    )

    return response.data.data
  },

  async deleteSubject(
    id: string
  ): Promise<void> {
    await api.delete(
      `${BASE_URL}/subjects/${id}`
    )
  },

  async searchSubjects(
    filters: SubjectFilters
  ): Promise<Subject[]> {
    const response = await api.get(
      `${BASE_URL}/subjects/search`,
      {
        params: filters
      }
    )

    return response.data.data
  }
}