import { AlertTriangle, BookOpen, CalendarDays, ChevronLeft, Hash, User, Users } from 'lucide-react'
import { GroupDetailInfo } from '../../business/GroupBusiness'

interface GroupDetailHeaderProps {
  detail: GroupDetailInfo
  teacherName: string
  onBack: () => void
}

const STATUS_STYLES: Record<string, string> = {
  green:  'bg-green-100 text-green-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  red:    'bg-red-100 text-red-700',
}

interface InfoCellProps {
  icon: React.ReactNode
  label: string
  value: string
}

function InfoCell({ icon, label, value }: InfoCellProps) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-gray-400 shrink-0">{icon}</span>
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">{label}</p>
        <p className="text-sm font-semibold text-gray-700 mt-0.5">{value}</p>
      </div>
    </div>
  )
}

export default function GroupDetailHeader({ detail, teacherName, onBack }: GroupDetailHeaderProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Fila superior */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Volver
        </button>

        <h1 className="text-2xl font-bold text-gray-800 flex-1 min-w-0 truncate">
          {detail.name}
        </h1>

        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[detail.statusColor]}`}>
          {detail.statusLabel}
        </span>
      </div>

      {/* Grid de info */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        <InfoCell icon={<BookOpen className="w-4 h-4" />}    label="Asignatura"  value={detail.subjectName} />
        <InfoCell icon={<CalendarDays className="w-4 h-4" />} label="Semestre"    value={detail.semesterName} />
        <InfoCell icon={<Users className="w-4 h-4" />}        label="Estudiantes" value={detail.occupancyLabel} />
        <InfoCell icon={<User className="w-4 h-4" />}         label="Docente"     value={teacherName} />
        <InfoCell icon={<Hash className="w-4 h-4" />}         label="Código"      value={detail.groupCode} />
      </div>

      {/* Banner solo lectura */}
      {!detail.isEditable && (
        <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4 text-yellow-700 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          Este grupo pertenece a un semestre cerrado. Solo lectura.
        </div>
      )}
    </div>
  )
}
