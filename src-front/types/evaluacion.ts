// src/types/evaluacion.ts
export interface EvaluationCreatePayload {
  group_id: number
  subject_id: number
  name: string
  description?: string
  weight: number
}

export interface GradePayload {
  enrollment_id: number
  rubric_id: number
  details: { scale_id: number; comment?: string }[]
  status: 'DRAFT' | 'SENT'
  observations?: string
}