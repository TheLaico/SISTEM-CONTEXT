// src/business/RegistrationBusiness.ts

import {
    CreateRegistrationDto,
    UpdateRegistrationDto
} from '../models/Registration'

import { registrationService } from '../services/registrationService'

class RegistrationBusiness {
  async getRegistrations() {
    return await registrationService.getRegistrations()
  }

  async createRegistration(
    data: CreateRegistrationDto
  ) {
    if (
      !data.student_id ||
      !data.career_id
    ) {
      throw new Error(
        'Student and career are required'
      )
    }

    if (!data.admission_period?.trim()) {
      throw new Error(
        'Admission period is required'
      )
    }

    if (!data.academic_status?.trim()) {
      throw new Error(
        'Academic status is required'
      )
    }

    const registrations =
      await registrationService.getRegistrations()

    const duplicateRegistration =
      registrations.some(
        (registration) =>
          registration.student_id ===
            data.student_id &&
          registration.career_id ===
            data.career_id &&
          registration.is_active
      )

    if (duplicateRegistration) {
      throw new Error(
        'Student is already registered in this career'
      )
    }

    return await registrationService.createRegistration(
      data
    )
  }

  async updateRegistration(
    id: string,
    data: UpdateRegistrationDto
  ) {
    if (!id) {
      throw new Error('Registration id is required')
    }

    return await registrationService.updateRegistration(
      id,
      data
    )
  }

  async deleteRegistration(id: string) {
    if (!id) {
      throw new Error('Registration id is required')
    }

    await registrationService.deleteRegistration(
      id
    )
  }
}

export const registrationBusiness =
  new RegistrationBusiness()