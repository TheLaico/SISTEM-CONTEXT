export interface Career {
  id: number | string
  name: string
  code: string
  description?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

//CreateCareerDto representa POST /api/academic/careers
export interface CreateCareerDto {
  name: string
  code: string
  description?: string
  is_active?: boolean
}
//interface Update representa PUT /api/academic/careers/:id
export interface UpdateCareerDto {
  name?: string
  code?: string
  description?: string
  is_active?: boolean
}
//interface careersFilters represnta GET /api/academic/careers/search
export interface CareerFilters {
  is_active?: boolean
  search?: string
}
