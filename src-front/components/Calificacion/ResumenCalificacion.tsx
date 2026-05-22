import { useNavigate } from 'react-router-dom';
import { Evaluation } from '../../models/Evaluation';
import { Rubric } from '../../models/Rubric';
import { Student } from '../../models/Student';
import { CriterionSelection } from '../../types/rubrica';

interface ResumenCalificacionProps {
  rubric: Rubric;
  evaluation: Evaluation;
  student: Student | undefined;
  selections: Record<string, CriterionSelection>;
  totalScore: number;
  status: 'DRAFT' | 'SENT' | null;
}

const ResumenCalificacion = ({
  rubric,
  evaluation,
  student,
  selections,
  totalScore,
  status,
}: ResumenCalificacionProps) => {
  const navigate = useNavigate();

  const criteria = rubric.criteria || [];

  return (
    <aside className="space-y-4">
      <section className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h2 className="text-lg font-semibold text-black dark:text-white">Resumen de la calificación</h2>

        <div className="mt-5 space-y-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-meta-3 dark:text-meta-2">Rúbrica</p>
            <p className="mt-1 text-sm font-semibold text-black dark:text-white">{rubric.title || 'No disponible'}</p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-meta-3 dark:text-meta-2">Evaluación</p>
            <p className="mt-1 text-sm font-semibold text-black dark:text-white">{evaluation.name || 'No disponible'}</p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-meta-3 dark:text-meta-2">Estudiante</p>
            <p className="mt-1 text-sm font-semibold text-black dark:text-white">
              {student ? `${student.first_name || ''} ${student.last_name || ''}`.trim() || 'No disponible' : 'No disponible'}
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-md border border-primary/20 bg-primary/5 p-5 text-center dark:bg-primary/10">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-primary">Nota actual</p>
          <p className="mt-2 text-3xl font-bold text-black dark:text-white">{totalScore.toFixed(2)} / 100</p>
          <p className="mt-2 text-sm text-meta-3 dark:text-meta-2">
            {status === 'SENT' ? 'Enviada' : 'Borrador'}
          </p>
        </div>

        <div className="mt-6 space-y-3">
          {criteria.map((criterion) => {
            const selection = selections[criterion.id || ''];
            const selectedScale = criterion.scales?.find((scale) => scale.id === selection?.scale_id);
            const partialScore = selectedScale && criterion.weight !== undefined && criterion.weight !== null
              ? ((selectedScale.value || 0) * criterion.weight) / 100
              : 0;

            return (
              <div key={criterion.id} className="rounded-md border border-stroke bg-gray-50 p-4 dark:border-strokedark dark:bg-meta-4/40">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-black dark:text-white">{criterion.name || 'Sin nombre'}</p>
                  <span className="text-xs font-medium text-meta-3 dark:text-meta-2">{criterion.weight || 0}%</span>
                </div>
                <p className="mt-2 text-sm text-meta-3 dark:text-meta-2">
                  → {partialScore.toFixed(2)}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 border-t border-stroke pt-4 dark:border-strokedark">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-meta-3 dark:text-meta-2">Total final</span>
            <span className="text-sm font-semibold text-black dark:text-white">{totalScore.toFixed(2)} / 100</span>
          </div>
        </div>
      </section>

      <section className="rounded-sm border border-amber-200 bg-amber-50 p-6 shadow-default dark:border-amber-700/40 dark:bg-amber-950/20 dark:text-amber-100">
        <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
          Las notas pueden revisarse desde el módulo de calificaciones.
        </p>

        <button
          type="button"
          onClick={() => navigate('/calificaciones')}
          className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
        >
          Ir a calificaciones
        </button>
      </section>
    </aside>
  );
};

export default ResumenCalificacion;