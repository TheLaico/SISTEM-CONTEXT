// src/pages/Inscripciones/EnrollStudentGroupPage.tsx
import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

import { useEnrollStudentInGroup } from '../../hooks/useEnrollStudentInGroup'
import { enrollStudentService } from '../../services/enrollStudentService'
import { Enrollment } from '../../models/Enrollment'
import { Group } from '../../models/Group'
import { Student } from '../../models/Student'

import EnrollSidebar, { EnrollView } from './components/EnrollSidebar'
import StudentSearchPanel from './components/StudentSearchPanel'
import AvailableGroupsTable from './components/AvailableGroupsTable'
import CreditsSummaryPanel from './components/CreditsSummaryPanel'
import EnrollmentHistoryTable from './components/EnrollmentHistoryTable'
import ConfirmEnrollModal from './components/ConfirmEnrollModal'

const EnrollStudentGroupPage: React.FC = () => {
  const { state, searchResults, actions, derived } = useEnrollStudentInGroup()

  const [activeView, setActiveView] = useState<EnrollView>('new')
  const [searchQuery, setSearchQuery] = useState('')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showWarningModal, setShowWarningModal] = useState(false)
  const [warningGroup, setWarningGroup] = useState<Group | null>(null)
  const [dontShowAgain, setDontShowAgain] = useState(false)
  const [dismissedWarnings, setDismissedWarnings] = useState<Set<string>>(new Set())

  // Historial de inscripciones del estudiante seleccionado
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loadingEnrollments, setLoadingEnrollments] = useState(false)

  const studentName = `${
    state.selectedStudent?.first_name ||
    state.selectedStudent?.user?.profile?.first_name ||
    ''
  } ${
    state.selectedStudent?.last_name ||
    state.selectedStudent?.user?.profile?.last_name ||
    ''
  }`.trim()

  const studentId =
    state.selectedStudent?.id ||
    state.selectedStudent?.user_id ||
    state.selectedStudent?.user?.id ||
    state.selectedStudent?.user?.profile?.id ||
    ''

  // Cargar inscripciones cuando cambia el estudiante
  useEffect(() => {
    if (studentId) {
      loadEnrollments()
    } else {
      setEnrollments([])
    }
  }, [studentId])

  const loadEnrollments = async () => {
    if (!studentId) return
    setLoadingEnrollments(true)
    try {
      const data = await enrollStudentService.getStudentEnrollments(String(studentId))
      setEnrollments(data ?? [])
    } catch {
      setEnrollments([])
    } finally {
      setLoadingEnrollments(false)
    }
  }

  const studyPlanSubjectIds = useMemo(
    () => (state.studyPlanSubjects ?? []).map((s) => String(s.subject_id)),
    [state.studyPlanSubjects]
  )

  const activeEnrollments = useMemo(
    () => enrollments.filter((e) => e.status === 'ACTIVE'),
    [enrollments]
  )
  const cancelledEnrollments = useMemo(
    () => enrollments.filter((e) => e.status === 'WITHDRAWN' || (e.status as string) === 'CANCELLED'),
    [enrollments]
  )

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.length > 2) {
      await actions.searchStudents(query)
    }
  }

  const handleSelectStudent = async (student: Student) => {
    await actions.selectStudent(student)
  }

  const handleWarningGroup = (group: Group) => {
    setWarningGroup(group)
    setShowWarningModal(true)
  }

  const handleConfirmWarning = () => {
    if (warningGroup) {
      actions.toggleGroup(warningGroup)
      if (dontShowAgain) {
        setDismissedWarnings((prev) => new Set([...prev, warningGroup.id]))
      }
    }
    setWarningGroup(null)
    setDontShowAgain(false)
    setShowWarningModal(false)
  }

  const handleConfirmEnrollment = async () => {
    await actions.confirmEnrollment()
    setShowConfirmModal(false)
    if (state.isSuccess) {
      await loadEnrollments()
      setActiveView('active')
    }
  }

  const hasActiveRegistration = state.studentRegistration?.is_active === true
  const canSelectGroups = !!state.selectedStudent && hasActiveRegistration

  const creditsSelected = derived.enrollmentSummary?.totalCredits ?? 0
  const CREDIT_LIMIT = 20

  // ── Renderizado de cada vista ─────────────────────────────────────────────
  const renderNewEnrollment = () => (
    <div className="grid grid-cols-12 gap-5">
      {/* Col izquierda: búsqueda + grupos */}
      <div className="col-span-12 space-y-5 xl:col-span-8">
        <StudentSearchPanel
          searchQuery={searchQuery}
          onSearchChange={handleSearch}
          searchResults={searchResults}
          selectedStudent={state.selectedStudent}
          studentRegistration={state.studentRegistration}
          isSearching={state.isSearching}
          onSelectStudent={handleSelectStudent}
        />

        {/* Bloqueo si no tiene matrícula */}
        {state.selectedStudent && !hasActiveRegistration && (
          <div className="flex items-center gap-3 rounded-2xl border border-danger bg-danger bg-opacity-5 px-5 py-4 text-sm text-danger">
            <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            <div>
              <p className="font-semibold">El estudiante no posee matrícula activa</p>
              <p className="text-xs opacity-80">No es posible inscribirlo en grupos hasta que tenga una matrícula activa.</p>
            </div>
          </div>
        )}

        <AvailableGroupsTable
          groupRows={derived.groupTableRows}
          allGroups={state.availableGroups}
          selectedGroups={state.selectedGroups}
          studyPlanSubjectIds={studyPlanSubjectIds}
          dismissedWarnings={dismissedWarnings}
          onToggleGroup={actions.toggleGroup}
          onWarningGroup={handleWarningGroup}
          disabled={!canSelectGroups}
        />
      </div>

      {/* Col derecha: resumen créditos */}
      <div className="col-span-12 xl:col-span-4">
        <CreditsSummaryPanel
          creditsSelected={creditsSelected}
          creditsLimit={CREDIT_LIMIT}
          selectedCount={state.selectedGroups.length}
          errors={state.errors}
          onConfirm={() => setShowConfirmModal(true)}
          onReset={actions.resetForm}
          disabled={!canSelectGroups}
          activeSemesterName={state.activeSemester?.name}
          activeSemesterStart={state.activeSemester?.start_date}
          activeSemesterEnd={state.activeSemester?.end_date}
        />
      </div>
    </div>
  )

  const renderHistorySection = (
    title: string,
    subtitle: string,
    filterStatus: 'all' | 'ACTIVE' | 'CANCELLED'
  ) => (
    <div className="space-y-5">
      {/* Buscador de estudiante para historial */}
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-4">
          <StudentSearchPanel
            searchQuery={searchQuery}
            onSearchChange={handleSearch}
            searchResults={searchResults}
            selectedStudent={state.selectedStudent}
            studentRegistration={state.studentRegistration}
            isSearching={state.isSearching}
            onSelectStudent={handleSelectStudent}
          />
        </div>

        <div className="col-span-12 lg:col-span-8">
          <div className="rounded-2xl border border-stroke bg-white shadow-card dark:border-strokedark dark:bg-boxdark">
            <div className="flex items-center justify-between border-b border-stroke px-5 py-4 dark:border-strokedark">
              <div>
                <h3 className="text-base font-semibold text-black dark:text-white">{title}</h3>
                <p className="mt-0.5 text-xs text-body dark:text-bodydark">{subtitle}</p>
              </div>
              {state.selectedStudent && (
                <span className="text-sm font-medium text-black dark:text-white">{studentName}</span>
              )}
            </div>
            <div className="p-2">
              {!state.selectedStudent ? (
                <p className="py-10 text-center text-sm text-body dark:text-bodydark">
                  Selecciona un estudiante para ver sus inscripciones.
                </p>
              ) : (
                <EnrollmentHistoryTable
                  enrollments={filterStatus === 'CANCELLED' ? cancelledEnrollments : filterStatus === 'ACTIVE' ? activeEnrollments : enrollments}
                  loading={loadingEnrollments}
                  filterStatus={filterStatus}
                  onCancelled={loadEnrollments}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen">
      <EnrollSidebar
        activeView={activeView}
        onChangeView={setActiveView}
        activeCount={activeEnrollments.length}
        cancelledCount={cancelledEnrollments.length}
      />

      <main className="flex-1 overflow-auto p-6">
        {/* Breadcrumb + Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <nav className="mb-1.5 flex items-center gap-2 text-sm text-body dark:text-bodydark">
              <Link to="/" className="font-medium hover:text-primary">Inicio</Link>
              <span>›</span>
              <span className="font-semibold text-black dark:text-white">Inscribir Estudiante en Grupo</span>
            </nav>
            <h1 className="text-title-md font-bold text-black dark:text-white">
              Inscribir Estudiante en Grupo
            </h1>
            <p className="mt-1 text-sm text-body dark:text-bodydark">
              Inscribe estudiantes en grupos del semestre activo validando matrícula y créditos.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => { setActiveView('history'); actions.resetForm() }}
              className="inline-flex items-center gap-2 rounded-lg border border-stroke bg-white px-4 py-2 text-sm font-medium text-black transition hover:border-primary hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Ver historial
            </button>
            <button
              type="button"
              onClick={() => { setActiveView('new'); actions.resetForm() }}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-opacity-90"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Nueva inscripción
            </button>
          </div>
        </div>

        {/* Errores globales */}
        {state.errors.filter((e) => e.severity === 'error').length > 0 && !state.isSuccess && (
          <div className="mb-5 space-y-2">
            {state.errors.filter((e) => e.severity === 'error').slice(0, 2).map((err, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg bg-danger bg-opacity-10 px-4 py-3 text-sm text-danger">
                <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {err.message}
              </div>
            ))}
          </div>
        )}

        {/* Vistas */}
        {activeView === 'new' && renderNewEnrollment()}
        {activeView === 'active' && renderHistorySection('Inscripciones activas', 'Inscripciones en curso del estudiante', 'ACTIVE')}
        {activeView === 'cancelled' && renderHistorySection('Inscripciones canceladas', 'Inscripciones con estado cancelado', 'CANCELLED')}
        {activeView === 'history' && renderHistorySection('Historial completo', 'Todas las inscripciones del estudiante', 'all')}
      </main>

      {/* Modal: confirmar inscripción */}
      <ConfirmEnrollModal
        isOpen={showConfirmModal}
        summary={derived.enrollmentSummary}
        studentName={studentName}
        semesterName={state.activeSemester?.name || '—'}
        isConfirming={state.isConfirming}
        onConfirm={handleConfirmEnrollment}
        onCancel={() => setShowConfirmModal(false)}
      />

      {/* Modal: éxito */}
      {state.isSuccess && state.successDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl dark:bg-boxdark">
            <div className="px-6 py-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-meta-3 bg-opacity-20">
                <svg className="h-8 w-8 text-meta-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-black dark:text-white">Inscripción realizada correctamente</h2>
              <p className="mt-2 text-sm text-body dark:text-bodydark">
                Se crearon {state.successDetails.enrollmentsCreated} inscripción(es) para {studentName}.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 border-t border-stroke px-6 py-4 dark:border-strokedark">
              <div className="rounded-xl bg-gray p-3 text-center dark:bg-meta-4">
                <p className="text-xs text-body dark:text-bodydark">Inscripciones</p>
                <p className="mt-1 text-lg font-bold text-black dark:text-white">{state.successDetails.enrollmentsCreated}</p>
              </div>
              <div className="rounded-xl bg-gray p-3 text-center dark:bg-meta-4">
                <p className="text-xs text-body dark:text-bodydark">Fecha</p>
                <p className="mt-1 text-sm font-bold text-black dark:text-white">{state.successDetails.enrollmentDate}</p>
              </div>
              <div className="rounded-xl bg-gray p-3 text-center dark:bg-meta-4">
                <p className="text-xs text-body dark:text-bodydark">Semestre</p>
                <p className="mt-1 text-sm font-bold text-black dark:text-white">{state.successDetails.semesterName}</p>
              </div>
            </div>

            <div className="px-6 py-4">
              <button
                type="button"
                onClick={() => {
                  actions.resetForm()
                  loadEnrollments()
                  setActiveView('active')
                }}
                className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
              >
                Ver inscripciones activas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: advertencia asignatura fuera del plan */}
      {showWarningModal && warningGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl dark:bg-boxdark">
            <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
              <h2 className="text-base font-semibold text-black dark:text-white">Asignatura fuera del plan</h2>
              <p className="mt-0.5 text-xs text-body dark:text-bodydark">
                La asignatura no pertenece al plan de estudios del estudiante.
              </p>
            </div>

            <div className="space-y-4 px-6 py-5">
              <div className="flex items-start gap-3 rounded-xl bg-warning bg-opacity-10 px-4 py-3 text-sm text-warning">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>
                  <strong>{warningGroup.subject?.name || 'Esta asignatura'}</strong> no pertenece al plan de estudios de la carrera del estudiante. ¿Deseas inscribirlo de todas formas?
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-gray p-2.5 dark:bg-meta-4">
                  <p className="text-body dark:text-bodydark">Grupo</p>
                  <p className="font-medium text-black dark:text-white">{warningGroup.group_code}</p>
                </div>
                <div className="rounded-lg bg-gray p-2.5 dark:bg-meta-4">
                  <p className="text-body dark:text-bodydark">Asignatura</p>
                  <p className="font-medium text-black dark:text-white">{warningGroup.subject?.code || '—'}</p>
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-black dark:text-white">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="h-4 w-4 accent-primary"
                />
                No volver a mostrar esta advertencia en esta sesión
              </label>
            </div>

            <div className="flex justify-end gap-2 border-t border-stroke px-6 py-4 dark:border-strokedark">
              <button
                type="button"
                onClick={() => { setShowWarningModal(false); setWarningGroup(null) }}
                className="rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-black dark:border-strokedark dark:text-white"
              >
                No inscribir
              </button>
              <button
                type="button"
                onClick={handleConfirmWarning}
                className="rounded-lg bg-warning px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90"
              >
                Inscribir de todas formas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EnrollStudentGroupPage