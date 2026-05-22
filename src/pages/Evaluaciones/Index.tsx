import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';

const EvaluacionesPage = () => {
  return (
    <div className="space-y-6 px-4 pb-6 sm:px-6 lg:px-8">
      <Breadcrumb
        pageName="Evaluaciones"
        items={[
          { label: 'Inicio', to: '/' },
          { label: 'Evaluaciones' },
        ]}
      />

      <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h1 className="text-2xl font-semibold text-black dark:text-white">Evaluaciones</h1>
        <p className="mt-2 text-sm text-meta-3 dark:text-meta-2">
          Administra tus evaluaciones — créalas, asóciales una rúbrica y registra calificaciones.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        {/* Crear evaluación */}
        <section className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-black dark:text-white">Crear evaluación</h2>
              <p className="mt-1 text-sm text-meta-3 dark:text-meta-2">
                Define el nombre, grupo, asignatura y peso de una nueva evaluación.
              </p>
            </div>
            <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary whitespace-nowrap">
              Paso 1
            </span>
          </div>
          <div className="mt-6">
            <Link
              to="/evaluaciones/crear"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
            >
              Crear evaluación
            </Link>
          </div>
        </section>

        {/* Asociar rúbrica */}
        <section className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-black dark:text-white">Asociar rúbrica</h2>
              <p className="mt-1 text-sm text-meta-3 dark:text-meta-2">
                Vincula una rúbrica publicada a una evaluación existente.
              </p>
            </div>
            <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary whitespace-nowrap">
              Paso 2
            </span>
          </div>
          <div className="mt-6">
            <Link
              to="/evaluaciones/asociar-rubrica"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
            >
              Asociar rúbrica
            </Link>
          </div>
        </section>

        {/* Calificar */}
        <section className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-black dark:text-white">Calificar estudiante</h2>
              <p className="mt-1 text-sm text-meta-3 dark:text-meta-2">
                Registra la calificación por criterio usando la rúbrica asociada.
              </p>
            </div>
            <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 whitespace-nowrap">
              Paso 3
            </span>
          </div>
          <div className="mt-6 rounded-md border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900 dark:border-sky-500/30 dark:bg-sky-950/20 dark:text-sky-100">
            Accede desde la ruta dinámica <span className="font-semibold">/evaluaciones/:evaluationId/:groupId/calificar</span>
          </div>
        </section>

      </div>
    </div>
  );
};

export default EvaluacionesPage;