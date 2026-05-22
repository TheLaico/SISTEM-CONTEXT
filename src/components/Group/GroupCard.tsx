import { BookOpen, CalendarDays, Users, ClipboardList, CheckCircle2, Lock, Star } from 'lucide-react'
import { GroupCardData, groupBusiness } from '../../business/GroupBusiness'
import MetricsBadge from './MetricsBadge'
interface GroupCardProps {
    card: GroupCardData
    onVerDetalle: (groupId: string) => void
}

const GROUP_STATUS_STYLES: Record<GroupCardData['groupStatus'], string> = {
    'Activo': 'bg-green-100 text-green-700',
    'Sin estudiantes': 'bg-yellow-100 text-yellow-700',
    'Cerrado': 'bg-red-100 text-red-700',
}

const SEMESTER_STATUS_STYLES: Record<GroupCardData['semesterStatus'], string> = {
    'Activo': 'bg-blue-100 text-blue-700',
    'Cerrado': 'bg-gray-100 text-gray-600',
}
const GRADE_STATUS_BG: Record<GroupCardData['gradeStatusColor'], string> = {
    green: 'bg-green-50 dark:bg-green-900/20',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20',
    red: 'bg-red-50 dark:bg-red-900/20',
    gray: 'bg-gray-100 dark:bg-gray-700/30',
}

const GRADE_STATUS_TEXT: Record<GroupCardData['gradeStatusColor'], string> = {
    green: 'text-green-600 dark:text-green-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    red: 'text-red-600 dark:text-red-400',
    gray: 'text-gray-500 dark:text-gray-400',
}

const GroupCard = ({ card, onVerDetalle }: GroupCardProps) => {
    return (
        <div
            title={groupBusiness.getGroupStatusSummary(card)}
            className="flex flex-col justify-between rounded-xl border border-stroke bg-white p-6 shadow-md dark:border-strokedark dark:bg-boxdark"
        >
            {/* Encabezado */}
            <div className="mb-4">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-semibold text-black dark:text-white leading-tight">
                        {card.name}
                    </h3>
                    <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${GROUP_STATUS_STYLES[card.groupStatus]}`}
                    >
                        {card.groupStatus}
                    </span>
                </div>
                <p className="mt-0.5 text-sm text-gray-500 dark:text-bodydark2">
                    {card.groupCode}
                </p>
            </div>

            {/* Detalles */}
            <ul className="mb-4 flex flex-col gap-2.5">
                <li className="flex items-center gap-2 text-sm text-bodydark1 dark:text-bodydark2">
                    <BookOpen size={15} className="shrink-0 text-bodydark2" />
                    <span className="truncate">{card.subjectName}</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-bodydark1 dark:text-bodydark2">
                    <CalendarDays size={15} className="shrink-0 text-bodydark2" />
                    <span className="truncate">{card.semesterName}</span>
                    <span
                        className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${SEMESTER_STATUS_STYLES[card.semesterStatus]}`}
                    >
                        {card.semesterStatus}
                    </span>
                </li>
                <li className="flex items-center gap-2 text-sm text-bodydark1 dark:text-bodydark2">
                    <Users size={15} className="shrink-0 text-bodydark2" />
                    <span>
                        {card.studentCount} estudiante{card.studentCount !== 1 ? 's' : ''}
                    </span>
                </li>
            </ul>

            {/* Indicadores de estado académico */}
            <div className="mb-5 flex flex-wrap gap-2">
                {/* Evaluaciones */}
                <span
                    className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${card.hasEvaluations
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                        }`}
                >
                    <ClipboardList size={12} />
                    {card.hasEvaluations ? 'Con evaluaciones' : 'Sin evaluaciones'}
                </span>

                {/* Notas */}
                <span
                    className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${card.hasLockedGrades
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                        }`}
                >
                    <CheckCircle2 size={12} />
                    {card.hasLockedGrades ? 'Notas consolidadas' : 'Notas pendientes'}
                </span>

                {/* Candado — solo visible si hay notas bloqueadas */}
                {card.hasLockedGrades && (
                    <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                        <Lock size={12} />
                        Bloqueado
                    </span>
                )}
            </div>
            {/* Métricas rápidas */}
            <div className="mt-3 border-t border-gray-100 pt-3 dark:border-strokedark">
                <div className="grid grid-cols-2 gap-2">
                    <MetricsBadge icon={Users} label="Estudiantes" value={card.studentCount} color="blue" />
                    <MetricsBadge icon={ClipboardList} label="Evaluaciones" value={card.evaluationCount} color="blue" />
                    <MetricsBadge icon={Star} label="Rúbricas pub." value={card.publishedRubricCount} color="blue" />
                    <div className={`flex flex-col items-center rounded-lg p-2 ${GRADE_STATUS_BG[card.gradeStatusColor]}`}>
                        <span className={`text-sm font-semibold ${GRADE_STATUS_TEXT[card.gradeStatusColor]}`}>
                            {card.gradeStatusLabel}
                        </span>
                        <span className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">Calificaciones</span>
                    </div>
                </div>
            </div>
            {/* Acción */}
            <button
                onClick={() => onVerDetalle(String(card.id))}
                className="w-full rounded-lg bg-primary py-2 text-sm font-medium text-white transition hover:bg-opacity-90"
            >
                Ver detalle
            </button>
        </div>
    )
}

export default GroupCard