export interface Subject {
  id: string;
  name: string;
  code: string;
}

export interface RubricCreatePayload {
  title: string;
  description: string;
}

export interface CriterionCreatePayload {
  rubric_id: string;
  name: string;
  description: string;
  weight: number;
}

export interface RubricCriterio {
  id: string;
  name: string;
  description: string;
  weight: number;
  scales?: Scale[];
}

export interface RubricFormState {
  subject_id: string;
  title: string;
  description: string;
  criterios: RubricCriterio[];
}

export interface AsociarRubricaFormState {
  evaluation_id: string;
  rubric_id: string;
  subject_id: string;
}

export interface GradeDetailPayload {
  scale_id: string;
  comment?: string;
}

export interface GradePayload {
  enrollment_id: string;
  rubric_id: string;
  details: GradeDetailPayload[];
  status: 'DRAFT' | 'SENT';
  observations?: string;
}

export interface CriterionSelection {
  criterion_id: string;
  scale_id: string;
  comment: string;
}

export interface Scale {
  id?: string;
  name?: string;
  description?: string;
  value?: number;
}
