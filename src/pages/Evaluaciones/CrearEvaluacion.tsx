import { Link, useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';
import useCrearEvaluacion from '../../hooks/useCrearEvaluacion';

const CrearEvaluacionPage = () => {
  const navigate = useNavigate();
  const {
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
  } = useCrearEvaluacion();

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await handleSubmit();
  };

  return (
    <div className="space-y-6 px-4 pb-6 sm:px-6 lg:px-8">
      <Breadcrumb
        pageName="Crear evaluación"
        items={[
          { label: 'Inicio', to: '/' },
          { label: 'Evaluaciones', to: '/evaluaciones' },
          { label: 'Crear evaluación' },
        ]}
      />

      <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h1 className="text-2xl font-semibold text-black dark:text-white">Crear evaluación</h1>
        <p className="mt-2 text-sm text-meta-3 dark:text-meta-2">
          Completa los datos básicos para registrar una nueva evaluación.
        </p>
      </div>

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

      {success && (
        <div className="flex items-center justify-between rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-950/30 dark:text-emerald-200">
          <span>La evaluación fue creada correctamente.</span>
          <button
            type="button"
            onClick={() => setSuccess(false)}
            className="ml-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-lg font-semibold transition hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
          >
            ×
          </button>
        </div>
      )}

      <form
        onSubmit={handleFormSubmit}
        className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-black dark:text-white">
            <span>Nombre</span>
            <input
              type="text"
              value={form.name}
              onChange={(event) => handleChange('name', event.target.value)}
              className="w-full rounded border border-stroke bg-transparent px-4 py-2 outline-none transition focus:border-primary dark:border-strokedark"
              placeholder="Ej. Parcial 1"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-black dark:text-white">
            <span>Peso (%)</span>
            <input
              type="number"
              min="1"
              max="100"
              value={form.weight}
              onChange={(event) => handleChange('weight', event.target.value)}
              className="w-full rounded border border-stroke bg-transparent px-4 py-2 outline-none transition focus:border-primary dark:border-strokedark"
              placeholder="Ej. 25"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-black dark:text-white md:col-span-2">
            <span>Descripción</span>
            <textarea
              value={form.description}
              onChange={(event) => handleChange('description', event.target.value)}
              className="min-h-28 w-full rounded border border-stroke bg-transparent px-4 py-2 outline-none transition focus:border-primary dark:border-strokedark"
              placeholder="Descripción opcional de la evaluación"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-black dark:text-white">
            <span>Grupo</span>
            <select
              value={form.group_id}
              onChange={(event) => handleChange('group_id', event.target.value)}
              disabled={loading}
              className="w-full rounded border border-stroke bg-transparent px-4 py-2 outline-none transition focus:border-primary dark:border-strokedark"
            >
              <option value="">Selecciona un grupo</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm text-black dark:text-white">
            <span>Asignatura</span>
            <select
              value={form.subject_id}
              onChange={(event) => handleChange('subject_id', event.target.value)}
              disabled={loading}
              className="w-full rounded border border-stroke bg-transparent px-4 py-2 outline-none transition focus:border-primary dark:border-strokedark"
            >
              <option value="">Selecciona una asignatura</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Link
            to="/evaluaciones"
            className="inline-flex items-center justify-center rounded-md border border-stroke px-4 py-2 text-sm font-medium text-black transition hover:border-primary hover:text-primary dark:border-strokedark dark:text-white"
          >
            Volver
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Guardando...' : 'Crear evaluación'}
          </button>
        </div>
      </form>

      <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <p className="text-sm text-meta-3 dark:text-meta-2">
          El grupo seleccionado ajusta automáticamente la asignatura asociada cuando el flujo lo permite.
        </p>
        <button
          type="button"
          onClick={() => navigate('/evaluaciones')}
          className="mt-4 inline-flex items-center rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-black transition hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
        >
          Ir al panel de evaluaciones
        </button>
      </div>
    </div>
  );
};

export default CrearEvaluacionPage;
