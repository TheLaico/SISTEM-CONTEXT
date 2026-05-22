//mi version darling
import { Teacher } from './Teacher'
import { Subject } from './Subject'
import { Semester } from './Semester'
import { Enrollment } from './Enrollment'
import { Evaluation } from './Evaluation'


export interface Group {
  id: number | string        // AJUSTE: acepta number del backend

  teacher_id: number | string  // AJUSTE
  subject_id: number | string  // AJUSTE
  semester_id: number | string // AJUSTE

  name: string
  group_code: string
  capacity: number

  created_at: string
  updated_at: string

  teacher?: Teacher
  subject?: Subject
  semester?: Semester

  enrollments?: Enrollment[]
  evaluations?: Evaluation[]
}
export interface CreateGroupDto {
  teacher_id: string
  subject_id: string
  semester_id: string

  name: string
  group_code: string
  capacity: number
}

export interface UpdateGroupDto {
  teacher_id?: string
  subject_id?: string
  semester_id?: string

  name?: string
  group_code?: string
  capacity?: number
}

export interface GroupFilters {
  teacher_id?: string
  subject_id?: string
  semester_id?: string
  search?: string
}