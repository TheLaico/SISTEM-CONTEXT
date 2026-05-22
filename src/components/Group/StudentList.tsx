// src/components/Grupos/StudentList.tsx
import { UserX, Users } from 'lucide-react'
import { EnrolledStudentRow } from '../../business/GroupBusiness'

interface StudentListProps {
  students: EnrolledStudentRow[]
  isLoading?: boolean
  isReadOnly?: boolean
}

const GRADE_COLOR: Record<string, string> = {
  green:  'bg-green-100 text-green-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  red:    'bg-red-100 text-red-700',
  gray:   'bg-gray-100 text-gray-500',
}

function SkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 4 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="animate-pulse h-4 bg-gray-200 rounded w-full" />
        </td>
      ))}
    </tr>
  )
}

export default function StudentList({ students, isLoading }: StudentListProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-indigo-500" />
        <h2 className="text-base font-semibold text-gray-800">Estudiantes inscritos</h2>
        {!isLoading && (
          <span className="ml-auto text-xs bg-indigo-50 text-indigo-600 font-semibold px-2 py-0.5 rounded-full">
            {students.length} estudiante{students.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Tabla — desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b text-xs text-gray-400 uppercase tracking-wide">
              <th className="px-4 py-2 font-medium">Estudiante</th>
              <th className="px-4 py-2 font-medium">Código</th>
              <th className="px-4 py-2 font-medium">Inscripción</th>
              <th className="px-4 py-2 font-medium">Calificación</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
              : students.length === 0
              ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-gray-400">
                    <UserX className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    No hay estudiantes inscritos en este grupo.
                  </td>
                </tr>
              )
              : students.map((s) => (
                <tr key={String(s.enrollmentId)} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{s.fullName}</p>
                    <p className="text-xs text-gray-400">{s.identification}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{s.code}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${s.enrollmentStatus === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {s.enrollmentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${GRADE_COLOR[s.gradeStatusColor]}`}>
                      {s.gradeStatus}
                    </span>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {/* Cards — mobile */}
      <div className="md:hidden space-y-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse h-16 bg-gray-100 rounded-lg" />
          ))
          : students.length === 0
          ? (
            <div className="flex flex-col items-center py-8 text-gray-400">
              <UserX className="w-8 h-8 mb-2 opacity-40" />
              <p className="text-sm">No hay estudiantes inscritos.</p>
            </div>
          )
          : students.map((s) => (
            <div key={String(s.enrollmentId)} className="border rounded-lg p-3 space-y-1">
              <p className="font-semibold text-gray-800 text-sm">{s.fullName}</p>
              <p className="text-xs text-gray-400">{s.identification} · {s.code}</p>
              <div className="flex gap-2 flex-wrap pt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${s.enrollmentStatus === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {s.enrollmentStatus}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${GRADE_COLOR[s.gradeStatusColor]}`}>
                  {s.gradeStatus}
                </span>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}