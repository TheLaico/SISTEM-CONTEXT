import { useMemo } from 'react';
import { Evaluation } from '../../models/Evaluation';
import { Rubric } from '../../models/Rubric';

interface EvaluacionInfoCardProps {
  evaluation: Evaluation;
  rubric: Rubric;
}

const EvaluacionInfoCard = ({ evaluation, rubric }: EvaluacionInfoCardProps) => {
  const formattedDate = useMemo(() => {
    const dateValue = evaluation.updated_at || evaluation.created_at;

    if (!dateValue) {
      return 'No disponible';
    }

    const parsedDate = new Date(dateValue);

    if (Number.isNaN(parsedDate.getTime())) {
      return 'No disponible';
    }

    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(parsedDate);
  }, [evaluation.created_at, evaluation.updated_at]);

  const infoItems = [
    { label: 'Evaluación', value: evaluation.name || 'No disponible' },
    { label: 'Código', value: evaluation.group_id || 'No disponible' },
    { label: 'Asignatura', value: evaluation.subject?.name || 'No disponible' },
    { label: 'Grupo', value: evaluation.group?.name || 'No disponible' },
    { label: 'Fecha límite', value: formattedDate },
    { label: 'Ponderación', value: evaluation.weight !== undefined && evaluation.weight !== null ? `${evaluation.weight}%` : 'No disponible' },
  ];

  return (
    <section className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <span className="text-xl font-semibold">★</span>
        </div>

        <div className="flex-1">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-black dark:text-white">Información de la evaluación</h2>
              <p className="mt-1 text-sm text-meta-3 dark:text-meta-2">Revisa la evaluación seleccionada antes de calificar.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {infoItems.map((item) => (
              <div key={item.label} className="rounded-md border border-stroke bg-gray-50 p-4 dark:border-strokedark dark:bg-meta-4/40">
                <p className="text-xs font-medium uppercase tracking-[0.08em] text-meta-3 dark:text-meta-2">{item.label}</p>
                <p className="mt-2 text-sm font-semibold text-black dark:text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-4 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-950/20 dark:text-emerald-100 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
            Publicada
          </span>
          <p className="text-sm font-medium">
            Rúbrica asociada · {rubric.title || 'Sin título'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => console.log('Ver rúbrica', rubric)}
          className="rounded-md border border-emerald-300 bg-white px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-boxdark dark:text-emerald-300 dark:hover:bg-emerald-950/30"
        >
          Ver rúbrica
        </button>
      </div>
    </section>
  );
};

export default EvaluacionInfoCard;