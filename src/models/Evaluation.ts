import { Subject } from './Subject'
import { Rubric } from './Rubric'
import { Group } from './Group'

export interface Evaluation {
  id: number | string              // AJUSTE: requerido

  subject_id: number | string      // AJUSTE: requerido
  group_id: number | string        // AJUSTE: requerido
  rubric_id?: number | string

  name: string                     // AJUSTE: requerido
  description?: string
  weight: number                   // AJUSTE: requerido

  created_at?: string
  updated_at?: string

  subject?: Subject
  rubric?: Rubric
  group?: Group
}