import api from './api'

import {
  Semester,
  CreateSemesterDto,
  UpdateSemesterDto,
  SemesterFilters
} from '../models/Semester'

const BASE_URL = '/academic'

export const semesterService = {
  async createSemester(
    payload: CreateSemesterDto
  ): Promise<Semester> {
    const response = await api.post(
      `${BASE_URL}/semesters`,
      payload
    )

    return response.data.data
  },

  async getSemesters(): Promise<Semester[]> {
    const response = await api.get(
      `${BASE_URL}/semesters`
    )

    return response.data.data
  },

  async getSemesterById(
    id: string
  ): Promise<Semester> {
    const response = await api.get(
      `${BASE_URL}/semesters/${id}`
    )

    return response.data.data
  },

  async updateSemester(
    id: string,
    payload: UpdateSemesterDto
  ): Promise<Semester> {
    const response = await api.put(
      `${BASE_URL}/semesters/${id}`,
      payload
    )

    return response.data.data
  },

  async deleteSemester(
    id: string
  ): Promise<void> {
    await api.delete(
      `${BASE_URL}/semesters/${id}`
    )
  },

  async searchSemesters(
    filters: SemesterFilters
  ): Promise<Semester[]> {
    const response = await api.get(
      `${BASE_URL}/semesters/search`,
      {
        params: filters
      }
    )

    return response.data.data
  }
}