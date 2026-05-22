// src/pages/Inscripciones/components/EnrollmentHistoryTable.tsx
import React, { useState } from 'react'
import { Enrollment } from '../../../models/Enrollment'
import { enrollStudentService } from '../../../services/enrollStudentService'
import toast from 'react-hot-toast'

interface Props {
  enrollments: Enrollment[]
  loading?: boolean
  filterStatus?: 'all' | 'ACTIVE' | 'CANCELLED'
  onCancelled?: () => void
}

const STATUS_LABELS: Record<string, { label: string; classes: string }> = {
  ACTIVE: { label: 'Activa', classes: 'bg-meta-3 bg-opacity-10 text-meta-3' },
  INACTIVE: { label: 'Inactiva', classes: 'bg-body bg-opacity-10 text-body' },
  WITHDRAWN: { label: 'Cancelada', classes: 'bg-danger bg-opacity-10 text-danger' },
  CANCELLED: { label: 'Cancelada', classes: 'bg-danger bg-opacity-10 text-danger' },
}

const EnrollmentHistoryTable: React.FC<Props> = ({
  enrollments,
  loading,
  filterStatus = 'all',
  onCancelled,
}) => {
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null)
  const [cancelReason, setCancelReason] = useState('')

  const displayed =
    filterStatus === 'all'
      ? enrollments
      : enrollments.filter((e) => e.status === filterStatus || (filterStatus === 'CANCELLED' && e.status === 'WITHDRAWN'))

  const openCancelModal = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment)
    setCancelReason('')
    setShowCancelModal(true)
  }

  const handleCancelConfirm = async () => {
    if (!selectedEnrollment) return
    setCancellingId(String(selectedEnrollment.id))
    try {
      await enrollStudentService.cancelEnrollment(String(selectedEnrollment.id), cancelReason)
      toast.success('Inscripción cancelada correctamente')
      setShowCancelModal(false)
      onCancelled?.()
    } catch (err: any) {
      toast.error(err?.message || 'No se pudo cancelar la inscripción')
    } finally {
      setCancellingId(null)
    }
  }

  const getGroupInfo = (enrollment: Enrollment) => {
    const group = enrollment.group
    return {
      groupCode: group?.group_code || `Grupo ${enrollment.group_id}`,
      subjectName: group?.subject?.name || '—',
      teacherName: group?.teacher
        ? `${group.teacher.first_name || ''} ${group.teacher.last_name || ''}`.trim()
        : '—',
      credits: group?.subject?.credits ?? '—',
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-sm text-body dark:text-bodydark">
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        Cargando inscripciones...
      </div>
    )
  }

  if (displayed.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-body dark:text-bodydark">
        No hay inscripciones {filterStatus !== 'all' ? `con estado "${filterStatus}"` : ''}.
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-stroke dark:divide-strokedark">
          <thead>
            <tr className="bg-gray dark:bg-meta-4">
              {['Asignatura', 'Grupo', 'Docente', 'Créditos', 'Estado', 'Fecha inscripción', 'Acciones'].map((col) => (
                <th key={col} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-body dark:text-bodydark">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stroke dark:divide-strokedark">
            {displayed.map((enrollment) => {
              const info = getGroupInfo(enrollment)
              const statusInfo = STATUS_LABELS[enrollment.status] || STATUS_LABELS.ACTIVE
              const isActive = enrollment.status === 'ACTIVE'

              return (
                <tr key={enrollment.id} className="transition hover:bg-gray dark:hover:bg-meta-4">
                  <td className="px-4 py-3 text-sm text-black dark:text-white">{info.subjectName}</td>
                  <td className="px-4 py-3 text-sm font-medium text-black dark:text-white">{info.groupCode}</td>
                  <td className="px-4 py-3 text-sm text-black dark:text-white">{info.teacherName}</td>
                  <td className="px-4 py-3 text-sm text-center text-black dark:text-white">{info.credits}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusInfo.classes}`}>
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-body dark:text-bodydark">
                    {enrollment.enrollment_date
                      ? new Date(enrollment.enrollment_date).toLocaleDateString('es-CO')
                      : enrollment.created_at
                      ? new Date(enrollment.created_at).toLocaleDateString('es-CO')
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    {isActive && (
                      <button
                        type="button"
                        onClick={() => openCancelModal(enrollment)}
                        disabled={cancellingId === String(enrollment.id)}
                        className="rounded border border-danger px-2.5 py-1 text-xs font-medium text-danger transition hover:bg-danger hover:text-white disabled:opacity-50"
                      >
                        {cancellingId === String(enrollment.id) ? '...' : 'Cancelar'}
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Modal cancelar inscripción */}
      {showCancelModal && selectedEnrollment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl dark:bg-boxdark">
            <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-strokedark">
              <h2 className="text-base font-semibold text-black dark:text-white">Cancelar inscripción</h2>
              <button type="button" onClick={() => setShowCancelModal(false)} className="text-body hover:text-black dark:hover:text-white">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">
              {/* Info */}
              <div className="rounded-lg border border-stroke bg-gray-2 px-4 py-3 text-sm dark:border-strokedark dark:bg-meta-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-body dark:text-bodydark">Asignatura</p>
                    <p className="font-medium text-black dark:text-white">{getGroupInfo(selectedEnrollment).subjectName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-body dark:text-bodydark">Grupo</p>
                    <p className="font-medium text-black dark:text-white">{getGroupInfo(selectedEnrollment).groupCode}</p>
                  </div>
                </div>
              </div>

              {/* Aviso: no elimina, cambia estado */}
              <div className="flex items-start gap-2 rounded-lg bg-warning bg-opacity-10 px-3 py-2.5 text-xs text-warning">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                La inscripción pasará a estado <strong>Cancelada</strong>. No se eliminará del historial.
              </div>

              {/* Nuevo estado */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-black dark:text-white">Nuevo estado</label>
                <input
                  type="text"
                  readOnly
                  value="Cancelada"
                  className="w-full rounded-lg border border-stroke bg-gray-2 px-3 py-2 text-sm text-body dark:border-strokedark dark:bg-meta-4"
                />
              </div>

              {/* Motivo */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-black dark:text-white">
                  Motivo <span className="text-body dark:text-bodydark">(opcional)</span>
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  rows={3}
                  placeholder="El estudiante solicita cancelación..."
                  className="w-full rounded-lg border border-stroke px-3 py-2 text-sm outline-none transition focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-stroke px-6 py-4 dark:border-strokedark">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-black dark:border-strokedark dark:text-white"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={handleCancelConfirm}
                disabled={!!cancellingId}
                className="inline-flex items-center gap-2 rounded-lg bg-danger px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-60"
              >
                {cancellingId && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                Confirmar cancelación
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default EnrollmentHistoryTable