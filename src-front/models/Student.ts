import { Registration } from './Registration'
import { User } from './User'

export interface Student {
  id?: number | string
  user_id?: number | string

  first_name?: string
  last_name?: string
  identification?: string
  code?: string              // AGREGAR: código estudiantil

  created_at?: string
  updated_at?: string

  user?: User

  registrations?: Registration[]
}