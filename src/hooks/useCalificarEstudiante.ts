import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Enrollment } from '../models/Enrollment';
import { Evaluation } from '../models/Evaluation';
import { Grade } from '../models/Grade';
import { Rubric } from '../models/Rubric';
import { Criterion } from '../models/Criterion';
import { GradeDetail } from '../models/GradeDetail';
import { CriterionSelection } from '../types/rubrica';
import {
  getEnrollmentsByGroup,
  getEvaluation,
  getGradeByEnrollmentAndRubric,
  getRubricWithCriteria,
} from '../services/calificacionService';
import {
  ScaleMap,
  buildGradePayload,
  buildScaleMap,
  calcularPuntajeTotal,
  contarProgreso,
  ejecutarGuardarCalificacion,
  todosLosCriteriosSeleccionados,
} from '../business/RubricaBusiness';

type GradeWithDetails = Grade & { details?: GradeDetail[] };

interface UseCalificarEstudianteParams {
  evaluationId: string;
  groupId: string;
}

const useCalificarEstudiante = ({ evaluationId, groupId }: UseCalificarEstudianteParams) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [rubric, setRubric] = useState<Rubric | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selections, setSelections] = useState<Record<string, CriterionSelection>>({});
  const [gradeStatus, setGradeStatus] = useState<'DRAFT' | 'SENT' | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ── Carga inicial ──────────────────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [enrollmentsData, evaluationData] = await Promise.all([
          getEnrollmentsByGroup(groupId),
          getEvaluation(evaluationId),
        ]);

        if (!evaluationData.rubric_id) {
          throw new Error('La evaluación seleccionada no tiene una rúbrica asociada.');
        }

        const rubricData = await getRubricWithCriteria(evaluationData.rubric_id);

        if (!enrollmentsData.length) {
          throw new Error('No hay estudiantes inscritos en este grupo.');
        }

        if (isMounted) {
          setEnrollments(enrollmentsData);
          setEvaluation(evaluationData);
          setRubric(rubricData);
          setCurrentIndex(0);
          setActiveStep(0);
          setGradeStatus(null);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : 'Error al cargar los datos.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadInitialData();
    return () => { isMounted = false; };
  }, [evaluationId, groupId]);

  // ── Derivados ──────────────────────────────────────────────────────────────
  const currentEnrollment = useMemo(() => enrollments[currentIndex], [enrollments, currentIndex]);
  const currentStudent = useMemo(() => currentEnrollment?.student, [currentEnrollment]);
  const criteria: Criterion[] = useMemo(() => rubric?.criteria || [], [rubric]);

  const scaleMap: ScaleMap = useMemo(() => buildScaleMap(criteria), [criteria]);

  const totalScore = useMemo(
    () => calcularPuntajeTotal(criteria, selections, scaleMap),
    [criteria, selections, scaleMap],
  );

  const allCriteriaSelected = useMemo(
    () => todosLosCriteriosSeleccionados(criteria, selections),
    [criteria, selections],
  );

  const progressCount = useMemo(
    () => contarProgreso(criteria, selections),
    [criteria, selections],
  );

  // ── Carga de calificación del estudiante actual ────────────────────────────
  useEffect(() => {
    let isMounted = true;

    const loadCurrentGrade = async () => {
      if (!currentEnrollment?.id || !rubric?.id) {
        setSelections({});
        setGradeStatus(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        setSelections({});

        const grade = (await getGradeByEnrollmentAndRubric(
          currentEnrollment.id,
          rubric.id,
        )) as GradeWithDetails | null;

        if (!isMounted) return;

        if (!grade?.details?.length) {
          setGradeStatus(grade?.status === 'SENT' ? 'SENT' : 'DRAFT');
          return;
        }

        const nextSelections: Record<string, CriterionSelection> = {};

        for (const detail of grade.details) {
          if (!detail.scale_id) continue;

          const scaleMatch = scaleMap.get(detail.scale_id);
          const criterionId = scaleMatch?.criterion.id;
          if (!criterionId) continue;

          nextSelections[criterionId] = {
            criterion_id: criterionId,
            scale_id: detail.scale_id,
            comment: detail.comment || '',
          };
        }

        setSelections(nextSelections);
        setGradeStatus(grade.status === 'SENT' ? 'SENT' : 'DRAFT');
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error ? loadError.message : 'Error al cargar la calificación.',
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadCurrentGrade();
    return () => { isMounted = false; };
  }, [currentEnrollment?.id, rubric?.id, scaleMap]);

  // ── Handlers UI ───────────────────────────────────────────────────────────
  const handleSelectScale = (criterionId: string, scaleId: string) => {
    setSelections((prev) => ({
      ...prev,
      [criterionId]: {
        criterion_id: criterionId,
        scale_id: scaleId,
        comment: prev[criterionId]?.comment || '',
      },
    }));
  };

  const handleCommentChange = (criterionId: string, comment: string) => {
    setSelections((prev) => ({
      ...prev,
      [criterionId]: {
        criterion_id: criterionId,
        scale_id: prev[criterionId]?.scale_id || '',
        comment,
      },
    }));
  };

  const handlePrevStudent = () =>
    setCurrentIndex((prev) => Math.max(prev - 1, 0));

  const handleNextStudent = () =>
    setCurrentIndex((prev) => Math.min(prev + 1, Math.max(enrollments.length - 1, 0)));

  // ── Persistencia ──────────────────────────────────────────────────────────
  const persistGrade = async (status: 'DRAFT' | 'SENT') => {
    if (!currentEnrollment?.id || !rubric?.id) {
      throw new Error('No se pudo determinar la evaluación actual.');
    }

    const payload = buildGradePayload(
      currentEnrollment.id,
      rubric.id,
      criteria,
      selections,
      status,
    );

    return ejecutarGuardarCalificacion(payload);
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      await persistGrade('DRAFT');
      setGradeStatus('DRAFT');
      toast.success('Calificación guardada como borrador.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo guardar el borrador.';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSend = async () => {
    if (!allCriteriaSelected) {
      const message = 'Debes seleccionar una escala en todos los criterios para enviar la calificación.';
      setError(message);
      toast.error(message);
      throw new Error(message);
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await persistGrade('SENT');
      setGradeStatus('SENT');
      toast.success('Calificación enviada correctamente.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo enviar la calificación.';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    enrollments,
    evaluation,
    rubric,
    currentIndex,
    selections,
    loading,
    isSubmitting,
    error,
    currentEnrollment,
    currentStudent,
    totalScore,
    allCriteriaSelected,
    progressCount,
    activeStep,
    setActiveStep,
    gradeStatus,
    handleSelectScale,
    handleCommentChange,
    handlePrevStudent,
    handleNextStudent,
    handleSaveDraft,
    handleSend,
    setError,
    setCurrentIndex,
    setSelections,
  };
};

export default useCalificarEstudiante;