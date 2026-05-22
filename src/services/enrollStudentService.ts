// src/services/enrollStudentService.ts
import { api } from '../interceptors/authInterceptor';
import { CreateEnrollmentDto, Enrollment } from '../models/Enrollment';
import { Group } from '../models/Group';
import { Registration } from '../models/Registration';
import { Semester } from '../models/Semester';
import { Student } from '../models/Student';
import { StudyPlan } from '../models/StudyPlan';
import { StudyPlanSubject } from '../types/studyPlan';

const BASE_URL = '/api/academic';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Ocurrió un error al ejecutar la operación';
}

export const enrollStudentService = {
  /**
   * Busca estudiantes activos por nombre, apellido o cédula
   */
  async searchStudents(query: string): Promise<Student[]> {
    try {
      const response = await api.get(`${BASE_URL}/students/search`, {
        params: { q: query, is_active: true },
      });
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Obtiene todos los estudiantes activos
   */
  async getActiveStudents(): Promise<Student[]> {
    try {
      const response = await api.get(`${BASE_URL}/students`, {
        params: { is_active: true },
      });
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Obtiene la matrícula activa de un estudiante
   */
  async getStudentRegistration(studentId: string): Promise<Registration> {
    try {
      const response = await api.get(`${BASE_URL}/registrations`, {
        params: { student_id: studentId, is_active: true },
      });

      let registrations = response.data.data as Registration[];
      console.log('EnrollStudentService.getStudentRegistration response', {
        studentId,
        params: { student_id: studentId, is_active: true },
        registrations,
      });

      if (!registrations || registrations.length === 0) {
        const fallbackResponse = await api.get(`${BASE_URL}/registrations`);
        registrations = (fallbackResponse.data.data as Registration[]).filter(
          (registration) => registration.student_id === studentId
        );
        console.log('EnrollStudentService.getStudentRegistration fallback response', {
          studentId,
          registrations,
        });
      }

      const activeRegistration = registrations.find(
        (registration) =>
          registration.is_active === true ||
          (registration as any).status?.toString().toUpperCase() === 'ACTIVE'
      );

      console.log('EnrollStudentService.getStudentRegistration activeRegistration', activeRegistration);

      if (!activeRegistration) {
        throw new Error('El estudiante no tiene matrícula activa');
      }

      return activeRegistration;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Obtiene el semestre activo
   */
  async getActiveSemester(): Promise<Semester> {
    try {
      const response = await api.get(`${BASE_URL}/semesters/search`, {
        params: { is_active: true },
      });
      const semesters = response.data.data as Semester[];
      if (!semesters || semesters.length === 0) {
        throw new Error('No hay semestre activo en el sistema');
      }
      return semesters[0];
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Obtiene grupos del semestre activo con sus datos relacionados
   */
  async getGroupsByActiveSemester(): Promise<Group[]> {
    try {
      const activeSemester = await this.getActiveSemester();
      const response = await api.get(`${BASE_URL}/groups/search`, {
        params: { semester_id: activeSemester.id },
      });
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Obtiene grupos filtrados por semestre
   */
  async getGroupsBySemesterId(semesterId: string): Promise<Group[]> {
    try {
      const response = await api.get(`${BASE_URL}/groups/search`, {
        params: { semester_id: semesterId },
      });
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Obtiene todos los grupos
   */
  async getAllGroups(): Promise<Group[]> {
    try {
      const response = await api.get(`${BASE_URL}/groups`);
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Obtiene un grupo específico
   */
  async getGroupById(groupId: string): Promise<Group> {
    try {
      const response = await api.get(`${BASE_URL}/groups/${groupId}`);
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Obtiene el plan de estudios de una carrera
   */
  async getStudyPlanByCareer(careerId: string): Promise<StudyPlan> {
    try {
      const response = await api.get(`${BASE_URL}/study-plans`, {
        params: { career_id: careerId, is_published: true },
      });

      let plans = response.data.data as StudyPlan[];
      console.log('EnrollStudentService.getStudyPlanByCareer studyPlans', {
        careerId,
        params: { career_id: careerId, is_published: true },
        plans,
      });

      if (!plans || plans.length === 0) {
        const fallbackResponse = await api.get(`${BASE_URL}/study-plans`);
        const fallbackPlans = fallbackResponse.data.data as StudyPlan[];
        console.log('EnrollStudentService.getStudyPlanByCareer fallback studyPlans', {
          careerId,
          fallbackPlans,
        });
        plans = fallbackPlans.filter(
          (plan) =>
            plan.career_id?.toString() === careerId?.toString() &&
            plan.is_published === true
        );
      }

      const publishedPlan = plans.find(
        (plan) =>
          plan.career_id?.toString() === careerId?.toString() &&
          plan.is_published === true
      );

      console.log('EnrollStudentService.getStudyPlanByCareer publishedPlan', publishedPlan);

      if (!publishedPlan) {
        throw new Error('No se encontró un plan de estudios publicado para esta carrera');
      }

      return publishedPlan;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async getStudyPlanSubjects(studyPlanId: string): Promise<StudyPlanSubject[]> {
    try {
      const response = await api.get(
        `${BASE_URL}/study-plans/${studyPlanId}/subjects`
      );
      const raw = response.data.data;
      const subjects = (raw ?? []).map((item: any): StudyPlanSubject => ({
        subject_id: item.subject_id ?? item.id ?? item.subject?.id ?? 0,
        subject_name:
          item.subject_name ?? item.subject?.name ?? item.name ?? '',
        subject_code:
          item.subject_code ?? item.subject?.code ?? item.code ?? '',
        credits: item.credits ?? item.subject?.credits ?? 0,
        suggested_semester: item.suggested_semester ?? item.suggestedSemester ?? 0,
      }));

      console.log('EnrollStudentService.getStudyPlanSubjects', {
        studyPlanId,
        subjects,
      });

      return subjects;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Obtiene un plan de estudios específico
   */
  async getStudyPlanById(planId: string): Promise<StudyPlan> {
    try {
      const response = await api.get(
        `${BASE_URL}/study-plans/${planId}`
      );
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Obtiene inscripciones (enrollments) existentes de un estudiante
   */
  async getStudentEnrollments(studentId: string): Promise<Enrollment[]> {
    try {
      const response = await api.get(
        `${BASE_URL}/enrollments/search`,
        {
          params: { student_id: studentId },
        }
      );
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Crea una inscripción (enrollment) individual
   */
  async createEnrollment(payload: CreateEnrollmentDto): Promise<Enrollment> {
    try {
      const response = await api.post(
        `${BASE_URL}/enrollments`,
        payload
      );
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Crea múltiples inscripciones en una sola transacción
   */
  async createMultipleEnrollments(
    payloads: CreateEnrollmentDto[]
  ): Promise<Enrollment[]> {
    try {
      const results: Enrollment[] = [];
      for (const payload of payloads) {
        const result = await this.createEnrollment(payload);
        results.push(result);
      }
      return results;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Cancela una inscripción (actualiza el estado a CANCELLED)
   */
  async cancelEnrollment(enrollmentId: string, reason?: string): Promise<void> {
    try {
      await api.patch(
        `${BASE_URL}/enrollments/${enrollmentId}`,
        { status: 'CANCELLED', cancellation_reason: reason }
      );
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Obtiene un enrollment específico
   */
  async getEnrollmentById(enrollmentId: string): Promise<Enrollment> {
    try {
      const response = await api.get(
        `${BASE_URL}/enrollments/${enrollmentId}`
      );
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Obtiene un estudiante específico con sus datos relacionados
   */
  async getStudentById(studentId: string): Promise<Student> {
    try {
      const response = await api.get(
        `/api/users/${studentId}`
      );
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
