import { RubricFormState, Subject } from '../../types/rubrica';

interface RubricaInfoSectionProps {
  info: RubricFormState;
  onChange: <K extends keyof RubricFormState>(field: K, value: RubricFormState[K]) => void;
  subjects: Subject[];
  subjectsLoading: boolean;
}

const RubricaInfoSection = ({ info, onChange, subjects, subjectsLoading }: RubricaInfoSectionProps) => {
  const descripcionLength = info.description.length;

  return (
    <section className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <h2 className="text-lg font-semibold text-black dark:text-white">
        Información de la rúbrica
      </h2>

      <div className="mt-6 grid grid-cols-2 gap-6">
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-body dark:text-white" htmlFor="subject_id">
              Asignatura
            </label>
            <select
              id="subject_id"
              value={info.subject_id}
              onChange={(event) => onChange('subject_id', event.target.value)}
              className="w-full rounded border border-stroke bg-gray py-3 px-3 text-sm text-black transition focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
            >
              <option value="">Selecciona una asignatura</option>
              {subjectsLoading ? (
                <option value="" disabled>
                  Cargando asignaturas...
                </option>
              ) : (
                subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name} ({subject.code})
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-body dark:text-white" htmlFor="titulo">
              Título
            </label>
            <input
              id="titulo"
              type="text"
              value={info.title}
              onChange={(event) => onChange('title', event.target.value)}
              className="w-full rounded border border-stroke bg-gray py-3 px-3 text-sm text-black transition focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
              placeholder="Título de la rúbrica"
            />
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-body dark:text-white" htmlFor="descripcion">
              Descripción
            </label>
            <textarea
              id="descripcion"
              value={info.description}
              onChange={(event) => onChange('description', event.target.value)}
              maxLength={500}
              rows={5}
              className="w-full rounded border border-stroke bg-gray py-3 px-3 text-sm text-black transition focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
              placeholder="Describe la rúbrica"
            />
            <div className="mt-2 text-right text-xs font-medium text-meta-3 dark:text-meta-2">
              {descripcionLength} / 500 caracteres
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RubricaInfoSection;
