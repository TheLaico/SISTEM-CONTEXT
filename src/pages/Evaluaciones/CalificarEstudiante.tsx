import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';
import Loader from '../../common/Loader';
import CalificacionStepper from '../../components/Calificacion/CalificacionStepper';
import EvaluacionInfoCard from '../../components/Calificacion/EvaluacionInfoCard';
import EstudianteInfoCard from '../../components/Calificacion/EstudianteInfoCard';
import CriteriosTabla from '../../components/Calificacion/CriteriosTabla';
import ResumenCalificacion from '../../components/Calificacion/ResumenCalificacion';
import useCalificarEstudiante from '../../hooks/useCalificarEstudiante';

const CalificarEstudiantePage = () => {
  const navigate = useNavigate();
  const { evaluationId = '', groupId = '' } = useParams<{ evaluationId: string; groupId: string }>();

  const {
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
  } = useCalificarEstudiante({ evaluationId, groupId });

  const steps = useMemo(
    () => ['Seleccionar estudiante', 'Evaluar criterios', 'Revisar y enviar'],
    []
  );

  const breadcrumbItems = useMemo(
    () => [
      { label: 'Inicio', to: '/' },
      { label: 'Evaluaciones' },
      { label: evaluation?.name || 'Evaluación' },
      { label: 'Calificar' },
    ],
    [evaluation?.name]
  );

  if (loading) {
    return <Loader />;
  }

  const handleSelectEnrollment = (index: number) => {
    setCurrentIndex(index);
    setActiveStep(1);
  };

  const handlePrimaryAction = async () => {
    if (activeStep === 2) {
      await handleSend();
      return;
    }

    setActiveStep((prevStep) => Math.min(prevStep + 1, 2));
  };

  const isNextDisabled =
    isSubmitting ||
    (activeStep === 0 && !currentEnrollment) ||
    (activeStep === 1 && !currentEnrollment) ||
    (activeStep === 2 && !allCriteriaSelected);

  const renderStepContent = () => {
    if (activeStep === 0) {
      return (
        <section className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-black dark:text-white">Seleccionar estudiante</h2>
              <p className="mt-1 text-sm text-meta-3 dark:text-meta-2">
                Elige un estudiante para comenzar la calificación.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 text-left text-sm text-black dark:text-white">
              <thead>
                <tr className="border-b border-stroke text-meta-3 dark:border-strokedark dark:text-meta-2">
                  <th className="px-3 py-3">Estudiante</th>
                  <th className="px-3 py-3">Identificación</th>
                  <th className="px-3 py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enrollment, index) => {
                  const student = enrollment.student;
                  const isSelected = currentIndex === index;
                  const fullName = `${student?.first_name || ''} ${student?.last_name || ''}`.trim() || 'No disponible';

                  return (
                    <tr
                      key={enrollment.id}
                      onClick={() => handleSelectEnrollment(index)}
                      className={`cursor-pointer border-b border-stroke transition dark:border-strokedark ${
                        isSelected ? 'border-primary/40 bg-primary/5 dark:bg-primary/10' : 'hover:bg-gray-50 dark:hover:bg-meta-4'
                      }`}
                    >
                      <td className="px-3 py-4 align-top font-medium text-black dark:text-white">{fullName}</td>
                      <td className="px-3 py-4 align-top text-meta-3 dark:text-meta-2">{student?.identification || 'No disponible'}</td>
                      <td className="px-3 py-4 align-top">
                        <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                          {enrollment.status || 'Activa'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      );
    }

    if (activeStep === 1) {
      return (
        <CriteriosTabla
          criteria={rubric?.criteria || []}
          selections={selections}
          onSelectScale={handleSelectScale}
          onCommentChange={handleCommentChange}
          totalScore={totalScore}
          progressCount={progressCount}
        />
      );
    }

    return (
      <CriteriosTabla
        criteria={rubric?.criteria || []}
        selections={selections}
        onSelectScale={() => undefined}
        onCommentChange={() => undefined}
        totalScore={totalScore}
        progressCount={progressCount}
        readOnly
      />
    );
  };

  return (
    <div className="space-y-6 px-4 pb-6 sm:px-6 lg:px-8">
      <Breadcrumb pageName="Calificar estudiante con rúbrica" items={breadcrumbItems} />

      <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h1 className="text-2xl font-semibold text-black dark:text-white">
          Calificar estudiante con rúbrica
        </h1>
        <p className="mt-2 text-sm text-meta-3 dark:text-meta-2">
          Registra el desempeño del estudiante por criterio y calcula la nota final.
        </p>
      </div>

      <div className="space-y-6">
        <CalificacionStepper activeStep={activeStep} steps={steps} />

        {error !== null && (
          <div className="flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-500/40 dark:bg-red-950/30 dark:text-red-200">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError(null)}
              className="ml-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-lg font-semibold transition hover:bg-red-100 dark:hover:bg-red-900/40"
              aria-label="Cerrar alerta"
            >
              ×
            </button>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(280px,1fr)]">
          <div className="space-y-6">
            {evaluation && rubric ? (
              <>
                <EvaluacionInfoCard evaluation={evaluation} rubric={rubric} />

                {currentEnrollment ? (
                  <EstudianteInfoCard
                    enrollment={currentEnrollment}
                    currentIndex={currentIndex}
                    total={enrollments.length}
                    onPrev={handlePrevStudent}
                    onNext={handleNextStudent}
                  />
                ) : (
                  <section className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
                    <p className="text-sm text-meta-3 dark:text-meta-2">No hay estudiante seleccionado.</p>
                  </section>
                )}
              </>
            ) : (
              <section className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
                <p className="text-sm text-meta-3 dark:text-meta-2">No fue posible cargar la evaluación o la rúbrica.</p>
              </section>
            )}

            {renderStepContent()}
          </div>

          {evaluation && rubric ? (
            <ResumenCalificacion
              rubric={rubric}
              evaluation={evaluation}
              student={currentStudent}
              selections={selections}
              totalScore={totalScore}
              status={gradeStatus}
            />
          ) : (
            <aside className="space-y-4">
              <section className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
                <p className="text-sm text-meta-3 dark:text-meta-2">
                  No fue posible cargar el resumen de calificación.
                </p>
              </section>
            </aside>
          )}
        </div>

        <div className="space-y-5 rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
              className="rounded-md border border-stroke bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray disabled:cursor-not-allowed disabled:opacity-60 dark:border-strokedark dark:bg-boxdark dark:text-white dark:hover:bg-meta-4"
            >
              Cancelar
            </button>

            <div className="flex flex-1 flex-col gap-2 text-center md:items-center">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isSubmitting}
                className="rounded-md border border-primary bg-white px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="inline-flex items-center gap-2">
                  {isSubmitting && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  )}
                  {isSubmitting ? 'Guardando...' : 'Guardar borrador'}
                </span>
              </button>
              <p className="text-xs text-meta-3 dark:text-meta-2">Se guarda sin notificar al estudiante.</p>
            </div>

            <div className="flex flex-col gap-2 text-center md:items-end">
              <button
                type="button"
                onClick={handlePrimaryAction}
                disabled={isNextDisabled}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="inline-flex items-center gap-2">
                  {isSubmitting && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  )}
                  {isSubmitting
                    ? 'Procesando...'
                    : activeStep === 2
                    ? 'Enviar calificación'
                    : 'Siguiente'}
                </span>
              </button>
              <p className="text-xs text-meta-3 dark:text-meta-2">
                {activeStep === 2
                  ? 'Calcula la nota final y notifica al estudiante.'
                  : 'Avanza al siguiente paso.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalificarEstudiantePage;