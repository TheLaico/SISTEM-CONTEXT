import { Criterion } from './Criterion'
import { Grade } from './Grade'
import { Evaluation } from './Evaluation'

export interface Rubric {
  id: number | string         // AJUSTE: requerido

  title: string               // AJUSTE: requerido
  description?: string
  is_public: boolean          // AJUSTE: requerido
  is_archived: boolean        // AJUSTE: requerido

  created_at?: string
  updated_at?: string

  criteria?: Criterion[]
  grades?: Grade[]
  evaluations?: Evaluation[]
}