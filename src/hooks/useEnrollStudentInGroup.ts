// src/hooks/useEnrollStudentInGroup.ts
import { useCallback, useEffect, useState } from 'react';
import { enrollStudentBusiness } from '../business/EnrollStudentBusiness';
import { Group } from '../models/Group';
import { Student } from '../models/Student';
import { enrollStudentService } from '../services/enrollStudentService';
import {
  EnrollmentState,
  EnrollmentSummary,
  GroupTableRow
} from '../types/enrollmentFlow';

interface UseEnrollStudentInGroupReturn {
  state: EnrollmentState;
  searchResults: Student[];
  actions: {
    searchStudents: (query: string) => Promise<Student[]>;
    selectStudent: (student: Student) => Promise<void>;
    toggleGroup: (group: Group) => void;
    confirmEnrollment: () => Promise<void>;
    cancelEnrollment: (enrollmentId: string, reason: string) => Promise<void>;
    moveToStep: (step: 1 | 2 | 3 | 4 | 5) => void;
    resetForm: () => void;
  };
  derived: {
    groupTableRows: GroupTableRow[];
    enrollmentSummary: EnrollmentSummary | null;
    hasErrors: boolean;
    hasWarnings: boolean;
    creditsRemaining: number;
    isStepValid: boolean;
  };
}

const initialState: EnrollmentState = {
  currentStep: 1,
  selectedStudent: null,
  selectedGroups: [],
  activeSemester: null,
  studentRegistration: null,
  availableGroups: [],
  studentStudyPlan: null,
  studyPlanSubjects: null,
  isSearching: false,
  isConfirming: false,
  isSuccess: false,
  successDetails: null,
  errors: [],
  creditValidation: null,
};

const resolveStudentId = (student: Student): string | undefined => {
  return (
    student.id ||
    student.user_id ||
    student.user?.id ||
    student.user?.profile?.id ||
    student.user?.profile?.user_id
  );
};

