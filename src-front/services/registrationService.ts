// src/services/registrationService.ts
//version darling 
import api from './api'

import {
  Registration,
  CreateRegistrationDto,
  UpdateRegistrationDto,
  RegistrationFilters
} from '../models/Registration'

const BASE_URL = '/api/academic'

export const registrationService = {
  async createRegistration(
    payload: CreateRegistrationDto
  ): Promise<Registration> {
    const response = await api.post(
      `${BASE_URL}/registrations`,
      payload
    )

    return response.data.data
  },

  async getRegistrations(): Promise<Registration[]> {
    const response = await api.get(
      `${BASE_URL}/registrations`
    )

    return response.data.data
  },

  async getRegistrationById(
    id: string
  ): Promise<Registration> {
    const response = await api.get(
      `${BASE_URL}/registrations/${id}`
    )

    return response.data.data
  },

  async updateRegistration(
    id: string,
    payload: UpdateRegistrationDto
  ): Promise<Registration> {
    const response = await api.put(
      `${BASE_URL}/registrations/${id}`,
      payload
    )

    return response.data.data
  },

  async deleteRegistration(
    id: string
  ): Promise<void> {
    await api.delete(
      `${BASE_URL}/registrations/${id}`
    )
  },

  async searchRegistrations(
    filters: RegistrationFilters
  ): Promise<Registration[]> {
    const response = await api.get(
      `${BASE_URL}/registrations/search`,
      {
        params: filters
      }
    )

    return response.data.data
  }
}