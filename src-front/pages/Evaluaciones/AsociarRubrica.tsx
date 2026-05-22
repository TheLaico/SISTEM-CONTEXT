import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';
import EvaluacionStepper from '../../components/evaluacion/EvaluacionStepper';
import EvaluacionInfoCard from '../../components/evaluacion/EvaluacionInfoCard';
import RubricaTabla from '../../components/evaluacion/RubricaTabla';
import ResumenAsociacion from '../../components/evaluacion/ResumenAsociacion';
import useAsociarRubrica from '../../hooks/useAsociarRubrica';

const AsociarRubricaPage = () => {
  const navigate = useNavigate();
  const {
    evaluations,
    rubrics,
    subjects,
    loading,
    error,
    isSubmitting,
    activeStep,
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
  } = useAsociarRubrica();

  const handlePrimaryAction = async () => {
    try {
      if (activeStep === 2) {
        await handleConfirm();
        return;
      }

      handleNextStep();
    } catch {
      return;
    }
  };

  const primaryDisabled =
    isSubmitting ||
    (activeStep === 0 && !selectedEvaluation) ||
    (activeStep === 1 && !selectedRubric) ||
    (activeStep === 2 && !canConfirm);

  return (
    <div className="space-y-6 px-4 pb-6 sm:px-6 lg:px-8">
      <Breadcrumb
        pageName="Asociar rúbrica a evaluación y asignatura"
        items={[
          { label: 'Inicio', to: '/' },
          { label: 'Evaluaciones', to: '/evaluaciones' },
          { label: 'Asociar rúbrica' },
        ]}
      />

      <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h1 className="text-2xl font-semibold text-black dark:text-white">
          Asociar rúbrica a evaluación y asignatura
        </h1>
        <p className="mt-2 text-sm text-meta-3 dark:text-meta-2">
          Vincula una rúbrica publicada a una evaluación de una asignatura.
        </p>
      </div>

      <div className="space-y-6">
        <EvaluacionStepper
          activeStep={activeStep}
          steps={['Seleccionar evaluación', 'Seleccionar rúbrica', 'Confirmar asociación']}
        />

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
            {activeStep === 0 && (
              <section className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-black dark:text-white">Seleccionar evaluación</h2>
                    <p className="mt-1 text-sm text-meta-3 dark:text-meta-2">
                      Escoge la evaluación que recibirá la rúbrica.
                    </p>
                  </div>
                </div>

                {loading ? (
                  <div className="rounded-md border border-stroke bg-gray-50 p-6 text-sm text-meta-3 dark:border-strokedark dark:bg-meta-4/40 dark:text-meta-2">
                    Cargando evaluaciones...
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-separate border-spacing-0 text-left text-sm text-black dark:text-white">
                      <thead>
                        <tr className="border-b border-stroke text-meta-3 dark:border-strokedark dark:text-meta-2">
                          <th className="px-3 py-3"> </th>
                          <th className="px-3 py-3">Evaluación</th>
                          <th className="px-3 py-3">Asignatura</th>
                          <th className="px-3 py-3">Rúbrica</th>
                          <th className="px-3 py-3">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {evaluations.map((evaluation) => {
                          const isSelected = selectedEvaluation?.id === evaluation.id;

                          return (
                            <tr
                              key={evaluation.id}
                              className={`cursor-pointer border-b border-stroke transition dark:border-strokedark ${
                                isSelected
                                  ? 'border-primary/40 bg-primary/5 dark:bg-primary/10'
                                  : 'hover:bg-gray-50 dark:hover:bg-meta-4'
                              }`}
                              onClick={() => evaluation.id && handleSelectEvaluation(evaluation.id)}
                            >
                              <td className="px-3 py-4 align-top">
                                <input
                                  type="radio"
                                  checked={isSelected}
                                  onChange={() => evaluation.id && handleSelectEvaluation(evaluation.id)}
                                  className="h-4 w-4 accent-primary"
                                  aria-label={`Seleccionar evaluación ${evaluation.name || ''}`}
                                />
                              </td>

                              <td className="px-3 py-4 align-top">
                                <div className="space-y-1">
                                  <p className="font-semibold text-black dark:text-white">
                                    {evaluation.name || 'Sin nombre'}
                                  </p>
                                  <p className="max-w-xl text-xs leading-5 text-meta-3 dark:text-meta-2">
                                    {evaluation.description || 'Sin descripción'}
                                  </p>
                                </div>
                              </td>

                              <td className="px-3 py-4 align-top text-meta-3 dark:text-meta-2">
                                {evaluation.group?.name || evaluation.group_id || 'No disponible'}
                              </td>

                              <td className="px-3 py-4 align-top text-meta-3 dark:text-meta-2">
                                {evaluation.rubric?.title || 'Sin rúbrica'}
                              </td>

                              <td className="px-3 py-4 align-top">
                                <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                                  Disponible
                                </span>
                              </td>
                            </tr>
                          );
                        })}

                        {!evaluations.length && (
                          <tr>
                            <td colSpan={5} className="px-3 py-8 text-center text-sm text-meta-3 dark:text-meta-2">
                              No hay evaluaciones disponibles.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}

            {activeStep === 1 && (
              <div className="space-y-6">
                {selectedEvaluation ? (
                  <EvaluacionInfoCard evaluation={selectedEvaluation} />
                ) : (
                  <section className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
                    <p className="text-sm text-meta-3 dark:text-meta-2">
                      Selecciona primero una evaluación para continuar.
                    </p>
                  </section>
                )}

                {loading ? (
                  <section className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
                    <p className="text-sm text-meta-3 dark:text-meta-2">Cargando rúbricas publicadas...</p>
                  </section>
                ) : (
                  <RubricaTabla rubrics={rubrics} selectedId={selectedRubric?.id || ''} onSelect={handleSelectRubric} />
                )}

                <section className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-black dark:text-white">Asignatura</h2>
                      <p className="mt-1 text-sm text-meta-3 dark:text-meta-2">
                        Selecciona la asignatura que corresponde a la evaluación.
                      </p>
                    </div>

                    <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
                      Solo asignaturas del docente
                    </span>
                  </div>

                  <div className="mt-5 max-w-xl">
                    <label className="mb-2 block text-sm font-medium text-body dark:text-white" htmlFor="subject_id">
                      Asignatura
                    </label>
                    <select
                      id="subject_id"
                      value={selectedSubject?.id || ''}
                      onChange={(event) => handleSelectSubject(event.target.value)}
                      className="w-full rounded border border-stroke bg-gray py-3 px-3 text-sm text-black transition focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    >
                      <option value="">Selecciona una asignatura</option>
                      {subjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name} ({subject.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </section>
              </div>
            )}

            {activeStep === 2 && (
              <section className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
                <h2 className="text-lg font-semibold text-black dark:text-white">Confirmar asociación</h2>
                <p className="mt-1 text-sm text-meta-3 dark:text-meta-2">
                  Revisa los datos antes de confirmar la asociación.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-md border border-stroke bg-gray-50 p-4 dark:border-strokedark dark:bg-meta-4/40">
                    <p className="text-xs font-medium uppercase tracking-[0.08em] text-meta-3 dark:text-meta-2">Evaluación</p>
                    <p className="mt-2 text-sm font-semibold text-black dark:text-white">
                      {selectedEvaluation?.name || 'No seleccionada'}
                    </p>
                  </div>

                  <div className="rounded-md border border-stroke bg-gray-50 p-4 dark:border-strokedark dark:bg-meta-4/40">
                    <p className="text-xs font-medium uppercase tracking-[0.08em] text-meta-3 dark:text-meta-2">Rúbrica</p>
                    <p className="mt-2 text-sm font-semibold text-black dark:text-white">
                      {selectedRubric?.title || 'No seleccionada'}
                    </p>
                  </div>

                  <div className="rounded-md border border-stroke bg-gray-50 p-4 dark:border-strokedark dark:bg-meta-4/40">
                    <p className="text-xs font-medium uppercase tracking-[0.08em] text-meta-3 dark:text-meta-2">Asignatura</p>
                    <p className="mt-2 text-sm font-semibold text-black dark:text-white">
                      {selectedSubject?.name || 'No seleccionada'}
                    </p>
                  </div>

                  <div className="rounded-md border border-stroke bg-gray-50 p-4 dark:border-strokedark dark:bg-meta-4/40">
                    <p className="text-xs font-medium uppercase tracking-[0.08em] text-meta-3 dark:text-meta-2">Estado</p>
                    <p className="mt-2 text-sm font-semibold text-black dark:text-white">
                      {canConfirm ? 'Lista para confirmar' : 'Faltan datos por seleccionar'}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-md border border-primary/20 bg-primary/5 p-4 text-sm text-black dark:text-white dark:bg-primary/10">
                  <p className="font-semibold text-primary">Resumen</p>
                  <p className="mt-2 leading-6">
                    Al confirmar, la rúbrica seleccionada quedará asociada a la evaluación y asignatura elegidas.
                  </p>
                </div>
              </section>
            )}
          </div>

          <ResumenAsociacion
            evaluation={selectedEvaluation}
            rubric={selectedRubric}
            subject={selectedSubject}
          />
        </div>

        <div className="space-y-5 rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
              className="rounded-md border border-stroke bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray disabled:cursor-not-allowed disabled:opacity-60 dark:border-strokedark dark:bg-boxdark dark:text-white dark:hover:bg-meta-4"
            >
              Cancelar
            </button>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={isSubmitting || activeStep === 0}
                className="rounded-md border border-primary bg-white px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Atrás
              </button>

              <button
                type="button"
                onClick={handlePrimaryAction}
                disabled={primaryDisabled}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? 'Procesando...'
                  : activeStep === 0
                  ? 'Siguiente'
                  : activeStep === 1
                  ? 'Siguiente'
                  : 'Confirmar asociación'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsociarRubricaPage;