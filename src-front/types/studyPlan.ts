export interface StudyPlanSubject {
  subject_id: number
  subject_name: string
  subject_code: string
  credits: number
  suggested_semester: number
}

export interface AddSubjectToStudyPlanPayload {
  subject_id: number
  suggested_semester: number
  credits: number
}

export interface PublishStudyPlanPayload {
  year: number
}

export interface StudyPlanVersion {
  id: number
  career_id: number
  name: string
  year: number
  is_published: boolean
  total_subjects?: number
  total_credits?: number
  updated_at?: string
  updated_by?: string
}
