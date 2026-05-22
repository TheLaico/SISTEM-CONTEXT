//version darling
import { Evaluation } from './Evaluation'
import { Group } from './Group'
import { StudyPlan } from './StudyPlan'

export interface Subject {
  id: number | string

  name: string
  code: string
  description?: string

  credits: number
  is_active: boolean

  created_at: string
  updated_at: string

  groups?: Group[]
  study_plans?: StudyPlan[]
  evaluations?: Evaluation[]
}
export interface CreateSubjectDto {
  name: string
  code: string
  description?: string
  credits: number
  is_active?: boolean
}
export interface UpdateSubjectDto {
  name?: string
  code?: string
  description?: string
  credits?: number
  is_active?: boolean
}
export interface SubjectFilters {
  is_active?: boolean
  search?: string
}