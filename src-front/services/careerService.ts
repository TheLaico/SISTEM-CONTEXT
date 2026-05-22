import { api } from '../interceptors/authInterceptor'

import type { CareerCreatePayload } from '../types/career'
import {
    Career,
    CareerFilters,
    CreateCareerDto,
    UpdateCareerDto
} from '../models/Career'

const BASE_URL = '/api/academic'

export const careerService = {
  async createCareer(payload: CareerCreatePayload | CreateCareerDto): Promise<Career> {
    const response = await api.post(
      `${BASE_URL}/careers`,
      payload
    )

    return response.data.data
  },

  async getCareers(): Promise<Career[]> {
    const response = await api.get(
      `${BASE_URL}/careers`
    )

    return response.data.data
  },

  async getCareerById(id: number | string): Promise<Career> {
    const response = await api.get(
      `${BASE_URL}/careers/${id}`
    )

    return response.data.data
  },

  async updateCareer(
    id: number | string,
    payload: Partial<CareerCreatePayload> | UpdateCareerDto
  ): Promise<Career> {
    const response = await api.put(
      `${BASE_URL}/careers/${id}`,
      payload
    )

    return response.data.data
  },

  async deleteCareer(id: number | string): Promise<void> {
    await api.delete(`${BASE_URL}/careers/${id}`)
  },

  async searchCareers(
    filters: CareerFilters
  ): Promise<Career[]> {
    const response = await api.get(
      `${BASE_URL}/careers/search`,
      {
        params: filters
      }
    )

    return response.data.data
  }
}