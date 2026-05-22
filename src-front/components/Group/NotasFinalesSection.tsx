// src/components/Grupos/NotasFinalesSection.tsx
import toast from 'react-hot-toast'
import { Award, CheckCircle2, Download, Lock } from 'lucide-react'
import { EnrolledStudentRow } from '../../business/GroupBusiness'
import { Grade } from '../../models/Grade'

interface NotasFinalesSectionProps {
  students: EnrolledStudentRow[]
  grades: Grade[]
  isReadOnly?: boolean
  finalGradesRegistered: boolean
  onRegisterFinalScores: () => Promise<void>
}

function gradeForEnrollment(grades: Grade[], enrollmentId: string | number): Grade | undefined {
  return grades.find((g) => String((g as any).enrollment_id) === String(enrollmentId))
}

export default function NotasFinalesSection({
  students, grades, isReadOnly, finalGradesRegistered, onRegisterFinalScores,
}: NotasFinalesSectionProps) {
  const handleConsolidate = async () => {
    const ok = window.confirm(
      '¿Confirmas el registro oficial de notas? Esta acción no se puede deshacer.'
    )
    if (!ok) return
    await onRegisterFinalScores()
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-5 h-5 text-indigo-500" />
        <h2 className="text-base font-semibold text-gray-800">Notas finales</h2>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b text-xs text-gray-400 uppercase tracking-wide">
              <th className="px-4 py-2 font-medium">Estudiante</th>
              <th className="px-4 py-2 font-medium">Nota final</th>
              <th className="px-4 py-2 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {students.map((s) => {
              const grade = gradeForEnrollment(grades, s.enrollmentId)
              const score = grade?.final_score
              const isLocked = grade?.is_locked
              const isSent   = grade?.status === 'SENT'

              return (
                <tr key={String(s.enrollmentId)} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{s.fullName}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-700">
                    {score != null ? score.toFixed(1) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    {isLocked ? (
                      <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold w-fit">
                        <Lock className="w-3 h-3" /> Oficial
                      </span>
                    ) : isSent ? (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                        Enviada
                      </span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-semibold">
                        Pendiente
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Acciones */}
      <div className="flex flex-wrap items-center gap-3">
        {finalGradesRegistered ? (
          <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" />
            Las notas han sido consolidadas oficialmente.
          </div>
        ) : (
          <button
            onClick={handleConsolidate}
            disabled={isReadOnly || finalGradesRegistered}
            className="flex items-center gap-2 bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Award className="w-4 h-4" />
            Consolidar notas finales
          </button>
        )}

        <button
          onClick={() => toast.error('Funcionalidad próximamente.')}
          disabled={!finalGradesRegistered}
          className="flex items-center gap-2 border text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-gray-600"
        >
          <Download className="w-4 h-4" />
          Descargar reporte
        </button>
      </div>
    </div>
  )
}