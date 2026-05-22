import {
    Career,
    CareerFilters,
    CreateCareerDto,
    UpdateCareerDto
} from '../models/Career'

import { careerService } from '../services/careerService'
import { registrationService } from '../services/registrationService'
import { semesterService } from '../services/semesterService'

class CareerBusiness {
  async createCareer(
    payload: CreateCareerDto
  ): Promise<Career> {

    this.validateCreateCareer(payload)
    await this.ensureUniqueCareerCode(payload.code)

    try {
      return await careerService.createCareer({
        name: payload.name.trim(),
        code: payload.code.trim().toUpperCase(),
        description: payload.description?.trim(),
        is_active: payload.is_active
      })

    } catch (error: any) {

      throw new Error(
        error?.response?.data?.message ||
        'Error creating career'
      )
    }
  }

  async getCareers(): Promise<Career[]> {

    try {
      return await careerService.getCareers()

    } catch (error: any) {

      throw new Error(
        error?.response?.data?.message ||
        'Error fetching careers'
      )
    }
  }

  async getCareerById(
    id: string
  ): Promise<Career> {

    if (!id) {
      throw new Error('Career id is required')
    }

    try {
      return await careerService.getCareerById(id)

    } catch (error: any) {

      throw new Error(
        error?.response?.data?.message ||
        'Error fetching career'
      )
    }
  }

  async updateCareer(
    id: string,
    payload: UpdateCareerDto
  ): Promise<Career> {

    if (!id) {
      throw new Error('Career id is required')
    }

    this.validateUpdateCareer(payload)

    if (payload.code) {
      await this.ensureUniqueCareerCode(
        payload.code,
        id
      )
    }

    if (payload.is_active === false) {
      await this.ensureCareerCanBeArchived(id)
    }

    try {
      return await careerService.updateCareer(id, payload)

    } catch (error: any) {

      throw new Error(
        error?.response?.data?.message ||
        'Error updating career'
      )
    }
  }

  private validateUpdateCareer(
    payload: UpdateCareerDto
  ): void {
    if (
      payload.name !== undefined &&
      !payload.name.trim()
    ) {
      throw new Error('Career name cannot be empty')
    }

    if (
      payload.code !== undefined &&
      !payload.code.trim()
    ) {
      throw new Error('Career code is required')
    }

    if (
      payload.code !== undefined &&
      payload.code.trim().length < 2
    ) {
      throw new Error(
        'Career code must contain at least 2 characters'
      )
    }
  }

  async deleteCareer(
    id: string
  ): Promise<void> {

    if (!id) {
      throw new Error('Career id is required')
    }

    const registrations =
      await registrationService.getRegistrations()

    const hasActiveRegistrations =
      registrations.some(
        (registration) =>
          registration.career_id ===
            id &&
          registration.is_active
      )

    if (hasActiveRegistrations) {
      throw new Error(
        'No se puede eliminar/archivar una carrera con matrículas activas'
      )
    }

    try {
      // Convertir eliminación física en archivado lógico
      await careerService.updateCareer(id, { is_active: false })

    } catch (error: any) {

      throw new Error(
        error?.response?.data?.message ||
        'Error deleting career'
      )
    }
  }

  async searchCareers(
    filters: CareerFilters
  ): Promise<Career[]> {

    try {
      return await careerService.searchCareers(filters)

    } catch (error: any) {

      throw new Error(
        error?.response?.data?.message ||
        'Error searching careers'
      )
    }
  }

  private async ensureUniqueCareerCode(
    code: string,
    currentId?: string
  ): Promise<void> {
    const careers = await careerService.getCareers()
    const normalizedCode = code.trim().toLowerCase()

    const duplicate = careers.some(
      (career) =>
        career.code.trim().toLowerCase() ===
          normalizedCode &&
        career.id !== currentId
    )

    if (duplicate) {
      throw new Error(
        'Career code already exists'
      )
    }
  }

  private async ensureCareerCanBeArchived(
    careerId: string
  ): Promise<void> {
    const semesters = await semesterService.getSemesters()

    const activeSemester = semesters.find(
      (semester) =>
        semester.career_id === careerId &&
        semester.is_active
    )

    if (activeSemester) {
      throw new Error(
        'No se puede archivar una carrera con semestres activos'
      )
    }

    const registrations = await registrationService.getRegistrations()

    const hasRegistrations = registrations.some(
      (registration) =>
        registration.career_id === careerId &&
        registration.is_active
    )

    if (hasRegistrations) {
      throw new Error(
        'No se puede archivar una carrera con estudiantes matriculados'
      )
    }
  }

  private validateCreateCareer(
    payload: CreateCareerDto
  ): void {

    if (!payload.name?.trim()) {
      throw new Error('Career name is required')
    }

    if (!payload.code?.trim()) {
      throw new Error('Career code is required')
    }

    if (payload.code.trim().length < 2) {
      throw new Error(
        'Career code must contain at least 2 characters'
      )
    }
  }
}

export const careerBusiness = new CareerBusiness()