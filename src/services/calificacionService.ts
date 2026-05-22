import { api } from '../interceptors/authInterceptor';
import { Enrollment } from '../models/Enrollment';
import { Evaluation } from '../models/Evaluation';
import { Grade } from '../models/Grade';
import { Rubric } from '../models/Rubric';
import { Criterion } from '../models/Criterion';
import { Scale } from '../models/Scale';
import { GradePayload } from '../types/rubrica';

interface ApiResponse<T> {
  data: T;
  message?: string;
}

export async function getEnrollmentsByGroup(groupId: string): Promise<Enrollment[]> {
  const response = await api.get<ApiResponse<Enrollment[]>>(
    `/api/evaluation/enrollments?group_id=${encodeURIComponent(groupId)}`,
  );
  return response.data.data;
}

export async function getEvaluation(evaluationId: string): Promise<Evaluation> {
  const response = await api.get<ApiResponse<Evaluation>>(
    `/api/evaluation/evaluations/${evaluationId}`,
  );
  return response.data.data;
}

export async function getRubricWithCriteria(rubricId: string): Promise<Rubric> {
  const response = await api.get<ApiResponse<Rubric>>(
    `/api/evaluation/rubrics/${rubricId}`,
  );
  return response.data.data;
}

export async function getGradeByEnrollmentAndRubric(
  enrollmentId: string,
  rubricId: string,
): Promise<Grade | null> {
  const response = await api.get<ApiResponse<Grade[]>>(
    `/api/evaluation/grades?enrollment_id=${encodeURIComponent(enrollmentId)}&rubric_id=${encodeURIComponent(rubricId)}`,
  );
  const grades = response.data.data;
  return grades.length > 0 ? grades[0] : null;
}

export async function saveGrade(payload: GradePayload): Promise<Grade> {
  const response = await api.post<ApiResponse<Grade>>('/api/evaluation/grades', payload);
  return response.data.data;
}

export type { Criterion, Scale };