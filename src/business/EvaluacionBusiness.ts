import { EvaluacionCreatePayload } from '../services/evaluacionService';

export interface EvaluacionFormState {
  subject_id: string;
  group_id: string;
  name: string;
  description: string;
  weight: string; // string para el input, se convierte al enviar
}

export const INITIAL_EVALUACION_FORM: EvaluacionFormState = {
  subject_id: '',
  group_id: '',
  name: '',
  description: '',
  weight: '',
};

export const validarEvaluacion = (form: EvaluacionFormState): string | null => {
  if (!form.name.trim()) return 'El nombre de la evaluación es obligatorio';
  if (!form.group_id) return 'Debes seleccionar un grupo';
  if (!form.subject_id) return 'Debes seleccionar una asignatura';
  const w = Number(form.weight);
  if (!form.weight || isNaN(w) || w <= 0 || w > 100)
    return 'El peso debe ser un número entre 1 y 100';
  return null;
};

export const buildEvaluacionPayload = (form: EvaluacionFormState): EvaluacionCreatePayload => ({
  subject_id: form.subject_id,
  group_id: form.group_id,
  name: form.name.trim(),
  description: form.description.trim() || undefined,
  weight: Number(form.weight),
});