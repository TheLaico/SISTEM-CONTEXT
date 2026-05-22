import { Rubric } from '../models/Rubric';
import { Group } from '../models/Group';
import { Evaluation } from '../models/Evaluation';
import { Criterion } from '../models/Criterion';
import { Scale } from '../models/Scale';
import { RubricCriterio, RubricFormState, GradePayload, CriterionSelection } from '../types/rubrica';
import {
  createCriterion,
  createRubric,
  createScale,
  publishRubric,
} from '../services/rubricaService';
import { saveGrade } from '../services/calificacionService';

// ─── Constantes iniciales ─────────────────────────────────────────────────────

export const INITIAL_CRITERIOS: RubricCriterio[] = [
  { id: Date.now().toString() + '-1', name: 'Funcionalidad',        description: '', weight: 40 },
  { id: Date.now().toString() + '-2', name: 'Calidad del código',   description: '', weight: 30 },
  { id: Date.now().toString() + '-3', name: 'Pruebas y validación', description: '', weight: 20 },
  { id: Date.now().toString() + '-4', name: 'Documentación',        description: '', weight: 10 },
];

export const INITIAL_RUBRICA_FORM: RubricFormState = {
  subject_id: '',
  title: '',
  description: '',
  criterios: [],
};

// ─── Funciones puras — formulario de rúbrica ──────────────────────────────────

export const buildNewCriterio = (): RubricCriterio => ({
  id: Date.now().toString(),
  name: '',
  description: '',
  weight: 0,
});

export const calcularTotalPeso = (criterios: RubricCriterio[]): number =>
  criterios.reduce((total, c) => total + c.weight, 0);

export const isPesoValido = (criterios: RubricCriterio[]): boolean =>
  calcularTotalPeso(criterios) === 100;

export const moveCriterioInList = (
  criterios: RubricCriterio[],
  fromIndex: number,
  toIndex: number
): RubricCriterio[] => {
  if (
    fromIndex < 0 ||
    fromIndex >= criterios.length ||
    toIndex < 0 ||
    toIndex >= criterios.length ||
    fromIndex === toIndex
  ) {
    return criterios;
  }
  const next = [...criterios];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
};

export const validarRubricaParaGuardar = (form: RubricFormState): string | null => {
  if (!form.subject_id) return 'Debes seleccionar una asignatura';
  if (!form.title?.trim()) return 'El título de la rúbrica es obligatorio';
  return null;
};

export const validarRubricaParaPublicar = (
  form: RubricFormState,
  criterios: RubricCriterio[]
): string | null => {
  const errorBase = validarRubricaParaGuardar(form);
  if (errorBase) return errorBase;
  if (criterios.length === 0) return 'Debes agregar al menos un criterio';
  if (!isPesoValido(criterios))
    return 'La suma de los pesos debe ser exactamente 100% para publicar';
  return null;
};

export const persistRubric = async (
  form: RubricFormState,
  criterios: RubricCriterio[],
  publish: boolean
): Promise<void> => {
  const rubric = await createRubric({
    title: form.title,
    description: form.description,
  });

  for (const criterio of criterios) {
    const created = await createCriterion({
      rubric_id: rubric.id,
      name: criterio.name,
      description: criterio.description,
      weight: criterio.weight,
    });

    if (criterio.scales && criterio.scales.length > 0) {
      for (const scale of criterio.scales) {
        await createScale({
          criterion_id: created.id,
          name: scale.name || '',
          description: scale.description,
          value: scale.value,
        });
      }
    }
  }

  if (publish) {
    await publishRubric(rubric.id);
  }
};

// ─── Tipos y funciones para calificación ─────────────────────────────────────

export type ScaleMap = Map<string, { scale: Scale; criterion: Criterion }>;

export const buildScaleMap = (criteria: Criterion[]): ScaleMap => {
  const map: ScaleMap = new Map();
  for (const criterion of criteria) {
    for (const scale of criterion.scales || []) {
      if (scale.id) {
        map.set(scale.id, { scale, criterion });
      }
    }
  }
  return map;
};

export const calcularPuntajeTotal = (
  criteria: Criterion[],
  selections: Record<string, CriterionSelection>,
  scaleMap: ScaleMap
): number => {
  let total = 0;
  for (const criterion of criteria) {
    const sel = selections[criterion.id || ''];
    if (!sel?.scale_id) continue;
    const entry = scaleMap.get(sel.scale_id);
    if (entry) {
      total += (entry.scale.value ?? 0) * ((criterion.weight ?? 0) / 100);
    }
  }
  return Math.round(total * 100) / 100;
};

export const todosLosCriteriosSeleccionados = (
  criteria: Criterion[],
  selections: Record<string, CriterionSelection>
): boolean => criteria.every((c) => c.id && selections[c.id]?.scale_id);

export const contarProgreso = (
  criteria: Criterion[],
  selections: Record<string, CriterionSelection>
): number => criteria.filter((c) => c.id && selections[c.id]?.scale_id).length;

export const buildGradePayload = (
  enrollmentId: string,
  rubricId: string,
  criteria: Criterion[],
  selections: Record<string, CriterionSelection>,
  status: 'DRAFT' | 'SENT'
): GradePayload => ({
  enrollment_id: enrollmentId,
  rubric_id: rubricId,
  status,
  details: criteria
    .filter((c) => c.id && selections[c.id]?.scale_id)
    .map((c) => ({
      scale_id: selections[c.id!].scale_id,
      comment: selections[c.id!].comment || undefined,
    })),
});

export const ejecutarGuardarCalificacion = async (payload: GradePayload) =>
  saveGrade(payload);

// ─── Clase con lógica de filtrado por profesor ────────────────────────────────

class RubricaBusiness {
  filtrarRubricasDelProfesor(
    rubrics: Rubric[],
    evaluations: Evaluation[],
    gruposDelProfesor: Group[]
  ): Rubric[] {
    const groupIds = new Set(gruposDelProfesor.map((g) => g.id).filter(Boolean));

    const rubricIdsDelProfesor = new Set(
      evaluations
        .filter((ev) => ev.group_id && groupIds.has(ev.group_id) && ev.rubric_id)
        .map((ev) => ev.rubric_id!)
    );

    if (rubricIdsDelProfesor.size === 0) return [];

    return rubrics.filter((r) => r.id && rubricIdsDelProfesor.has(r.id));
  }

  filtrarEvaluacionesDelProfesor(
    evaluations: Evaluation[],
    gruposDelProfesor: Group[]
  ): Evaluation[] {
    const groupIds = new Set(gruposDelProfesor.map((g) => g.id).filter(Boolean));
    return evaluations.filter((ev) => ev.group_id && groupIds.has(ev.group_id));
  }
}

export const rubricaBusiness = new RubricaBusiness();