import {
  CreateSemesterDto,
  Semester,
  SemesterFilters,
  UpdateSemesterDto
} from '../models/Semester'

import { careerService } from '../services/careerService'
import { semesterService } from '../services/semesterService'

class SemesterBusiness {
  async createSemester(
    payload: CreateSemesterDto
  ): Promise<Semester> {
    this.validateCreateSemester(payload)
    await this.ensureCareerExists(payload.career_id)
    await this.ensureUniqueSemesterCode(payload.code)

    if (payload.is_active) {
      await this.ensureOnlyOneActiveSemester(
        payload.career_id
      )
    }

    return await semesterService.createSemester(payload)
  }

  async getSemesters(): Promise<Semester[]> {
    return await semesterService.getSemesters()
  }

  async getSemesterById(
    id: string
  ): Promise<Semester> {

    if (!id) {
      throw new Error('Semester id is required')
    }

    return await semesterService.getSemesterById(id)
  }

  async updateSemester(
    id: string,
    payload: UpdateSemesterDto
  ): Promise<Semester> {

    if (!id) {
      throw new Error('Semester id is required')
    }
    
    const currentSemester = await semesterService.getSemesterById(id)

    if (
      payload.name !== undefined &&
      !payload.name.trim()
    ) {
      throw new Error('Semester name cannot be empty')
    }

    if (
      payload.code !== undefined &&
      !payload.code.trim()
    ) {
      throw new Error('Semester code is required')
    }

    if (
      payload.career_id !== undefined &&
      !payload.career_id.trim()
    ) {
      throw new Error('Career is required for semester')
    }

    if (
      payload.start_date &&
      payload.end_date
    ) {
      const startDate = new Date(payload.start_date)
      const endDate = new Date(payload.end_date)

      if (startDate >= endDate) {
        throw new Error(
          'Start date must be earlier than end date'
        )
      }
    }

    if (payload.code) {
      await this.ensureUniqueSemesterCode(
        payload.code,
        id
      )
    }

    if (payload.career_id) {
      await this.ensureCareerExists(payload.career_id)
    }

    const targetCareerId = payload.career_id || currentSemester.career_id

    const isCurrentlyActive = currentSemester.is_active
    const willBeActive =
      payload.is_active === true ||
      (payload.is_active === undefined &&
        isCurrentlyActive)

    if (willBeActive) {
      await this.ensureOnlyOneActiveSemester(
        targetCareerId,
        id
      )
    }

    return await semesterService.updateSemester(
      id,
      payload
    )
  }

  async deleteSemester(
    id: string
  ): Promise<void> {

    if (!id) {
      throw new Error('Semester id is required')
    }

    await semesterService.deleteSemester(id)
  }

  async searchSemesters(
    filters: SemesterFilters
  ): Promise<Semester[]> {

    return await semesterService.searchSemesters(
      filters
    )
  }

  private validateCreateSemester(
    payload: CreateSemesterDto
  ): void {
    if (!payload.career_id?.trim()) {
      throw new Error('Career is required for semester')
    }

    if (!payload.name.trim()) {
      throw new Error('Semester name is required')
    }

    if (!payload.code.trim()) {
      throw new Error('Semester code is required')
    }

    if (!payload.start_date) {
      throw new Error('Start date is required')
    }

    if (!payload.end_date) {
      throw new Error('End date is required')
    }

    const startDate = new Date(payload.start_date)
    const endDate = new Date(payload.end_date)

    if (startDate >= endDate) {
      throw new Error(
        'Start date must be earlier than end date'
      )
    }
  }

  private async ensureUniqueSemesterCode(
    code: string,
    currentId?: string
  ): Promise<void> {
    const semesters =
      await semesterService.getSemesters()
    const normalizedCode = code
      .trim()
      .toLowerCase()

    const duplicate = semesters.some(
      (semester) =>
        semester.code
          .trim()
          .toLowerCase() === normalizedCode &&
        semester.id !== currentId
    )

    if (duplicate) {
      throw new Error('Semester code already exists')
    }
  }

  private async ensureCareerExists(
    careerId: string
  ): Promise<void> {
    if (!careerId.trim()) {
      throw new Error('Career is required for semester')
    }

    await careerService.getCareerById(careerId)
  }

  private async ensureOnlyOneActiveSemester(
    careerId: string,
    currentId?: string
  ): Promise<void> {
    const semesters =
      await semesterService.getSemesters()

    const activeSemester = semesters.find(
      (semester) =>
        semester.is_active &&
        semester.career_id === careerId &&
        semester.id !== currentId
    )

    if (activeSemester) {
      throw new Error(
        'Ya existe un semestre activo para esta carrera'
      )
    }
  }
}

export const semesterBusiness =
  new SemesterBusiness()