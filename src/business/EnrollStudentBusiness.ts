// src/business/EnrollStudentBusiness.ts
import { Group } from '../models/Group';
import { Registration } from '../models/Registration';
import { Student } from '../models/Student';
import {
  EnrollmentSummary,
  EnrollmentValidationError,
  GroupTableRow,
  SelectedGroup,
  StudentSearchResult,
  ValidationResult,
} from '../types/enrollmentFlow';
import { StudyPlanSubject } from '../types/studyPlan';

const MAX_CREDITS = 20;

class EnrollStudentBusiness {
  /**
   * Valida si el estudiante tiene matrícula activa
   */
  validateStudentActiveRegistration(
    registration: Registration | null
  ): ValidationResult {
    if (!registration) {
      return {
        status: 'error',
        message: 'El estudiante no tiene matrícula registrada',
        code: 'NO_ACTIVE_REGISTRATION',
      };
    }

    if (!registration.is_active) {
      return {
        status: 'error',
        message:
          'La matrícula del estudiante no está activa. Debe activarla en el módulo de Matrículas.',
        code: 'NO_ACTIVE_REGISTRATION',
      };
    }

    return {
      status: 'valid',
      message: 'El estudiante tiene matrícula activa y puede inscribirse en grupos.',
    };
  }

  /**
   * Valida créditos totales seleccionados
   */
  validateCreditsTotal(selectedGroups: Group[]): ValidationResult {
    const totalCredits = selectedGroups.reduce(
      (sum, group) => sum + (group.subject?.credits || 0),
      0
    );

    if (totalCredits > MAX_CREDITS) {
      return {
        status: 'error',
        message: `Los créditos seleccionados (${totalCredits}) exceden el límite permitido de ${MAX_CREDITS}.`,
        code: 'CREDITS_EXCEEDED',
      };
    }

    return {
      status: 'valid',
      message: `Créditos válidos: ${totalCredits} / ${MAX_CREDITS}`,
    };
  }

  /**
   * Valida disponibilidad de cupos en un grupo
   */
  validateGroupAvailability(
    group: Group,
    existingEnrollments: number = 0
  ): ValidationResult {
    const availableCapacity = group.capacity - existingEnrollments;

    if (availableCapacity <= 0) {
      return {
        status: 'error',
        message: `El grupo ${group.group_code} no tiene cupos disponibles.`,
        code: 'NO_CAPACITY',
      };
    }

    if (availableCapacity <= 5) {
      return {
        status: 'warning',
        message: `El grupo ${group.group_code} tiene solo ${availableCapacity} cupo(s) disponible(s).`,
        code: 'CRITICAL_CAPACITY',
      };
    }

    return {
      status: 'valid',
      message: `Cupos disponibles: ${availableCapacity}`,
    };
  }

  /**
   * Valida si la asignatura del grupo pertenece al plan de estudios
   */
  validateStudentStudyPlan(
    studyPlanSubjects: StudyPlanSubject[] | null,
    subjectId: string
  ): ValidationResult {
    if (!studyPlanSubjects || studyPlanSubjects.length === 0) {
      return {
        status: 'warning',
        message: 'No se encontró un plan de estudios para validar.',
        code: 'NO_STUDY_PLAN',
      };
    }

    const isInPlan = studyPlanSubjects.some(
      (subject) => subject.subject_id?.toString() === subjectId?.toString()
    );

    if (!isInPlan) {
      return {
        status: 'warning',
        message: 'Esta asignatura no pertenece al plan de estudios de la carrera del estudiante.',
        code: 'NOT_IN_STUDY_PLAN',
      };
    }

    return {
      status: 'valid',
      message: 'La asignatura está en el plan de estudios.',
      code: 'VALID_STUDY_PLAN',
    };
  }

  /**
   * Valida si el estudiante ya está inscrito en un grupo
   */
  validateNoExistingEnrollment(
    studentId: string,
    groupId: string,
    existingEnrollments: any[]
  ): ValidationResult {
    const alreadyEnrolled = existingEnrollments.some(
      (e) => e.student_id === studentId && e.group_id === groupId
    );

    if (alreadyEnrolled) {
      return {
        status: 'error',
        message: 'El estudiante ya está inscrito en este grupo.',
        code: 'ALREADY_ENROLLED',
      };
    }

    return {
      status: 'valid',
      message: 'No hay inscripciones previas.',
    };
  }

  /**
   * Construye filas para la tabla de grupos
   */
  buildGroupTableRows(groups: Group[], studyPlanSubjects?: StudyPlanSubject[]): GroupTableRow[] {
    const subjectFallbackMap = new Map<string, StudyPlanSubject>();

    studyPlanSubjects?.forEach((subject) => {
      if (subject.subject_id != null) {
        subjectFallbackMap.set(subject.subject_id.toString(), subject);
      }
    });

    return groups.map((group) => {
      const enrollmentCount = group.enrollments?.length || 0;
      const availableCapacity = group.capacity - enrollmentCount;
      let capacityStatus: 'good' | 'critical' | 'none';

      if (availableCapacity <= 0) {
        capacityStatus = 'none';
      } else if (availableCapacity <= 5) {
        capacityStatus = 'critical';
      } else {
        capacityStatus = 'good';
      }

      const fallbackSubject = group.subject_id ? subjectFallbackMap.get(group.subject_id.toString()) : undefined;
      const subjectName = group.subject?.name || fallbackSubject?.subject_name || 'N/A';
      const subjectCode = group.subject?.code || fallbackSubject?.subject_code || 'N/A';
      const careerName = fallbackSubject ? 'Carrera actual' : 'N/A';

      return {
        id: group.id,
        groupCode: group.group_code,
        subjectName,
        subjectCode,
        careerName,
        teacherName:
          group.teacher?.first_name || (group.teacher?.user?.profile as any)?.first_name
            ? `${group.teacher?.first_name || (group.teacher?.user?.profile as any)?.first_name} ${group.teacher?.last_name || (group.teacher?.user?.profile as any)?.last_name}`.trim()
            : 'N/A',
        availableCapacity,
        totalCapacity: group.capacity,
        credits: group.subject?.credits ?? fallbackSubject?.credits ?? 0,
        capacityStatus,
      };
    });
  }

