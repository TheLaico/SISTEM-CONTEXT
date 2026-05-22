import { Evaluation } from '../../models/Evaluation';

interface EvaluacionInfoCardProps {
  evaluation: Evaluation;
}

const EvaluacionInfoCard = ({ evaluation }: EvaluacionInfoCardProps) => {
  return (
    <section className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-black dark:text-white">Datos de la evaluación</h2>
          <p className="mt-1 text-sm text-meta-3 dark:text-meta-2">Información general de la evaluación seleccionada.</p>
        </div>

        <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
          Activa
        </span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-md border border-stroke bg-gray-50 p-4 dark:border-strokedark dark:bg-meta-4/40">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-meta-3 dark:text-meta-2">Nombre</p>
            <p className="mt-2 text-sm font-semibold text-black dark:text-white">{evaluation.name || 'No disponible'}</p>
          </div>

          <div className="rounded-md border border-stroke bg-gray-50 p-4 dark:border-strokedark dark:bg-meta-4/40">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-meta-3 dark:text-meta-2">Código</p>
            <p className="mt-2 text-sm font-semibold text-black dark:text-white">{evaluation.group_id || 'No disponible'}</p>
          </div>

          <div className="rounded-md border border-stroke bg-gray-50 p-4 dark:border-strokedark dark:bg-meta-4/40 sm:col-span-2">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-meta-3 dark:text-meta-2">Descripción</p>
            <p className="mt-2 text-sm text-black dark:text-white">{evaluation.description || 'Sin descripción'}</p>
          </div>

          <div className="rounded-md border border-stroke bg-gray-50 p-4 dark:border-strokedark dark:bg-meta-4/40 sm:col-span-2">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-meta-3 dark:text-meta-2">Peso</p>
            <p className="mt-2 text-sm font-semibold text-black dark:text-white">
              {evaluation.weight !== undefined && evaluation.weight !== null ? `${evaluation.weight}%` : '0%'}
            </p>
          </div>
        </div>

        <aside className="rounded-md border border-sky-200 bg-sky-50 p-4 text-sky-900 dark:border-sky-500/30 dark:bg-sky-950/30 dark:text-sky-100">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-lg">ℹ️</span>
            <div>
              <p className="font-semibold">Información</p>
              <p className="mt-2 text-sm leading-6">
                La rúbrica publicada se asociará a esta evaluación.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default EvaluacionInfoCard;