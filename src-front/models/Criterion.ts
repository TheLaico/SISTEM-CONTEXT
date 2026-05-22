import { Rubric } from './Rubric'
import { Scale } from './Scale'

export interface Criterion {
  id: number | string         // AJUSTE: requerido
  rubric_id: number | string  // AJUSTE: requerido

  name: string                // AJUSTE: requerido
  description?: string
  weight: number              // AJUSTE: requerido

  created_at?: string
  updated_at?: string

  rubric?: Rubric
  scales?: Scale[]
}