// src/types/enrollmentFlow.ts
import { Group } from '../models/Group';
import { Registration } from '../models/Registration';
import { Semester } from '../models/Semester';
import { Student } from '../models/Student';
import { StudyPlan } from '../models/StudyPlan';
import { StudyPlanSubject } from '../types/studyPlan';

export interface StudentSearchResult {
  id: string;
  firstName: string;
  lastName: string;
  identification: string;
  careerId: string;
  careerName: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface RegistrationData {
  id: string;
  student_id: string;
  career_id: string;
  admission_period: string;
  academic_status: string;
  is_active: boolean;
}

export type ValidationStatus = 'valid' | 'warning' | 'error';

export interface ValidationResult {
  status: ValidationStatus;
  message: string;
  code?: string;
}

export interface GroupTableRow {
  id: string;
  groupCode: string;
  subjectName: string;
  subjectCode: string;
  careerName: string;
  teacherName: string;
  availableCapacity: number;
  totalCapacity: number;
  credits: number;
  capacityStatus: 'good' | 'critical' | 'none';
}

export interface SelectedGroup {
  groupId: string;
  groupCode: string;
  subjectName: string;
  credits: number;
}

export interface EnrollmentSummary {
  selectedGroups: SelectedGroup[];
  totalCredits: number;
  maxCredits: number;
  remainingCredits: number;
}

export interface EnrollmentValidationError {
  type: 'CREDITS_EXCEEDED' | 'NO_CAPACITY' | 'NO_ACTIVE_REGISTRATION' | 'NOT_IN_STUDY_PLAN' | 'ALREADY_ENROLLED' | 'INVALID_SEMESTER';
  groupId?: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface EnrollmentPayload {
  student_id: string;
  group_id: string;
}

export interface EnrollmentResponse {
  id: string;
  student_id: string;
  group_id: string;
  enrollment_date: string;
  status: string;
}

export interface EnrollStudentStep {
  step: 1 | 2 | 3 | 4 | 5;
  label: string;
  description: string;
  completed: boolean;
}

export interface EnrollmentState {
  currentStep: 1 | 2 | 3 | 4 | 5;
  selectedStudent: Student | null;
  selectedGroups: Group[];
  activeSemester: Semester | null;
  studentRegistration: Registration | null;
  availableGroups: Group[];
  studentStudyPlan: StudyPlan | null;
  studyPlanSubjects: StudyPlanSubject[] | null;
  isSearching: boolean;
  isConfirming: boolean;
  isSuccess: boolean;
  successDetails: {
    enrollmentsCreated: number;
    enrollmentDate: string;
    semesterName: string;
  } | null;
  errors: EnrollmentValidationError[];
  creditValidation: ValidationResult | null;
}
