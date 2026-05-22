// src/types/group.ts
export interface GroupCreatePayload {
  name: string
  group_code: string
  subject_id: number
  semester_id: number
  teacher_id: number
  capacity?: number
}