  /**
   * Valida todos los grupos seleccionados antes de confirmar
   */
  validateEnrollmentBeforeConfirm(
    selectedGroups: Group[],
    studentId: string,
    registration: Registration | null,
    studyPlanSubjects: StudyPlanSubject[] | null,
    existingEnrollments: any[]
  ): EnrollmentValidationError[] {
    const errors: EnrollmentValidationError[] = [];

    // Validar matrícula activa
    const registrationValidation =
      this.validateStudentActiveRegistration(registration);
    if (registrationValidation.status === 'error') {
      errors.push({
        type: 'NO_ACTIVE_REGISTRATION',
        message: registrationValidation.message,
        severity: 'error',
      });
    }

    // Validar créditos totales
    const creditsValidation = this.validateCreditsTotal(selectedGroups);
    if (creditsValidation.status === 'error') {
      errors.push({
        type: 'CREDITS_EXCEEDED',
        message: creditsValidation.message,
        severity: 'error',
      });
    }

    // Validar cada grupo
    selectedGroups.forEach((group) => {
      // Validar cupos
      const capacityValidation = this.validateGroupAvailability(
        group,
        group.enrollments?.length || 0
      );
      if (capacityValidation.status === 'error') {
        errors.push({
          type: 'NO_CAPACITY',
          groupId: group.id,
          message: capacityValidation.message,
          severity: 'error',
        });
      }

      // Validar plan de estudios
      if (group.subject_id) {
        const planValidation = this.validateStudentStudyPlan(
          studyPlanSubjects,
          group.subject_id
        );
        if (planValidation.status === 'warning') {
          errors.push({
            type: 'NOT_IN_STUDY_PLAN',
            groupId: group.id,
            message: planValidation.message,
            severity: 'warning',
          });
        }
      }

      // Validar inscripción previa
      const enrollmentValidation = this.validateNoExistingEnrollment(
        studentId,
        group.id,
        existingEnrollments
      );
      if (enrollmentValidation.status === 'error') {
        errors.push({
          type: 'ALREADY_ENROLLED',
          groupId: group.id,
          message: enrollmentValidation.message,
          severity: 'error',
        });
      }
    });

    return errors;
  }

  /**
   * Construye el resumen de inscripción
   */
  buildEnrollmentSummary(selectedGroups: Group[]): EnrollmentSummary {
    const totalCredits = selectedGroups.reduce(
      (sum, group) => sum + (group.subject?.credits || 0),
      0
    );

    const selectedGroupsData: SelectedGroup[] = selectedGroups.map((group) => ({
      groupId: group.id,
      groupCode: group.group_code,
      subjectName: group.subject?.name || 'N/A',
      credits: group.subject?.credits || 0,
    }));

    return {
      selectedGroups: selectedGroupsData,
      totalCredits,
      maxCredits: MAX_CREDITS,
      remainingCredits: MAX_CREDITS - totalCredits,
    };
  }

  /**
   * Convierte lista de Student a StudentSearchResult
   */
  mapStudentsToSearchResults(students: any[]): StudentSearchResult[] {
    return students.map((student) => {
      const profile = student.profile || (student.user?.profile as Student);
      return {
        id: student.id || student.user_id || '',
        firstName: (profile as Student)?.first_name || student.first_name || '',
        lastName: (profile as Student)?.last_name || student.last_name || '',
        identification: (profile as Student)?.identification || student.identification || '',
        careerId: student.id || '',
        careerName: 'Ingeniería de Sistemas',
        status: student.user?.is_active ? 'ACTIVE' : 'INACTIVE',
      };
    });
  }

  /**
   * Calcula capacidad disponible en un grupo
   */
  getAvailableCapacity(group: Group): number {
    const enrollmentCount = group.enrollments?.length || 0;
    return Math.max(0, group.capacity - enrollmentCount);
  }

  /**
   * Verifica si un grupo tiene cupo crítico (≤5 cupos)
   */
  isGroupAtCriticalCapacity(group: Group): boolean {
    return this.getAvailableCapacity(group) > 0 && this.getAvailableCapacity(group) <= 5;
  }

  /**
   * Obtiene el estado de capacidad como color/badge
   */
  getCapacityStatusBadge(group: Group): 'success' | 'warning' | 'danger' {
    const available = this.getAvailableCapacity(group);
    if (available === 0) return 'danger';
    if (available <= 5) return 'warning';
    return 'success';
  }
}

export const enrollStudentBusiness = new EnrollStudentBusiness();
