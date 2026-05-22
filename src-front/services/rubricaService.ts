import {
  CriterionCreatePayload,
  RubricCreatePayload,
  RubricCriterio,
  Subject,
} from '../types/rubrica';
import { api } from '../interceptors/authInterceptor';

interface ApiResponse<T> {
  data: T;
  message?: string;
}

export async function getSubjects(): Promise<Subject[]> {
  const response = await api.get<ApiResponse<Subject[]>>('/api/academic/subjects');
  return response.data.data;
}

export async function createRubric(
  payload: RubricCreatePayload
): Promise<{ id: string; title: string; description: string }> {
  const response = await api.post<ApiResponse<{ id: string; title: string; description: string }>>(
    '/api/evaluation/rubrics',
    payload
  );
  return response.data.data;
}

export async function createCriterion(payload: CriterionCreatePayload): Promise<RubricCriterio> {
  const response = await api.post<ApiResponse<RubricCriterio>>(
    '/api/evaluation/criteria',
    payload
  );
  return response.data.data;
}

export interface ScaleCreatePayload {
  criterion_id: string;
  name: string;
  description?: string;
  value?: number;
}

export async function createScale(payload: ScaleCreatePayload): Promise<any> {
  const response = await api.post<ApiResponse<any>>('/api/evaluation/scales', payload);
  return response.data.data;
}

export async function publishRubric(rubricId: string): Promise<void> {
  await api.patch(`/api/evaluation/rubrics/${rubricId}/publish`);
}

export async function deleteRubrica(id: string | number): Promise<void> {
  await api.delete(`/api/evaluation/rubrics/${id}`);
}

export async function archivarRubrica(id: string | number): Promise<void> {
  await api.put(`/api/evaluation/rubrics/${id}`, { is_archived: true });
}

export async function getRubricas(): Promise<{
  id: string;
  title: string;
  description: string;
  is_public: boolean;
  is_archived: boolean;
  created_at: string;
}[]> {
  const response = await api.get<ApiResponse<{
    id: string;
    title: string;
    description: string;
    is_public: boolean;
    is_archived: boolean;
    created_at: string;
  }[]>>('/api/evaluation/rubrics');
  return response.data.data;
}

export async function getRubricaById(id: string): Promise<any> {
  const response = await api.get<ApiResponse<any>>(`/api/evaluation/rubrics/${id}`);
  return response.data.data;
}