export const useEnrollStudentInGroup = (): UseEnrollStudentInGroupReturn => {
  const [state, setState] = useState<EnrollmentState>(initialState);
  const [searchResults, setSearchResults] = useState<Student[]>([]);

  // Cargar semestre activo y grupos disponibles al montar
  useEffect(() => {
    const initializeData = async () => {
      try {
        const semester = await enrollStudentService.getActiveSemester();
        const groups = await enrollStudentService.getGroupsByActiveSemester();

        setState((prev) => ({
          ...prev,
          activeSemester: semester,
          availableGroups: groups,
        }));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al cargar datos';
        setState((prev) => ({
          ...prev,
          errors: [
            {
              type: 'INVALID_SEMESTER',
              message,
              severity: 'error',
            },
          ],
        }));
      }
    };

    initializeData();
  }, []);

  // Búsqueda de estudiantes
  const searchStudents = useCallback(
    async (query: string): Promise<Student[]> => {
      setState((prev) => ({ ...prev, isSearching: true }));
      try {
        const results = await enrollStudentService.searchStudents(query);
        setSearchResults(results);
        return results;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error en la búsqueda';
        setState((prev) => ({
          ...prev,
          errors: [{ type: 'INVALID_SEMESTER', message, severity: 'error' }],
        }));
        return [];
      } finally {
        setState((prev) => ({ ...prev, isSearching: false }));
      }
    },
    []
  );

  // Seleccionar estudiante
  const selectStudent = useCallback(async (student: Student) => {
    console.groupCollapsed('EnrollStudentInGroup.selectStudent');
    console.log('selectedStudent', student);
    setState((prev) => ({ ...prev, isSearching: true }));
    try {
      const studentId = resolveStudentId(student);
      console.log('resolved studentId', studentId);
      if (!studentId) {
        throw new Error('El estudiante seleccionado no tiene un identificador válido');
      }

      // Obtener matrícula
      const registration = await enrollStudentService.getStudentRegistration(
        studentId
      );
      console.log('registration', registration);

      // Obtener plan de estudios publicado
      const studyPlan = await enrollStudentService.getStudyPlanByCareer(
        registration.career_id
      );
      console.log('studyPlans', studyPlan);
      console.log('publishedPlan', studyPlan);

      const studyPlanSubjects = await enrollStudentService.getStudyPlanSubjects(
        studyPlan.id.toString()
      );
      console.log('planSubjects', studyPlanSubjects);

      setState((prev) => ({
        ...prev,
        selectedStudent: student,
        studentRegistration: registration,
        studentStudyPlan: studyPlan,
        studyPlanSubjects,
        currentStep: 2,
        errors: [],
      }));

      const validSubjectIds = studyPlanSubjects.map((item) => item.subject_id?.toString());
      const groups = state.availableGroups;
      const validGroups = groups.filter(
        (group) =>
          validSubjectIds.includes(group.subject_id?.toString()) &&
          group.semester_id?.toString() === state.activeSemester?.id?.toString()
      );
      console.log('groups', groups);
      console.log('validGroups', validGroups);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al seleccionar estudiante';
      setState((prev) => ({
        ...prev,
        selectedStudent: student,
        studentRegistration: null,
        studentStudyPlan: null,
        studyPlanSubjects: null,
        currentStep: 2,
        errors: [{ type: 'INVALID_SEMESTER', message, severity: 'error' }],
      }));
    } finally {
      console.log('EnrollStudentInGroup.selectStudent done');
      console.groupEnd();
      setState((prev) => ({ ...prev, isSearching: false }));
    }
  }, [state.activeSemester, state.availableGroups]);

  // Toggle selección de grupo
  const toggleGroup = useCallback((group: Group) => {
    setState((prev) => {
      const isSelected = prev.selectedGroups.some((g) => g.id === group.id);
      const updatedGroups = isSelected
        ? prev.selectedGroups.filter((g) => g.id !== group.id)
        : [...prev.selectedGroups, group];

      // Validar créditos totales
      const creditsValidation =
        enrollStudentBusiness.validateCreditsTotal(updatedGroups);

      return {
        ...prev,
        selectedGroups: updatedGroups,
        creditValidation: creditsValidation,
      };
    });
  }, []);

  // Confirmar inscripción
  const confirmEnrollment = useCallback(async () => {
    setState((prev) => ({ ...prev, isConfirming: true }));

    try {
      if (!state.selectedStudent || !state.studentRegistration) {
        throw new Error('Seleccione un estudiante primero');
      }

      const studentId = resolveStudentId(state.selectedStudent);
      if (!studentId) {
        throw new Error('El estudiante seleccionado no tiene un identificador válido');
      }

      if (state.selectedGroups.length === 0) {
        throw new Error('Seleccione al menos un grupo');
      }

      // Validar antes de confirmar
      const existingEnrollments = await enrollStudentService.getStudentEnrollments(
        studentId
      );

      const validationErrors = enrollStudentBusiness.validateEnrollmentBeforeConfirm(
        state.selectedGroups,
        studentId,
        state.studentRegistration,
        state.studyPlanSubjects,
        existingEnrollments
      );

      const criticalErrors = validationErrors.filter((e) => e.severity === 'error');
      if (criticalErrors.length > 0) {
        setState((prev) => ({
          ...prev,
          errors: validationErrors,
          isConfirming: false,
        }));
        return;
      }

      // Crear inscripciones
      const payloads = state.selectedGroups.map((group) => ({
        student_id: studentId,
        group_id: group.id,
      }));

      const enrollments =
        await enrollStudentService.createMultipleEnrollments(payloads);

      setState((prev) => ({
        ...prev,
        isSuccess: true,
        currentStep: 5,
        successDetails: {
          enrollmentsCreated: enrollments.length,
          enrollmentDate: new Date().toLocaleDateString(),
          semesterName: state.activeSemester?.name || 'N/A',
        },
        errors: validationErrors, // Warnings si las hay
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al confirmar inscripción';
      setState((prev) => ({
        ...prev,
        errors: [{ type: 'INVALID_SEMESTER', message, severity: 'error' }],
      }));
    } finally {
      setState((prev) => ({ ...prev, isConfirming: false }));
    }
  }, [state.selectedStudent, state.studentRegistration, state.selectedGroups, state.activeSemester]);

  // Cancelar inscripción
  const cancelEnrollment = useCallback(
    async (enrollmentId: string, reason: string) => {
      try {
        await enrollStudentService.cancelEnrollment(enrollmentId, reason);
        setState((prev) => ({
          ...prev,
          selectedGroups: prev.selectedGroups.filter(
            (g) => g.id !== enrollmentId
          ),
        }));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al cancelar inscripción';
        setState((prev) => ({
          ...prev,
          errors: [{ type: 'INVALID_SEMESTER', message, severity: 'error' }],
        }));
      }
    },
    []
  );

  // Mover a paso
  const moveToStep = useCallback((step: 1 | 2 | 3 | 4 | 5) => {
    setState((prev) => ({
      ...prev,
      currentStep: step,
    }));
  }, []);

  // Reset formulario
  const resetForm = useCallback(() => {
    setState(initialState);
    setSearchResults([]);
  }, []);

  // Valores derivados
  const validStudyPlanSubjectIds = state.studyPlanSubjects?.map((item) => item.subject_id?.toString()) || [];
  const groupsOnSemester = state.availableGroups.filter(
    (group) => group.semester_id?.toString() === state.activeSemester?.id?.toString()
  );
  const filteredGroups = validStudyPlanSubjectIds.length > 0
    ? groupsOnSemester.filter((group) =>
        validStudyPlanSubjectIds.includes(group.subject_id?.toString())
      )
    : groupsOnSemester;

  const groupTableRows = enrollStudentBusiness.buildGroupTableRows(
    filteredGroups,
    state.studyPlanSubjects || undefined
  );

  const enrollmentSummary = state.selectedGroups.length > 0
    ? enrollStudentBusiness.buildEnrollmentSummary(state.selectedGroups)
    : null;

  const hasErrors = state.errors.some((e) => e.severity === 'error');
  const hasWarnings = state.errors.some((e) => e.severity === 'warning');
  const creditsRemaining = state.activeSemester
    ? 20 - (enrollmentSummary?.totalCredits || 0)
    : 20;

  const isStepValid =
    state.currentStep === 1
      ? state.selectedStudent !== null
      : state.currentStep === 2
        ? state.studentRegistration?.is_active === true
        : state.currentStep === 3
          ? state.selectedGroups.length > 0 && !hasErrors
          : true;

  return {
    state,
    searchResults,
    actions: {
      searchStudents,
      selectStudent,
      toggleGroup,
      confirmEnrollment,
      cancelEnrollment,
      moveToStep,
      resetForm,
    },
    derived: {
      groupTableRows,
      enrollmentSummary,
      hasErrors,
      hasWarnings,
      creditsRemaining,
      isStepValid,
    },
  };
};
