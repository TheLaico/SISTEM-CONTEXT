import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import fireToast from './fireToast';
import {
  associateRubric,
  getEvaluations,
  getPublishedRubrics,
  getSubjects,
  getGroupsByTeacher,
} from '../services/evaluacionService';
import { rubricaBusiness } from '../business/RubricaBusiness';
import { Evaluation } from '../models/Evaluation';
import { Rubric } from '../models/Rubric';
import { Subject } from '../models/Subject';
import { AsociarRubricaFormState } from '../types/rubrica';

const initialFormState: AsociarRubricaFormState = {
  evaluation_id: '',
  rubric_id: '',
  subject_id: '',
};

const useAsociarRubrica = () => {
  const user = useSelector((state: RootState) => state.user.user);

  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [rubrics, setRubrics] = useState<Rubric[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [formState, setFormState] = useState<AsociarRubricaFormState>(initialFormState);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const teacherId = (user?.profile as any)?.id as string | undefined;

        const [allEvaluations, allRubrics, subjectsData, gruposDelProfesor] = await Promise.all([
          getEvaluations(),
          getPublishedRubrics(),
          getSubjects(),
          teacherId ? getGroupsByTeacher(teacherId) : Promise.resolve([]),
        ]);

        const evaluacionesFiltradas = teacherId
          ? rubricaBusiness.filtrarEvaluacionesDelProfesor(allEvaluations, gruposDelProfesor)
          : allEvaluations;

        const rubricasFiltradas = teacherId
          ? rubricaBusiness.filtrarRubricasDelProfesor(allRubrics, allEvaluations, gruposDelProfesor)
          : allRubrics;

        if (isMounted) {
          setEvaluations(evaluacionesFiltradas);
          setRubrics(rubricasFiltradas);
          setSubjects(subjectsData);
        }
      } catch (loadError) {
        if (isMounted) {
          const message =
            loadError instanceof Error ? loadError.message : 'Error al cargar los datos.';
          setError(message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const selectedEvaluation = useMemo(
    () => evaluations.find((ev) => ev.id === formState.evaluation_id),
    [evaluations, formState.evaluation_id]
  );

  const selectedRubric = useMemo(
    () => rubrics.find((r) => r.id === formState.rubric_id),
    [rubrics, formState.rubric_id]
  );

  const selectedSubject = useMemo(
    () => subjects.find((s) => s.id === formState.subject_id),
    [subjects, formState.subject_id]
  );

  const canConfirm = Boolean(
    formState.evaluation_id && formState.rubric_id && formState.subject_id
  );

  const handleSelectEvaluation = (id: string) => {
    setFormState((prev) => ({ ...prev, evaluation_id: id }));
  };

  const handleSelectRubric = (id: string) => {
    setFormState((prev) => ({ ...prev, rubric_id: id }));
  };

  const handleSelectSubject = (id: string) => {
    setFormState((prev) => ({ ...prev, subject_id: id }));
  };

  const handleNextStep = () => {
    setActiveStep((prev) => Math.min(prev + 1, 2));
  };

  const handlePrevStep = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleConfirm = async () => {
    if (!canConfirm) {
      const msg = 'Debes seleccionar una evaluación, una rúbrica y una asignatura.';
      setError(msg);
      throw new Error(msg);
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await associateRubric(formState.evaluation_id, formState.rubric_id);
      fireToast();
    } catch (confirmError) {
      const message =
        confirmError instanceof Error ? confirmError.message : 'Error al asociar la rúbrica.';
      setError(message);
      throw confirmError;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    evaluations,
    rubrics,
    subjects,
    loading,
    error,
    isSubmitting,
    activeStep,
    formState,
    selectedEvaluation,
    selectedRubric,
    selectedSubject,
    canConfirm,
    handleSelectEvaluation,
    handleSelectRubric,
    handleSelectSubject,
    handleNextStep,
    handlePrevStep,
    handleConfirm,
    setError,
    setActiveStep,
    setFormState,
  };
};

export default useAsociarRubrica;