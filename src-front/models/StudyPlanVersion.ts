import { StudyPlan } from './StudyPlan'

// StudyPlanVersion es un alias de StudyPlan.
// El backend no tiene un modelo de versiones separado;
// los "planes" filtrados por career_id son las versiones.
export type StudyPlanVersion = StudyPlan

export interface CreateStudyPlanVersionDto {
  career_id: string
  year: number
  name: string
}

export interface PublishVersionDto {
  version_id: string
  replace_previous?: boolean
}