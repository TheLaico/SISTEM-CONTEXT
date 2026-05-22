// src/components/Grupos/EstadoAcademicoPanel.tsx
import { Activity, CheckCircle2, ClipboardX, StarOff, UserX } from 'lucide-react'
import { AcademicProcessStatus } from '../../business/GroupBusiness'

interface EstadoAcademicoPanelProps {
  status: AcademicProcessStatus
}

const STATUS_BADGE: Record<string, string> = {
  green:  'bg-green-100 text-green-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  red:    'bg-red-100 text-red-700',
}

const PROGRESS_COLOR: Record<string, string> = {
  complete: 'bg-green-500',
  partial:  'bg-yellow-400',
  empty:    'bg-red-400',
}

interface MetricProps { icon: React.ReactNode; label: string; value: string | number; warn?: boolean }

function Metric({ icon, label, value, warn }: MetricProps) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
      <span className={`mt-0.5 shrink-0 ${warn ? 'text-red-400' : 'text-gray-400'}`}>{icon}</span>
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">{label}</p>
        <p className={`text-lg font-bold mt-0.5 ${warn ? 'text-red-500' : 'text-gray-800'}`}>{value}</p>
      </div>
    </div>
  )
}

export default function EstadoAcademicoPanel({ status }: EstadoAcademicoPanelProps) {
  const pct          = Math.min(100, Math.max(0, status.completionPercentage))
  const progressKey  = pct >= 100 ? 'complete' : pct > 0 ? 'partial' : 'empty'

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-500" />
          <h2 className="text-base font-semibold text-gray-800">Estado del proceso académico</h2>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${STATUS_BADGE[status.statusColor]}`}>
          {status.statusLabel}
        </span>
      </div>

      {/* Barra de progreso */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Progreso de calificación</span>
          <span className="font-semibold">{pct}% completado</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${PROGRESS_COLOR[progressKey]}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Grid de métricas */}
      <div className="grid grid-cols-2 gap-3">
        <Metric
          icon={<ClipboardX className="w-4 h-4" />}
          label="Evaluaciones pendientes"
          value={status.pendingEvaluations}
          warn={status.pendingEvaluations > 0}
        />
        <Metric
          icon={<UserX className="w-4 h-4" />}
          label="Sin calificar"
          value={status.studentsWithoutGrade}
          warn={status.studentsWithoutGrade > 0}
        />
        <Metric
          icon={<StarOff className="w-4 h-4" />}
          label="Rúbricas sin publicar"
          value={status.unpublishedRubrics}
          warn={status.unpublishedRubrics > 0}
        />
        <Metric
          icon={<CheckCircle2 className="w-4 h-4" />}
          label="Notas consolidadas"
          value={status.finalGradesRegistered ? 'Sí' : 'No'}
          warn={!status.finalGradesRegistered}
        />
      </div>
    </div>
  )
}