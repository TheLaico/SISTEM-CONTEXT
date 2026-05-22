import { Evaluation } from '../../models/Evaluation';
import { Rubric } from '../../models/Rubric';
import { Subject } from '../../models/Subject';

interface ResumenAsociacionProps {
  evaluation?: Evaluation;
  rubric?: Rubric;
  subject?: Subject;
}

const ResumenAsociacion = ({ evaluation, rubric, subject }: ResumenAsociacionProps) => {
  return (
    <aside className="space-y-4">
      <section className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h2 className="text-lg font-semibold text-black dark:text-white">Resumen de la asociación</h2>

        <div className="mt-5 space-y-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-meta-3 dark:text-meta-2">Evaluación</p>
            <p className="mt-1 text-sm font-semibold text-black dark:text-white">{evaluation?.name || 'No seleccionada'}</p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-meta-3 dark:text-meta-2">Rúbrica</p>
            <p className="mt-1 text-sm font-semibold text-black dark:text-white">{rubric?.title || 'No seleccionada'}</p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-meta-3 dark:text-meta-2">Asignatura</p>
            <p className="mt-1 text-sm font-semibold text-black dark:text-white">{subject?.name || 'No seleccionada'}</p>
          </div>
        </div>

        <div className="my-5 h-px bg-stroke dark:bg-strokedark" />

        <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-700/40 dark:bg-amber-950/30 dark:text-amber-200">
          <p className="font-semibold">Importante</p>
          <ul className="mt-3 space-y-2">
            <li>• evaluacion.rubrica_id</li>
            <li>• evaluacion.asignatura_id</li>
            <li>• evaluacion.updated_at</li>
          </ul>
        </div>
      </section>

      <section className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h3 className="text-lg font-semibold text-black dark:text-white">Reglas</h3>

        <ul className="mt-4 space-y-3 text-sm text-black dark:text-white">
          <li className="flex items-start gap-2">
            <span className="text-emerald-500">✓</span>
            <span>Solo rúbricas publicadas</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500">✓</span>
            <span>La evaluación debe pertenecer a una asignatura del docente</span>
          </li>
        </ul>
      </section>
    </aside>
  );
};

export default ResumenAsociacion;