import { Enrollment } from '../../models/Enrollment';

interface EstudianteInfoCardProps {
  enrollment: Enrollment;
  currentIndex: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

const EstudianteInfoCard = ({ enrollment, currentIndex, total, onPrev, onNext }: EstudianteInfoCardProps) => {
  const student = enrollment.student;
  const fullName = `${student?.first_name || ''} ${student?.last_name || ''}`.trim() || 'No disponible';

  return (
    <section className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-black dark:text-white">Estudiante activo</h2>
              <p className="mt-1 text-sm text-meta-3 dark:text-meta-2">
                Estudiante {currentIndex + 1} de {total}
              </p>
            </div>

            <span className="inline-flex w-fit items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
              Activa
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-md border border-stroke bg-gray-50 p-4 dark:border-strokedark dark:bg-meta-4/40">
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-meta-3 dark:text-meta-2">Nombre completo</p>
              <p className="mt-2 text-sm font-semibold text-black dark:text-white">{fullName}</p>
            </div>

            <div className="rounded-md border border-stroke bg-gray-50 p-4 dark:border-strokedark dark:bg-meta-4/40">
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-meta-3 dark:text-meta-2">Identificación</p>
              <p className="mt-2 text-sm font-semibold text-black dark:text-white">{student?.identification || 'No disponible'}</p>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 gap-3 lg:flex-col xl:flex-row">
          <button
            type="button"
            onClick={onPrev}
            disabled={currentIndex === 0}
            className="inline-flex items-center justify-center rounded-md border border-stroke bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray disabled:cursor-not-allowed disabled:opacity-60 dark:border-strokedark dark:bg-boxdark dark:text-white dark:hover:bg-meta-4"
          >
            ← Anterior
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={currentIndex >= total - 1}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Siguiente →
          </button>
        </div>
      </div>
    </section>
  );
};

export default EstudianteInfoCard;