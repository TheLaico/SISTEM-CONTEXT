// src/pages/PlanEstudios/PlanEstudios.tsx
import React, { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import useAdminStudyPlans from '../../hooks/useAdminStudyPlans'
import AddSubjectToPlanModal from './components/AddSubjectToPlanModal'
import CreatePlanModal from './components/CreatePlanModal'
import PublishPlanModal from './components/PublishPlanModal'
import SemesterStructureView from './components/SemesterStructureView'
import StudyPlanFiltersBar from './components/StudyPlanFiltersBar'
import StudyPlanMainTable from './components/StudyPlanMainTable'
import VersionHistoryTable from './components/VersionHistoryTable'
import PlanSubjectsSection from './components/PlanSubjectsSection'


type ActiveView = 'table' | 'detail' | 'history'

const PlanEstudios: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('table')

  const {
    careers,
    enrichedPlans,
    availableYears,
    planSubjects,
    subjectsBySemester,
    totalCredits,
    filteredSubjectsForSearch,
    selectedPlan,
    selectedPlanId,
    selectedPlanCareer,
    planForAction,
    filters,
    handleFilterChange,
    loading,
    loadingAction,
    loadingPlanSubjects,
    error,
    handleSelectPlan,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isNewVersionModalOpen,
    setIsNewVersionModalOpen,
    isAddSubjectModalOpen,
    setIsAddSubjectModalOpen,
    isPublishModalOpen,
    setIsPublishModalOpen,
    openPublishModal,
    openAddSubjectModal,
    publishYear,
    setPublishYear,
    subjectSearchQuery,
    setSubjectSearchQuery,
    handleCreatePlan,
    handleAddSubjectToPlan,
    handlePublishPlan,
    handleDuplicatePlan,
    loadInitialData,
    loadPlanSubjects,
  } = useAdminStudyPlans()

  // ── Sidebar links ─────────────────────────────────────────────────────────
  const sidebarLinks: { label: string; view: ActiveView | null; icon: React.ReactNode }[] = [
    {
      label: 'Todos los planes',
      view: 'table',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      ),
    },
    {
      label: 'Historial de versiones',
      view: 'history',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ]

  const publishedPlans = enrichedPlans.filter((p) => p.is_published)
  const draftPlans = enrichedPlans.filter((p) => !p.is_published)

  return (
    <div className="flex min-h-screen">
      {/* ── Sidebar ────────────────────────────────────────────────────────── */}
      <aside className="hidden w-56 flex-shrink-0 border-r border-stroke bg-white dark:border-strokedark dark:bg-boxdark lg:block">
        <div className="p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-body dark:text-bodydark">
            Planes de Estudio
          </p>
          <nav className="space-y-1">
            {sidebarLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => link.view && setActiveView(link.view)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  activeView === link.view
                    ? 'bg-primary bg-opacity-10 text-primary'
                    : 'text-black hover:bg-gray dark:text-white dark:hover:bg-meta-4'
                }`}
              >
                {link.icon}
                {link.label}
              </button>
            ))}

            <div className="my-2 border-t border-stroke dark:border-strokedark" />

            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-black transition hover:bg-gray dark:text-white dark:hover:bg-meta-4"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Crear plan
            </button>

            <div className="my-2 border-t border-stroke dark:border-strokedark" />

            <button
              type="button"
              onClick={() => {
                handleFilterChange('status', 'publicado')
                setActiveView('table')
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-black transition hover:bg-gray dark:text-white dark:hover:bg-meta-4"
            >
              <svg className="h-4 w-4 text-meta-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Publicados ({publishedPlans.length})
            </button>

            <button
              type="button"
              onClick={() => {
                handleFilterChange('status', 'borrador')
                setActiveView('table')
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-black transition hover:bg-gray dark:text-white dark:hover:bg-meta-4"
            >
              <svg className="h-4 w-4 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Borradores ({draftPlans.length})
            </button>
          </nav>
        </div>
      </aside>

      {/* ── Contenido principal ───────────────────────────────────────────── */}
      <main className="flex-1 overflow-auto p-6">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-2 text-sm text-body dark:text-bodydark">
          <Link to="/" className="font-medium hover:text-primary">Inicio</Link>
          <span>›</span>
          <span className="font-semibold text-black dark:text-white">Planes de Estudio</span>
        </nav>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-danger bg-opacity-10 px-4 py-3 text-sm text-danger">
            <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}

        {/* ── Vista: Tabla principal ──────────────────────────────────────── */}
        {activeView === 'table' && (
          <div className="space-y-6">
            <StudyPlanFiltersBar
              careers={careers}
              availableYears={availableYears}
              filters={filters}
              onFilterChange={handleFilterChange}
              onCreatePlan={() => setIsCreateModalOpen(true)}
              onNewVersion={() => setIsNewVersionModalOpen(true)}
            />

            <StudyPlanMainTable
              plans={enrichedPlans}
              loading={loading}
              onPublish={(plan) => {
                handleSelectPlan(String(plan.id))
                openPublishModal(plan)
              }}
              onDuplicate={handleDuplicatePlan}
              onAddSubject={(planId) => openAddSubjectModal(planId)}
            />

            {/* Sección de asignaturas del plan seleccionado */}
            {selectedPlanId && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-base font-semibold text-black dark:text-white">
                    Asignaturas — {selectedPlan?.name || `Plan ${selectedPlanId}`}
                  </h2>
                  <button
                    type="button"
                    onClick={() => handleSelectPlan('')}
                    className="text-xs text-body hover:text-black dark:hover:text-white"
                  >
                    Cerrar ×
                  </button>
                </div>

                <PlanSubjectsSection
                  planId={selectedPlanId}
                  subjects={planSubjects}
                  isPublished={selectedPlan?.is_published ?? false}
                  loading={loadingPlanSubjects}
                  onSubjectRemoved={() => loadPlanSubjects(selectedPlanId)}
                  onAddSubject={() => setIsAddSubjectModalOpen(true)}
                />

                <SemesterStructureView
                  subjectsBySemester={subjectsBySemester}
                  totalSubjects={planSubjects.length}
                  totalCredits={totalCredits}
                  updatedAt={selectedPlan?.updated_at}
                />
              </div>
            )}
          </div>
        )}

        {/* ── Vista: Historial de versiones ───────────────────────────────── */}
        {activeView === 'history' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-title-md font-bold text-black dark:text-white">Historial de versiones</h1>
                <p className="mt-1 text-sm text-body dark:text-bodydark">
                  Consulta y duplica versiones de planes de estudio
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveView('table')}
                className="rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-black transition hover:border-primary hover:text-primary dark:border-strokedark dark:text-white"
              >
                ← Volver a planes
              </button>
            </div>

            {/* Filtro por carrera */}
            <div className="rounded-2xl border border-stroke bg-white p-5 shadow-card dark:border-strokedark dark:bg-boxdark">
              <label className="mb-1.5 block text-sm font-medium text-black dark:text-white">Carrera</label>
              <select
                value={filters.careerId}
                onChange={(e) => handleFilterChange('careerId', e.target.value)}
                className="w-full max-w-xs rounded-lg border border-stroke bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
              >
                <option value="">Todas las carreras</option>
                {careers.map((c) => (
                  <option key={c.id} value={String(c.id)}>{c.name}</option>
                ))}
              </select>
            </div>

            <VersionHistoryTable
              versions={enrichedPlans}
              loading={loading}
              onDuplicate={handleDuplicatePlan}
            />
          </div>
        )}
      </main>

      {/* ── Modales ───────────────────────────────────────────────────────── */}
      <CreatePlanModal
        isOpen={isCreateModalOpen}
        careers={careers}
        loading={loadingAction}
        onConfirm={handleCreatePlan}
        onCancel={() => setIsCreateModalOpen(false)}
      />

      <CreatePlanModal
        isOpen={isNewVersionModalOpen}
        careers={careers}
        loading={loadingAction}
        title="Nueva versión del plan"
        onConfirm={handleCreatePlan}
        onCancel={() => setIsNewVersionModalOpen(false)}
      />

      <AddSubjectToPlanModal
        isOpen={isAddSubjectModalOpen}
        availableSubjects={filteredSubjectsForSearch}
        searchQuery={subjectSearchQuery}
        onSearchChange={setSubjectSearchQuery}
        loading={loadingAction}
        onConfirm={handleAddSubjectToPlan}
        onCancel={() => setIsAddSubjectModalOpen(false)}
      />

      <PublishPlanModal
        isOpen={isPublishModalOpen}
        careerName={selectedPlanCareer?.name || planForAction?.career?.name || ''}
        planName={planForAction?.name || selectedPlan?.name}
        totalSubjects={planSubjects.length}
        publishYear={publishYear}
        onYearChange={setPublishYear}
        onConfirm={() =>
          handlePublishPlan(
            String(planForAction?.id || selectedPlanId),
            publishYear
          )
        }
        onCancel={() => setIsPublishModalOpen(false)}
        loadingAction={loadingAction}
      />
    </div>
  )
}

export default PlanEstudios