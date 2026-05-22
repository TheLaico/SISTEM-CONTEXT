import { Scale } from './Scale'
import { Student } from './Student'

export interface GradeDetail {
  id: number | string         // AJUSTE: requerido
  scale_id: number | string   // AJUSTE: requerido
  student_id: number | string // AJUSTE: requerido

  score: number               // AJUSTE: requerido
  comment?: string

  created_at?: string
  updated_at?: string

  scale?: Scale
  student?: Student
}