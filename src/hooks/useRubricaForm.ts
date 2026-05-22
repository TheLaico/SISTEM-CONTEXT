import { useMemo, useState } from 'react';
import { RubricCriterio, RubricFormState } from '../types/rubrica';
import {
  INITIAL_CRITERIOS,
  INITIAL_RUBRICA_FORM,
  buildNewCriterio,
  calcularTotalPeso,
  isPesoValido,
  moveCriterioInList,
  persistRubric,
  validarRubricaParaGuardar,
  validarRubricaParaPublicar,
} from '../business/RubricaBusiness';

const useRubricaForm = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [formState, setFormState] = useState<RubricFormState>(INITIAL_RUBRICA_FORM);
  const [criterios, setCriterios] = useState<RubricCriterio[]>(INITIAL_CRITERIOS);
  const [error, setError] = useState<string | null>(null);

  const totalPeso = useMemo(() => calcularTotalPeso(criterios), [criterios]);
  const pesoValido = useMemo(() => isPesoValido(criterios), [criterios]);
  const canPublish = criterios.length > 0 && pesoValido;

  const handleInfoChange = <K extends keyof RubricFormState>(
    field: K,
    value: RubricFormState[K],
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const addCriterio = () => {
    setCriterios((prev) => [...prev, buildNewCriterio()]);
  };

  const updateCriterio = <K extends keyof RubricCriterio>(
    id: string,
    field: K,
    value: RubricCriterio[K],
  ) => {
    setCriterios((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    );
  };

  const deleteCriterio = (id: string) => {
    setCriterios((prev) => prev.filter((c) => c.id !== id));
  };

  const moveCriterio = (fromIndex: number, toIndex: number) => {
    setCriterios((prev) => moveCriterioInList(prev, fromIndex, toIndex));
  };

  const handleGuardarBorrador = async () => {
    setError(null);
    const validationError = validarRubricaParaGuardar(formState);
    if (validationError) {
      setError(validationError);
      throw new Error(validationError);
    }

    try {
      await persistRubric(formState, criterios, false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al guardar la rúbrica';
      setError(message);
      throw err;
    }
  };

  const handlePublicar = async () => {
    setError(null);
    const validationError = validarRubricaParaPublicar(formState, criterios);
    if (validationError) {
      setError(validationError);
      throw new Error(validationError);
    }

    try {
      await persistRubric(formState, criterios, true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al publicar la rúbrica';
      setError(message);
      throw err;
    }
  };

  return {
    activeStep,
    setActiveStep,
    info: formState,
    criterios,
    totalPeso,
    handleInfoChange,
    addCriterio,
    updateCriterio,
    deleteCriterio,
    moveCriterio,
    isPesoValido: pesoValido,
    canPublish,
    error,
    setError,
    handleGuardarBorrador,
    handlePublicar,
  };
};

export default useRubricaForm;