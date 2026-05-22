import { Enrollment } from './Enrollment'
import { Rubric } from './Rubric'
import { GradeDetail } from './GradeDetail'

export interface Grade {
  id: number | string              // AJUSTE: requerido
  enrollment_id: number | string   // AJUSTE: requerido
  rubric_id: number | string       // AJUSTE: requerido

  final_score: number              // AJUSTE: requerido
  status: 'DRAFT' | 'SENT'        // AJUSTE: union type
  observations?: string
  is_locked: boolean               // AJUSTE: requerido

  created_at?: string
  updated_at?: string

  enrollment?: Enrollment
  rubric?: Rubric
  details?: GradeDetail[]          // AGREGAR: alias usado en tareas 10-20
}