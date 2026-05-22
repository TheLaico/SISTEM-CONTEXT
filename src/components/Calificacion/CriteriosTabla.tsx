import { Criterion } from '../../models/Criterion';
import { CriterionSelection } from '../../types/rubrica';

interface CriteriosTablaProps {
  criteria: Criterion[];
  selections: Record<string, CriterionSelection>;
  onSelectScale: (criterionId: string, scaleId: string) => void;
  onCommentChange: (criterionId: string, comment: string) => void;
  totalScore: number;
  progressCount: { done: number; total: number };
  readOnly?: boolean;
}

const getScaleTone = (value?: number) => {
  if (value === undefined || value === null) {
    return 'bg-gray-100 text-meta-3 dark:bg-meta-4 dark:text-meta-2';
  }

  if (value >= 75) {
    return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300';
  }

  if (value >= 50) {
    return 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300';
  }

  return 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300';
};

const CriteriosTabla = ({
  criteria,
  selections,
  onSelectScale,
  onCommentChange,
  totalScore,
  progressCount,
  readOnly = false,
}: CriteriosTablaProps) => {
  const isComplete = progressCount.total > 0 && progressCount.done === progressCount.total;

  return (
    <section className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-black dark:text-white">Criterios de la rúbrica</h2>
          <p className="mt-1 text-sm text-meta-3 dark:text-meta-2">Selecciona el nivel de desempeño (escala) para cada criterio.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-meta-3 dark:text-meta-2">
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-primary" />
            Completo
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            Pendiente
          </span>
          <span className="rounded-full border border-stroke px-3 py-1 dark:border-strokedark">
            {progressCount.done} de {progressCount.total}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0 text-left text-sm text-black dark:text-white">
          <thead>
            <tr className="border-b border-stroke text-meta-3 dark:border-strokedark dark:text-meta-2">
              <th className="px-3 py-3">#</th>
              <th className="px-3 py-3">Criterio (peso)</th>
              <th className="px-3 py-3">Nivel de desempeño</th>
              <th className="px-3 py-3">Puntaje</th>
              <th className="px-3 py-3">Comentario</th>
              <th className="px-3 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {criteria.map((criterion, index) => {
              const criterionId = criterion.id || '';
              const selection = selections[criterionId];
              const selectedScaleId = selection?.scale_id || '';
              const selectedScale = criterion.scales?.find((scale) => scale.id === selectedScaleId);
              const scoreValue = selectedScale && criterion.weight !== undefined && criterion.weight !== null
                ? ((selectedScale.value || 0) * criterion.weight) / 100
                : null;

              return (
                <tr
                  key={criterionId || index}
                  className="border-b border-stroke transition hover:bg-gray-50 dark:border-strokedark dark:hover:bg-meta-4"
                >
                  <td className="px-3 py-4 align-top font-medium text-meta-3 dark:text-meta-2">{index + 1}</td>

                  <td className="px-3 py-4 align-top">
                    <div className="space-y-1">
                      <p className="font-semibold text-black dark:text-white">{criterion.name || 'Sin nombre'}</p>
                      <p className="text-xs text-meta-3 dark:text-meta-2">
                        Peso: {criterion.weight ?? 0}% · {criterion.description || 'Sin descripción'}
                      </p>
                    </div>
                  </td>

                  <td className="px-3 py-4 align-top">
                    <select
                      value={selectedScaleId}
                      onChange={(event) => onSelectScale(criterionId, event.target.value)}
                      disabled={readOnly}
                      className="w-full rounded border border-stroke bg-gray py-2 px-3 text-sm text-black transition focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    >
                      <option value="">Seleccionar nivel...</option>
                      {(criterion.scales || []).map((scale) => (
                        <option key={scale.id} value={scale.id} className={getScaleTone(scale.value)}>
                          {scale.name} ({scale.value})
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-3 py-4 align-top">
                    {selectedScale ? (
                      <div>
                        <p className="font-semibold text-black dark:text-white">{scoreValue?.toFixed(2)}</p>
                        <p className="mt-1 text-xs text-meta-3 dark:text-meta-2">
                          {selectedScale.value || 0}% × {criterion.weight || 0}%
                        </p>
                      </div>
                    ) : (
                      <span className="text-meta-3 dark:text-meta-2">—</span>
                    )}
                  </td>

                  <td className="px-3 py-4 align-top">
                    <textarea
                      rows={3}
                      value={selection?.comment || ''}
                      onChange={(event) => onCommentChange(criterionId, event.target.value)}
                      disabled={readOnly}
                      placeholder="Comentario opcional..."
                      className="w-full rounded border border-stroke bg-gray px-3 py-2 text-sm text-black transition focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                  </td>

                  <td className="px-3 py-4 align-top">
                    {selectedScaleId ? (
                      <span className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <span className="text-base font-bold">✓</span>
                        Completo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-red-600 dark:text-red-400">
                        <span className="text-base font-bold">●</span>
                        Pendiente
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 rounded-md border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900 dark:border-sky-500/30 dark:bg-sky-950/20 dark:text-sky-100">
        El puntaje de cada criterio se calcula como: valor de escala × peso del criterio.
      </div>

      <div className="mt-4 flex justify-end">
        <div className="rounded-md border border-primary/20 bg-primary/5 px-4 py-3 text-right dark:bg-primary/10">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-primary">Total</p>
          <p className="mt-1 text-lg font-semibold text-black dark:text-white">
            {totalScore.toFixed(2)} / 100
          </p>
          <p className="text-xs text-meta-3 dark:text-meta-2">
            {isComplete ? 'Todos los criterios han sido calificados.' : 'Aún hay criterios pendientes.'}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CriteriosTabla;