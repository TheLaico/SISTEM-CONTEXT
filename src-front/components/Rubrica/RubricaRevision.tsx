import { RubricCriterio, RubricFormState, Subject } from '../../types/rubrica';

interface RubricaRevisionProps {
  info: RubricFormState;
  criterios: RubricCriterio[];
  totalPeso: number;
  selectedSubject?: Subject;
  publishMode?: boolean;
}

const RubricaRevision = ({
  info,
  criterios,
  totalPeso,
  selectedSubject,
  publishMode = false,
}: RubricaRevisionProps) => {
  const isTotalOk = totalPeso === 100;

  return (
    <div className="space-y-6">
      {/* Banner de estado */}
      {publishMode && (
        <div
          className={`rounded-md border p-4 text-sm font-medium ${
            isTotalOk
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-700/40 dark:bg-emerald-950/30 dark:text-emerald-200'
              : 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-700/40 dark:bg-amber-950/30 dark:text-amber-200'
          }`}
        >
          {isTotalOk
            ? '✅ La rúbrica está lista para publicar o guardar como borrador.'
            : '⚠️ La suma de pesos no es 100%. Puedes guardar como borrador pero no publicar.'}
        </div>
      )}

      {/* Información general */}
      <section className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">
          Información general
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-meta-3 dark:text-meta-2">
              Asignatura
            </p>
            <p className="mt-1 text-sm text-black dark:text-white">
              {selectedSubject
                ? `${selectedSubject.name} (${selectedSubject.code})`
                : <span className="text-red-500">Sin asignatura</span>}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-meta-3 dark:text-meta-2">
              Título
            </p>
            <p className="mt-1 text-sm text-black dark:text-white">
              {info.title || <span className="italic text-meta-3">Sin título</span>}
            </p>
          </div>
          {info.description && (
            <div className="sm:col-span-2">
              <p className="text-xs font-medium uppercase tracking-wide text-meta-3 dark:text-meta-2">
                Descripción
              </p>
              <p className="mt-1 text-sm text-black dark:text-white">{info.description}</p>
            </div>
          )}
        </div>
      </section>

      {/* Criterios */}
      <section className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-black dark:text-white">
            Criterios de evaluación
          </h2>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              isTotalOk
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
            }`}
          >
            Total: {totalPeso}%
          </span>
        </div>

        {criterios.length === 0 ? (
          <p className="text-sm text-meta-3 dark:text-meta-2">No hay criterios definidos.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-black dark:text-white">
              <thead>
                <tr className="border-b border-stroke dark:border-strokedark">
                  <th className="px-3 py-2 font-medium text-meta-3 dark:text-meta-2">#</th>
                  <th className="px-3 py-2 font-medium text-meta-3 dark:text-meta-2">Criterio</th>
                  <th className="px-3 py-2 font-medium text-meta-3 dark:text-meta-2">Descripción</th>
                  <th className="px-3 py-2 text-right font-medium text-meta-3 dark:text-meta-2">Peso</th>
                  <th className="px-3 py-2 font-medium text-meta-3 dark:text-meta-2">Escalas</th>
                </tr>
              </thead>
              <tbody>
                {criterios.map((c, i) => (
                  <tr
                    key={c.id}
                    className="border-b border-stroke last:border-0 dark:border-strokedark"
                  >
                    <td className="px-3 py-3 text-meta-3 dark:text-meta-2">{i + 1}</td>
                    <td className="px-3 py-3 font-medium">{c.name || <span className="italic text-meta-3">Sin nombre</span>}</td>
                    <td className="px-3 py-3 text-meta-3 dark:text-meta-2">{c.description || '—'}</td>
                    <td className="px-3 py-3 text-right font-semibold">{c.weight}%</td>
                    <td className="px-3 py-3">
                      {c.scales && c.scales.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {c.scales.map((s, si) => (
                            <span
                              key={si}
                              className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary dark:bg-primary/20"
                            >
                              {s.name || s.value}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-meta-3 dark:text-meta-2">Sin escalas</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default RubricaRevision;