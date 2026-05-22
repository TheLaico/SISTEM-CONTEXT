import { Criterion } from './Criterion'
import { GradeDetail } from './GradeDetail'

export interface Scale {
  id: number | string              // AJUSTE: requerido
  criterion_id: number | string    // AJUSTE: requerido

  name: string                     // AJUSTE: requerido
  description?: string
  value: number                    // AJUSTE: requerido

  created_at?: string
  updated_at?: string

  criterion?: Criterion
  grade_details?: GradeDetail[]
}