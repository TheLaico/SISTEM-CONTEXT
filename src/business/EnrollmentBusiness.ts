// src/business/EnrollmentBusiness.ts

import {
  CreateEnrollmentDto,
  UpdateEnrollmentDto
} from '../models/Enrollment'

import { enrollmentService } from '../services/enrollmentService'

class EnrollmentBusiness {
  async getEnrollments() {
    return enrollmentService.getEnrollments()
  }

  async getEnrollmentById(id: string) {
    if (!id) {
      throw new Error(
        'Enrollment id is required'
      )
    }

    return enrollmentService.getEnrollmentById(
      id
    )
  }

  async createEnrollment(
    data: CreateEnrollmentDto
  ) {
    if (!data.student_id) {
      throw new Error(
        'Student is required'
      )
    }

    if (!data.group_id) {
      throw new Error(
        'Group is required'
      )
    }

    return enrollmentService.createEnrollment(
      data
    )
  }

  async updateEnrollment(
    id: string,
    data: UpdateEnrollmentDto
  ) {
    if (!id) {
      throw new Error(
        'Enrollment id is required'
      )
    }

    return enrollmentService.updateEnrollment(
      id,
      data
    )
  }

  async deleteEnrollment(id: string) {
    if (!id) {
      throw new Error(
        'Enrollment id is required'
      )
    }

    await enrollmentService.deleteEnrollment(
      id
    )
  }
}

export const enrollmentBusiness =
  new EnrollmentBusiness()