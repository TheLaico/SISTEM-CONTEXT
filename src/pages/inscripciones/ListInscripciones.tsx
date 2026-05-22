// src/pages/inscripciones/ListInscripciones.tsx
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import Breadcrumb from '../../components/Breadcrumb'
import GenericTable, { TableColumn } from '../../components/GenericTable'
import useEnrollments from '../../hooks/useEnrollment'
import { Enrollment } from '../../models/Enrollment'
import { inscripcionService } from '../../services/inscripcionService'

const statusLabel: Record<string, string> = {
  ACTIVE:    'Activa',
  INACTIVE:  'Inactiva',
  WITHDRAWN: 'Cancelada',
}

const statusColor: Record<string, string> = {
  ACTIVE:    'bg-success/10 text-success',
  INACTIVE:  'bg-stroke text-body',
  WITHDRAWN: 'bg-danger/10 text-danger',
}

const ListInscripciones = () => {
  const navigate  = useNavigate()
  const { enrollments, loading, error, refresh } = useEnrollments()

  const columns: TableColumn<Enrollment>[] = [
    {
      key: 'student_id',
      label: 'Estudiante',
      render: item =>
        item.student
          ? `${item.student.first_name ?? ''} ${item.student.last_name ?? ''}`.trim() || String(item.student_id)
          : String(item.student_id),
    },
    {
      key: 'group_id',
      label: 'Grupo',
      render: item => item.group?.group_code ?? String(item.group_id),
    },
    {
      key: 'group_subject',
      label: 'Asignatura',
      render: item => item.group?.subject?.name ?? '—',
    },
    {
      key: 'enrollment_date',
      label: 'Fecha inscripción',
      render: item => item.enrollment_date
        ? new Date(item.enrollment_date).toLocaleDateString('es-CO')
        : '—',
    },
    {
      key: 'status',
      label: 'Estado',
      render: item => (
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColor[item.status] ?? 'bg-stroke text-body'}`}>
          {statusLabel[item.status] ?? item.status}
        </span>
      ),
    },
  ]

  const handleCancel = async (enrollment: Enrollment) => {
    if (enrollment.status !== 'ACTIVE') return
    const result = await Swal.fire({
      title:             'Cancelar inscripción',
      html:              `<p class="text-sm">¿Cancelar la inscripción del grupo 
                          <b>${enrollment.group?.group_code ?? enrollment.group_id}</b>?
                          <br>Esta acción no elimina el registro, solo cambia su estado.</p>`,
      icon:              'warning',
      showCancelButton:  true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText:  'No',
      confirmButtonColor:'#DC3545',
    })
    if (!result.isConfirmed) return
    try {
      await inscripcionService.updateEnrollment(enrollment.id, { status: 'WITHDRAWN' })
      Swal.fire('Cancelada', 'Inscripción cancelada correctamente.', 'success')
      refresh()
    } catch (err: any) {
      Swal.fire('Error', err.message ?? 'No se pudo cancelar', 'error')
    }
  }

  return (
    <div className="mx-auto max-w-screen-xl px-4 pb-10">
      <Breadcrumb
        pageName="Inscripciones"
        items={[
          { label: 'Inicio', to: '/' },
          { label: 'Académico' },
          { label: 'Inscripciones' },
        ]}
      />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-black dark:text-white">Gestión de Inscripciones</h2>
          <p className="text-sm text-body dark:text-bodydark">Administra las inscripciones de estudiantes en grupos de asignaturas.</p>
        </div>
        <button
          onClick={() => navigate('/inscripciones/create')}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
        >
          + Inscribir estudiante
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <p className="text-body dark:text-bodydark">Cargando inscripciones...</p>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      {!loading && (
        <GenericTable
          data={enrollments}
          columns={columns}
          renderActions={item => (
            <div className="flex items-center gap-2">
              {item.status === 'ACTIVE' && (
                <button
                  onClick={() => handleCancel(item)}
                  className="rounded-md border border-danger/40 px-3 py-1.5 text-xs font-medium text-danger transition hover:bg-danger/5"
                >
                  Cancelar
                </button>
              )}
            </div>
          )}
        />
      )}

      {!loading && enrollments.length === 0 && (
        <div className="mt-6 flex flex-col items-center justify-center gap-3 rounded-md border border-stroke bg-white py-12 dark:border-strokedark dark:bg-boxdark">
          <p className="text-base font-medium text-body dark:text-bodydark">No hay inscripciones registradas.</p>
          <button
            onClick={() => navigate('/inscripciones/create')}
            className="rounded-md bg-primary px-4 py-2 text-sm text-white"
          >
            Inscribir primer estudiante
          </button>
        </div>
      )}
    </div>
  )
}

export default ListInscripciones