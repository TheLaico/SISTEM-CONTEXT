import { useState } from 'react';
import { RubricCriterio, Scale } from '../../types/rubrica';

interface RubricaCriteriosTableProps {
  criterios: RubricCriterio[];
  onUpdate: (id: string, field: keyof RubricCriterio, value: RubricCriterio[keyof RubricCriterio]) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onMove: (fromIndex: number, toIndex: number) => void;
}

const NIVELES_SUGERIDOS = [
  { name: 'Insuficiente', value: 1, description: '' },
  { name: 'Básico',       value: 2, description: '' },
  { name: 'Satisfactorio',value: 3, description: '' },
  { name: 'Excelente',    value: 4, description: '' },
];

const emptyScale = (): Scale => ({
  id: Date.now().toString() + Math.random(),
  name: '',
  description: '',
  value: 0,
});

/* ── Modal de escalas ── */
interface ScalesModalProps {
  criterio: RubricCriterio;
  allCriterios: RubricCriterio[];
  onSave: (scales: Scale[]) => void;
  onClose: () => void;
}

const ScalesModal = ({ criterio, allCriterios, onSave, onClose }: ScalesModalProps) => {
  const [scales, setScales] = useState<Scale[]>(
    criterio.scales && criterio.scales.length > 0
      ? criterio.scales.map((s) => ({ ...s }))
      : [emptyScale(), emptyScale()],
  );
  const [modalError, setModalError] = useState<string | null>(null);

  /* ── Escalas de otros criterios disponibles para reutilizar ── */
  const otherScales: Scale[] = allCriterios
    .filter((c) => c.id !== criterio.id && c.scales && c.scales.length > 0)
    .flatMap((c) => c.scales!);

  const update = (idx: number, field: keyof Scale, val: string | number) => {
    setScales((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: val } : s)));
    setModalError(null);
  };

  const addScale = () => {
    if (scales.length >= 5) {
      setModalError('Máximo 5 niveles por criterio.');
      return;
    }
    setScales((prev) => [...prev, emptyScale()]);
  };

  const removeScale = (idx: number) => {
    if (scales.length <= 2) {
      setModalError('Mínimo 2 niveles por criterio.');
      return;
    }
    setScales((prev) => prev.filter((_, i) => i !== idx));
    setModalError(null);
  };

  const applyTemplate = () => {
    setScales(NIVELES_SUGERIDOS.map((n) => ({ ...n, id: Date.now().toString() + Math.random() })));
    setModalError(null);
  };

  const reuseScale = (s: Scale) => {
    if (scales.length >= 5) { setModalError('Máximo 5 niveles.'); return; }
    setScales((prev) => [
      ...prev,
      { id: Date.now().toString() + Math.random(), name: s.name, description: s.description, value: s.value },
    ]);
    setModalError(null);
  };

  const handleSave = () => {
    if (scales.length < 2) { setModalError('Debes definir al menos 2 niveles.'); return; }
    if (scales.length > 5) { setModalError('Máximo 5 niveles.'); return; }

    for (const s of scales) {
      if (!s.name?.trim()) { setModalError('Todos los niveles deben tener etiqueta.'); return; }
    }

    const values = scales.map((s) => Number(s.value));
    if (new Set(values).size !== values.length) {
      setModalError('Los valores numéricos deben ser únicos dentro del criterio.');
      return;
    }

    onSave(scales);
  };

  return (
    /* Overlay */
    <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-strokedark">
          <div>
            <h3 className="text-lg font-semibold text-black dark:text-white">
              Escalas de calificación
            </h3>
            <p className="mt-0.5 text-xs text-meta-3 dark:text-meta-2">
              Criterio: <span className="font-medium text-black dark:text-white">{criterio.name || 'Sin nombre'}</span>
              &nbsp;·&nbsp; Entre 2 y 5 niveles
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-meta-3 transition hover:bg-gray dark:hover:bg-meta-4"
          >
            ✕
          </button>
        </div>

        {/* Acciones rápidas */}
        <div className="flex flex-wrap items-center gap-2 border-b border-stroke px-6 py-3 dark:border-strokedark">
          <span className="text-xs font-medium text-meta-3 dark:text-meta-2">Acciones rápidas:</span>
          <button
            type="button"
            onClick={applyTemplate}
            className="rounded border border-stroke bg-gray px-3 py-1 text-xs font-medium text-black transition hover:bg-gray/80 dark:border-strokedark dark:bg-meta-4 dark:text-white"
          >
            Usar plantilla (Insuficiente → Excelente)
          </button>

          {/* Reutilizar de otros criterios */}
          {otherScales.length > 0 && (
            <div className="relative group">
              <button
                type="button"
                className="rounded border border-primary bg-white px-3 py-1 text-xs font-medium text-primary transition hover:bg-primary/10"
              >
                Reutilizar nivel ▾
              </button>
              <div className="absolute left-0 top-full z-10 mt-1 hidden w-56 rounded border border-stroke bg-white shadow-md group-hover:block dark:border-strokedark dark:bg-boxdark">
                {otherScales.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => reuseScale(s)}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-xs hover:bg-gray dark:hover:bg-meta-4"
                  >
                    <span className="font-medium text-black dark:text-white">{s.name}</span>
                    <span className="text-meta-3">{s.value}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Lista de escalas */}
        <div className="max-h-80 overflow-y-auto px-6 py-4">
          {/* Cabecera de columnas */}
          <div className="mb-2 grid grid-cols-12 gap-2 text-xs font-semibold uppercase tracking-wide text-meta-3 dark:text-meta-2">
            <span className="col-span-3">Etiqueta *</span>
            <span className="col-span-5">Descripción</span>
            <span className="col-span-2">Valor *</span>
            <span className="col-span-2 text-right">Acción</span>
          </div>

          <div className="space-y-2">
            {scales.map((s, idx) => (
              <div key={String(s.id) + idx} className="grid grid-cols-12 items-center gap-2">
                {/* Etiqueta */}
                <input
                  type="text"
                  value={s.name ?? ''}
                  onChange={(e) => update(idx, 'name', e.target.value)}
                  placeholder="Ej. Excelente"
                  className="col-span-3 rounded border border-stroke bg-gray px-2 py-1.5 text-sm text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                />
                {/* Descripción */}
                <input
                  type="text"
                  value={s.description ?? ''}
                  onChange={(e) => update(idx, 'description', e.target.value)}
                  placeholder="Descripción del nivel"
                  className="col-span-5 rounded border border-stroke bg-gray px-2 py-1.5 text-sm text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                />
                {/* Valor */}
                <input
                  type="number"
                  value={s.value ?? 0}
                  onChange={(e) => update(idx, 'value', Number(e.target.value))}
                  placeholder="0"
                  min={0}
                  max={100}
                  className="col-span-2 rounded border border-stroke bg-gray px-2 py-1.5 text-sm text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                />
                {/* Eliminar */}
                <div className="col-span-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeScale(idx)}
                    disabled={scales.length <= 2}
                    className="inline-flex h-8 w-8 items-center justify-center rounded border border-stroke text-sm transition hover:bg-red-50 hover:border-red-300 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-strokedark dark:hover:bg-red-900/20"
                    title="Eliminar nivel"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Agregar nivel */}
          {scales.length < 5 && (
            <button
              type="button"
              onClick={addScale}
              className="mt-3 flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              + Agregar nivel
            </button>
          )}
        </div>

        {/* Error */}
        {modalError && (
          <div className="mx-6 mb-2 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-500/40 dark:bg-red-950/30 dark:text-red-300">
            {modalError}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-stroke px-6 py-4 dark:border-strokedark">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-stroke bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray dark:border-strokedark dark:bg-boxdark dark:text-white"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
          >
            Guardar escalas
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Tabla principal ── */
const RubricaCriteriosTable = ({
  criterios,
  onUpdate,
  onDelete,
  onAdd,
  onMove,
}: RubricaCriteriosTableProps) => {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [scalesModalFor, setScalesModalFor] = useState<string | null>(null);

  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>) => e.preventDefault();
  const handleDrop = (index: number) => {
    if (dragIndex === null || dragIndex === index) return;
    onMove(dragIndex, index);
    setDragIndex(null);
  };

  const criterioParaModal = criterios.find((c) => c.id === scalesModalFor) ?? null;

  return (
    <section className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      {/* Cabecera */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-black dark:text-white">
            Criterios de evaluación
          </h2>
          <p className="mt-1 text-sm text-meta-3 dark:text-meta-2">
            La suma de los pesos debe ser 100 %. Pulsa ⚖️ para definir las escalas de cada criterio.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onAdd}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
          >
            + Agregar criterio
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0 text-sm text-left text-black dark:text-white">
          <thead>
            <tr className="border-b border-stroke dark:border-strokedark">
              <th className="px-3 py-3 font-medium text-meta-3 dark:text-meta-2">#</th>
              <th className="px-3 py-3 font-medium text-meta-3 dark:text-meta-2">Criterio</th>
              <th className="px-3 py-3 font-medium text-meta-3 dark:text-meta-2">Descripción</th>
              <th className="px-3 py-3 font-medium text-meta-3 dark:text-meta-2">Peso (%)</th>
              <th className="px-3 py-3 font-medium text-meta-3 dark:text-meta-2">Escalas</th>
              <th className="px-3 py-3 font-medium text-meta-3 dark:text-meta-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {criterios.map((criterio, index) => {
              const scaleCount = criterio.scales?.length ?? 0;
              const hasScales = scaleCount >= 2;

              return (
                <tr
                  key={criterio.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(index)}
                  className="border-b border-stroke transition hover:bg-gray-50 dark:border-strokedark dark:hover:bg-meta-4"
                >
                  {/* # drag */}
                  <td className="px-3 py-4 align-top">
                    <div className="flex items-center gap-2 text-meta-3 dark:text-meta-2">
                      <span className="cursor-grab text-xl">⠿</span>
                      <span>{index + 1}</span>
                    </div>
                  </td>

                  {/* Nombre */}
                  <td className="px-3 py-4 align-top">
                    <input
                      id={`criterio-nombre-${criterio.id}`}
                      type="text"
                      value={criterio.name}
                      onChange={(e) => onUpdate(criterio.id, 'name', e.target.value)}
                      className="w-full rounded-md border border-stroke bg-gray px-3 py-2 text-sm text-black transition focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                      placeholder="Nombre del criterio"
                    />
                  </td>

                  {/* Descripción */}
                  <td className="px-3 py-4 align-top">
                    <input
                      type="text"
                      value={criterio.description}
                      onChange={(e) => onUpdate(criterio.id, 'description', e.target.value)}
                      className="w-full rounded-md border border-stroke bg-gray px-3 py-2 text-sm text-black transition focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                      placeholder="Descripción breve"
                    />
                  </td>

                  {/* Peso */}
                  <td className="px-3 py-4 align-top">
                    <input
                      type="number"
                      value={criterio.weight}
                      min={0}
                      max={100}
                      step={0.1}
                      onChange={(e) => onUpdate(criterio.id, 'weight', e.target.valueAsNumber || 0)}
                      className="w-24 rounded-md border border-stroke bg-gray px-3 py-2 text-sm text-black transition focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                    />
                  </td>

                  {/* Estado escalas */}
                  <td className="px-3 py-4 align-top">
                    {hasScales ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                        ✓ {scaleCount} nivel{scaleCount !== 1 ? 'es' : ''}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                        ⚠ Sin escalas
                      </span>
                    )}
                  </td>

                  {/* Acciones */}
                  <td className="px-3 py-4 align-top">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setScalesModalFor(criterio.id)}
                        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-stroke bg-white px-2 text-xs font-medium text-black transition hover:bg-gray dark:border-strokedark dark:bg-boxdark dark:text-white dark:hover:bg-meta-4"
                        title="Definir escalas"
                      >
                        ⚖️ Escalas
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(criterio.id)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-stroke bg-white text-black transition hover:bg-red-50 hover:border-red-300 dark:border-strokedark dark:bg-boxdark dark:text-white dark:hover:bg-meta-4"
                        aria-label="Eliminar criterio"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {criterios.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-sm text-meta-3 dark:text-meta-2">
                  No hay criterios. Pulsa "+ Agregar criterio" para empezar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de escalas */}
      {scalesModalFor && criterioParaModal && (
        <ScalesModal
          criterio={criterioParaModal}
          allCriterios={criterios}
          onSave={(newScales) => {
            onUpdate(scalesModalFor, 'scales', newScales as any);
            setScalesModalFor(null);
          }}
          onClose={() => setScalesModalFor(null)}
        />
      )}
    </section>
  );
};

export default RubricaCriteriosTable;