// src/models/Enrollment.ts
// version darling

import { Student } from './Student'
import { Group } from './Group'

export interface Enrollment {
  id: number | string

  student_id: number | string
  group_id: number | string

  enrollment_date: string
  status: 'ACTIVE' | 'INACTIVE' | 'WITHDRAWN'  // AJUSTE: union type explícito

  created_at: string
  updated_at: string

  student?: Student
  group?: Group
}

export interface CreateEnrollmentDto {
  student_id: string
  group_id: string
  status?: 'ACTIVE' | 'INACTIVE' | 'WITHDRAWN'
}

export interface UpdateEnrollmentDto {
  status?: 'ACTIVE' | 'INACTIVE' | 'WITHDRAWN'
}

export interface EnrollmentFilters {
  student_id?: string
  group_id?: string
  status?: string
}