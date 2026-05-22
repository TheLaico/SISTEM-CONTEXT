// src/components/Grupos/AcademicInfoCard.tsx
import { BookCopy, BookMarked, Building2, GraduationCap, Hash, Star } from 'lucide-react'
import { GroupAcademicInfo } from '../../business/GroupBusiness'

interface AcademicInfoCardProps {
  info: GroupAcademicInfo
  isLoading?: boolean
}

const FALLBACKS = ['Carrera no encontrada', 'Plan no asociado', 'No especificado']
function isFallback(v: string) { return FALLBACKS.some(f => v.toLowerCase().includes(f.toLowerCase())) }

function SkeletonCell() {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
      <div className="animate-pulse w-4 h-4 bg-gray-200 rounded mt-0.5 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="animate-pulse h-3 w-16 bg-gray-200 rounded" />
        <div className="animate-pulse h-4 w-28 bg-gray-200 rounded" />
      </div>
    </div>
  )
}

interface CellProps { icon: React.ReactNode; label: string; value: string; sub?: string | null }

function Cell({ icon, label, value, sub }: CellProps) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
      <span className="text-indigo-500 shrink-0 mt-0.5">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">{label}</p>
        <p className={`text-sm font-semibold mt-0.5 truncate ${isFallback(value) ? 'text-gray-400 italic' : 'text-gray-700'}`}>
          {value}
        </p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export default function AcademicInfoCard({ info, isLoading }: AcademicInfoCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <GraduationCap className="w-5 h-5 text-indigo-500" />
        <h2 className="text-base font-semibold text-gray-800">Información académica</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <SkeletonCell key={i} />)
        ) : (
          <>
            <Cell icon={<BookMarked className="w-4 h-4" />} label="Asignatura"        value={info.subjectName}            sub={info.subjectCode} />
            <Cell icon={<Star className="w-4 h-4" />}       label="Créditos"          value={info.creditsLabel} />
            <Cell icon={<Building2 className="w-4 h-4" />}  label="Carrera"           value={info.careerName} />
            <Cell icon={<BookCopy className="w-4 h-4" />}   label="Plan"              value={info.studyPlanName}          sub={info.studyPlanYear ? `Año ${info.studyPlanYear}` : null} />
            <Cell icon={<Hash className="w-4 h-4" />}       label="Semestre sugerido" value={info.suggestedSemesterLabel} />
          </>
        )}
      </div>
    </div>
  )
}