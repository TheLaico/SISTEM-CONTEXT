// src/models/Registration.ts
//mi version 

import { Career } from './Career'
import { Student } from './Student'

export interface Registration {
  id: string

  career_id: string
  student_id: string

  admission_period: string
  academic_status: string

  is_active: boolean

  created_at: string
  updated_at: string

  career?: Career
  student?: Student
}

export interface CreateRegistrationDto {
  career_id: string
  student_id: string
  admission_period: string
  academic_status: string
}

export interface UpdateRegistrationDto {
  career_id?: string
  student_id?: string
  admission_period?: string
  academic_status?: string
  is_active?: boolean
}

export interface RegistrationFilters {
  career_id?: string
  student_id?: string
  is_active?: boolean
  search?: string
}