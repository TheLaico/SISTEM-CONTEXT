import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';
import RubricaStepper from '../../components/Rubrica/RubricaStepper';
import RubricaInfoSection from '../../components/Rubrica/RubricaInfoSection';
import RubricaCriteriosTable from '../../components/Rubrica/RubricaCriteriosTable';
import RubricaFooterActions from '../../components/Rubrica/RubricaFooterActions';
import RubricaRevision from '../../components/Rubrica/RubricaRevision';
import useRubricaForm from '../../hooks/useRubricaForm';
import { getSubjects } from '../../services/rubricaService';
import { Subject } from '../../types/rubrica';

const STEPS = [
  'Información',
  'Criterios',
  'Revisión',
  'Publicar',
];

const RubricaCreatePage = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    activeStep,
    setActiveStep,
    info,
    criterios,
    totalPeso,
    canPublish,
    error,
    setError,
    handleInfoChange,
    addCriterio,
    updateCriterio,
    deleteCriterio,
    moveCriterio,
    handleGuardarBorrador,
    handlePublicar,
  } = useRubricaForm();

  useEffect(() => {
    let isMounted = true;
    const loadSubjects = async () => {
      try {
        const data = await getSubjects();
        if (isMounted) setSubjects(data);
      } catch (e) {
        console.error('Error al cargar asignaturas:', e);
      } finally {
        if (isMounted) setSubjectsLoading(false);
      }
    };
    loadSubjects();
    return () => { isMounted = false; };
  }, []);

  const handleRevisarContinuar = () => {
    // Paso 0 → 1: validar info básica
    if (activeStep === 0) {
      if (!info.subject_id || !info.title.trim()) {
        setError('Debes completar la asignatura y el título antes de continuar.');
        return;
      }
    }
    // Paso 1 → 2: validar criterios
    if (activeStep === 1) {
      if (criterios.length === 0) {
        setError('Debes agregar al menos un criterio.');
        return;
      }
      if (totalPeso !== 100) {
        setError('La suma de los pesos debe ser exactamente 100% antes de continuar.');
        return;
      }
    }
    setError(null);
    setActiveStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setError(null);
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmitGuardarBorrador = async () => {
    setIsSubmitting(true);
    try { await handleGuardarBorrador(); } finally { setIsSubmitting(false); }
  };

  const handleSubmitPublicar = async () => {
    setIsSubmitting(true);
    try { await handlePublicar(); } finally { setIsSubmitting(false); }
  };

  const selectedSubject = subjects.find((s) => s.id === info.subject_id);

  return (
    <div className="space-y-6 px-4 pb-6 sm:px-6 lg:px-8">
      <Breadcrumb pageName="Crear rúbrica de evaluación" />

      <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h1 className="text-2xl font-semibold text-black dark:text-white">
          Crear rúbrica de evaluación
        </h1>
        <p className="mt-2 text-sm text-meta-3 dark:text-meta-2">
          Diseña los criterios y asigna los pesos porcentuales para tu rúbrica.
        </p>
      </div>

      <div className="space-y-6">
        <RubricaStepper activeStep={activeStep} steps={STEPS} />

        {/* Alerta de error */}
        {error && (
          <div className="flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-500/40 dark:bg-red-950/30 dark:text-red-200">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError(null)}
              className="ml-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-lg font-semibold transition hover:bg-red-100 dark:hover:bg-red-900/40"
            >
              ×
            </button>
          </div>
        )}

        {/* PASO 0 — Información */}
        {activeStep === 0 && (
          <RubricaInfoSection
            info={info}
            onChange={handleInfoChange}
            subjects={subjects}
            subjectsLoading={subjectsLoading}
          />
        )}

        {/* PASO 1 — Criterios */}
        {activeStep === 1 && (
          <RubricaCriteriosTable
            criterios={criterios}
            onUpdate={updateCriterio}
            onDelete={deleteCriterio}
            onAdd={addCriterio}
            onMove={moveCriterio}
          />
        )}

        {/* PASO 2 — Revisión */}
        {activeStep === 2 && (
          <RubricaRevision
            info={info}
            criterios={criterios}
            totalPeso={totalPeso}
            selectedSubject={selectedSubject}
          />
        )}

        {/* PASO 3 — Publicar o guardar */}
        {activeStep === 3 && (
          <RubricaRevision
            info={info}
            criterios={criterios}
            totalPeso={totalPeso}
            selectedSubject={selectedSubject}
            publishMode
          />
        )}

        <RubricaFooterActions
          totalPeso={totalPeso}
          canPublish={canPublish}
          activeStep={activeStep}
          isSubmitting={isSubmitting}
          onCancel={() => navigate(-1)}
          onBack={handleBack}
          onGuardarBorrador={handleSubmitGuardarBorrador}
          onPublicar={handleSubmitPublicar}
          onRevisarContinuar={handleRevisarContinuar}
        />
      </div>
    </div>
  );
};

export default RubricaCreatePage;