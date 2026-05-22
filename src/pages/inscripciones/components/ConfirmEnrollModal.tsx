// src/pages/Inscripciones/components/ConfirmEnrollModal.tsx
import React from 'react'
import { EnrollmentSummary } from '../../../types/enrollmentFlow'

interface Props {
  isOpen: boolean
  summary: EnrollmentSummary | null
  studentName: string
  semesterName: string
  isConfirming: boolean
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmEnrollModal: React.FC<Props> = ({
  isOpen,
  summary,
  studentName,
  semesterName,
  isConfirming,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !summary) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl dark:bg-boxdark">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-strokedark">
          <div>
            <h2 className="text-base font-semibold text-black dark:text-white">Confirmar inscripción</h2>
            <p className="mt-0.5 text-xs text-body dark:text-bodydark">
              Se crearán {summary.selectedGroups.length} inscripción(es) para {studentName}
            </p>
          </div>
          <button type="button" onClick={onCancel} className="text-body hover:text-black dark:hover:text-white">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabla de grupos seleccionados */}
        <div className="px-6 py-4">
          <div className="overflow-x-auto rounded-lg border border-stroke dark:border-strokedark">
            <table className="min-w-full divide-y divide-stroke text-sm dark:divide-strokedark">
              <thead className="bg-gray dark:bg-meta-4">
                <tr>
                  {['Grupo', 'Asignatura', 'Créditos'].map((col) => (
                    <th key={col} className="px-4 py-2.5 text-left text-xs font-semibold text-body dark:text-bodydark">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stroke dark:divide-strokedark">
                {summary.selectedGroups.map((g) => (
                  <tr key={g.groupId}>
                    <td className="px-4 py-2.5 font-medium text-black dark:text-white">{g.groupCode}</td>
                    <td className="px-4 py-2.5 text-black dark:text-white">{g.subjectName}</td>
                    <td className="px-4 py-2.5 text-center text-black dark:text-white">{g.credits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Resumen */}
          <div className="mt-3 flex items-center justify-between rounded-lg bg-gray px-4 py-2.5 text-sm dark:bg-meta-4">
            <span className="text-body dark:text-bodydark">Total créditos</span>
            <span className="font-bold text-black dark:text-white">{summary.totalCredits} / {summary.maxCredits}</span>
          </div>

          {/* Semestre */}
          <div className="mt-2 text-xs text-body dark:text-bodydark">
            Semestre: <span className="font-medium text-black dark:text-white">{semesterName}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-stroke px-6 py-4 dark:border-strokedark">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-black dark:border-strokedark dark:text-white"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-60"
          >
            {isConfirming && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
            {isConfirming ? 'Inscribiendo...' : 'Inscribir estudiante'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmEnrollModal