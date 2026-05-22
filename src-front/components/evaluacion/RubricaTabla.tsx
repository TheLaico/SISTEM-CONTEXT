import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rubric } from '../../models/Rubric';

interface RubricaTablaProps {
  rubrics: Rubric[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const formatDate = (value?: string) => {
  if (!value) {
    return 'Sin fecha';
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsedDate);
};

const RubricaTabla = ({ rubrics, selectedId, onSelect }: RubricaTablaProps) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filteredRubrics = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return rubrics;
    }

    return rubrics.filter((rubric) => (rubric.title || '').toLowerCase().includes(term));
  }, [rubrics, search]);

  if (!rubrics.length) {
    return (
      <section className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="rounded-md border border-red-200 bg-red-50 p-5 text-red-800 dark:border-red-500/30 dark:bg-red-950/30 dark:text-red-100">
          <h3 className="text-lg font-semibold">No hay rúbricas publicadas</h3>
          <p className="mt-2 text-sm">No existen rúbricas publicadas para asociar en este momento.</p>
          <button
            type="button"
            onClick={() => navigate('/rubricas/create')}
            className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
          >
            Ir a Mis rúbricas
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-black dark:text-white">Rúbricas publicadas</h2>
          <p className="mt-1 text-sm text-meta-3 dark:text-meta-2">Selecciona una rúbrica publicada para continuar.</p>
        </div>

        <div className="w-full md:max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nombre"
            className="w-full rounded border border-stroke bg-gray px-3 py-2 text-sm text-black transition focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0 text-left text-sm text-black dark:text-white">
          <thead>
            <tr className="border-b border-stroke text-meta-3 dark:border-strokedark dark:text-meta-2">
              <th className="px-3 py-3"> </th>
              <th className="px-3 py-3">Rúbrica</th>
              <th className="px-3 py-3">Criterios</th>
              <th className="px-3 py-3">Fecha de publicación</th>
              <th className="px-3 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredRubrics.map((rubric) => {
              const isSelected = selectedId === rubric.id;
              const criteriaCount = rubric.criteria?.length || 0;

              return (
                <tr
                  key={rubric.id}
                  className={`cursor-pointer border-b border-stroke transition dark:border-strokedark ${
                    isSelected ? 'border-primary/40 bg-primary/5 dark:bg-primary/10' : 'hover:bg-gray-50 dark:hover:bg-meta-4'
                  }`}
                  onClick={() => rubric.id && onSelect(rubric.id)}
                >
                  <td className="px-3 py-4 align-top">
                    <input
                      type="radio"
                      checked={isSelected}
                      onChange={() => rubric.id && onSelect(rubric.id)}
                      className="h-4 w-4 accent-primary"
                      aria-label={`Seleccionar rúbrica ${rubric.title || ''}`}
                    />
                  </td>

                  <td className="px-3 py-4 align-top">
                    <div className="space-y-1">
                      <p className="font-semibold text-black dark:text-white">{rubric.title || 'Sin nombre'}</p>
                      <p className="max-w-xl text-xs leading-5 text-meta-3 dark:text-meta-2">
                        {rubric.description || 'Sin descripción'}
                      </p>
                      <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                        Publicada
                      </span>
                    </div>
                  </td>

                  <td className="px-3 py-4 align-top font-medium">{criteriaCount}</td>

                  <td className="px-3 py-4 align-top text-meta-3 dark:text-meta-2">
                    {formatDate(rubric.created_at)}
                  </td>

                  <td className="px-3 py-4 align-top">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        console.log('Vista previa', rubric);
                      }}
                      className="rounded-md border border-primary bg-white px-3 py-2 text-xs font-medium text-primary transition hover:bg-primary/10"
                    >
                      Vista previa
                    </button>
                  </td>
                </tr>
              );
            })}

            {!filteredRubrics.length && (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-sm text-meta-3 dark:text-meta-2">
                  No se encontraron rúbricas con ese criterio de búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default RubricaTabla;