import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Group } from '../models/Group';
import { Subject } from '../models/Subject';
import {
  getGroupsByTeacher,
  getSubjects,
  createEvaluation,
} from '../services/evaluacionService';
import {
  EvaluacionFormState,
  INITIAL_EVALUACION_FORM,
  validarEvaluacion,
  buildEvaluacionPayload,
} from '../business/EvaluacionBusiness';

const useCrearEvaluacion = () => {
  const user = useSelector((state: RootState) => state.user.user);

  const [form, setForm] = useState<EvaluacionFormState>(INITIAL_EVALUACION_FORM);
  const [groups, setGroups] = useState<Group[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const teacherId = (user?.profile as any)?.id as string | undefined;
        const [groupsData, subjectsData] = await Promise.all([
          teacherId ? getGroupsByTeacher(teacherId) : Promise.resolve([]),
          getSubjects(),
        ]);
        if (isMounted) {
          setGroups(groupsData);
          setSubjects(subjectsData);
        }
      } catch (e) {
        if (isMounted)
          setError(e instanceof Error ? e.message : 'Error al cargar los datos');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => { isMounted = false; };
  }, [user]);

  // Al cambiar de grupo, auto-selecciona la asignatura del grupo
  const handleGroupChange = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId);
    setForm((prev) => ({
      ...prev,
      group_id: groupId,
      subject_id: group?.subject_id ?? prev.subject_id,
    }));
  };

  const handleChange = <K extends keyof EvaluacionFormState>(
    field: K,
    value: EvaluacionFormState[K]
  ) => {
    if (field === 'group_id') {
      handleGroupChange(value as string);
      return;
    }
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const validationError = validarEvaluacion(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await createEvaluation(buildEvaluacionPayload(form));
      setSuccess(true);
      setForm(INITIAL_EVALUACION_FORM);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al crear la evaluación');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    groups,
    subjects,
    loading,
    isSubmitting,
    error,
    success,
    handleChange,
    handleSubmit,
    setError,
    setSuccess,
  };
};

export default useCrearEvaluacion;