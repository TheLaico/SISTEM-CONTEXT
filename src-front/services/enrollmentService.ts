// src/services/enrollmentService.ts

import { api } from '../interceptors/authInterceptor';

import {
  CreateEnrollmentDto,
  Enrollment,
  EnrollmentFilters,
  UpdateEnrollmentDto,
} from '../models/Enrollment';

import { Group } from '../models/Group';
import { Semester } from '../models/Semester';
import { Subject } from '../models/Subject';

const BASE_URL = '/api/academic';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Ocurrió un error al ejecutar la operación';
}

export const enrollmentService = {
  async createEnrollment(payload: CreateEnrollmentDto): Promise<Enrollment> {
    try {
      const response = await api.post(`${BASE_URL}/enrollments`, payload);
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async getEnrollments(): Promise<Enrollment[]> {
    try {
      const response = await api.get(`${BASE_URL}/enrollments`);
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async getEnrollmentById(id: string): Promise<Enrollment> {
    try {
      const response = await api.get(`${BASE_URL}/enrollments/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async updateEnrollment(
    id: string,
    payload: UpdateEnrollmentDto,
  ): Promise<Enrollment> {
    try {
      const response = await api.put(`${BASE_URL}/enrollments/${id}`, payload);
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async deleteEnrollment(id: string): Promise<void> {
    try {
      await api.delete(`${BASE_URL}/enrollments/${id}`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async searchEnrollments(filters: EnrollmentFilters): Promise<Enrollment[]> {
    try {
      const response = await api.get(`${BASE_URL}/enrollments/search`, {
        params: filters,
      });

      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async getEnrollmentsByStudentId(studentId: number): Promise<Enrollment[]> {
    try {
      const response = await api.get(`${BASE_URL}/enrollments/search`, {
        params: {
          student_id: studentId,
        },
      });

      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async getGroups(): Promise<Group[]> {
    try {
      const response = await api.get(`${BASE_URL}/groups`);
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async getSemesters(): Promise<Semester[]> {
    try {
      const response = await api.get(`${BASE_URL}/semesters`);
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async getSubjects(): Promise<Subject[]> {
    try {
      const response = await api.get(`${BASE_URL}/subjects`);
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
