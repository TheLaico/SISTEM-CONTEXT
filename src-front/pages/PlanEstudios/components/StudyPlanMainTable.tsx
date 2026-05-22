// src/pages/PlanEstudios/components/StudyPlanMainTable.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StudyPlan } from '../../../models/StudyPlan'
import { Career } from '../../../models/Career'

interface EnrichedPlan extends StudyPlan {
  career?: Career
}

interface Props {
  plans: EnrichedPlan[]
  onPublish: (plan: StudyPlan) => void
  onDuplicate: (plan: StudyPlan) => void
  onAddSubject: (planId: string) => void
  loading?: boolean
}

const StatusBadge: React.FC<{ isPublished: boolean }> = ({ isPublished }) => (
  <span
    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${isPublished
        ? 'bg-meta-3 bg-opacity-10 text-meta-3'
        : 'bg-warning bg-opacity-10 text-warning'
      }`}
  >
    {isPublished ? 'Publicado' : 'Borrador'}
  </span>
)

const StudyPlanMainTable: React.FC<Props> = ({
  plans,
  onPublish,
  onDuplicate,
  onAddSubject,
  loading,
}) => {
  const navigate = useNavigate()
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  const toggleDropdown = (id: string) => {
    setOpenDropdownId((prev) => (prev === id ? null : id))
  }

  if (loading) {
    return (
      <div className="flex min-h-48 items-center justify-center rounded-2xl border border-stroke bg-white shadow-card dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-center gap-3 text-sm text-body dark:text-bodydark">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Cargando planes de estudio...
        </div>
      </div>
    )
  }

  if (plans.length === 0) {
    return (
      <div className="flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-stroke bg-white p-8 shadow-card dark:border-strokedark dark:bg-boxdark">
        <div className="text-center">
          <svg className="mx-auto mb-3 h-10 w-10 text-body dark:text-bodydark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm font-medium text-black dark:text-white">No hay planes de estudio</p>
          <p className="mt-1 text-xs text-body dark:text-bodydark">Crea el primer plan o ajusta los filtros</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-stroke bg-white shadow-card dark:border-strokedark dark:bg-boxdark">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-stroke dark:divide-strokedark">
          <thead>
            <tr className="bg-gray dark:bg-meta-4">
              {[
                'Carrera',
                'Nombre del plan',
                'Año / Versión',
                'Estado',
                'Asignaturas',
                'Créditos',
                'Fecha publicación',
                'Acciones',
              ].map((col) => (
                <th
                  key={col}
                  className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-body dark:text-bodydark"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stroke dark:divide-strokedark">
            {plans.map((plan) => {
              const planIdStr = String(plan.id)
              const isOpen = openDropdownId === planIdStr

              return (
                <tr
                  key={planIdStr}
                  className="transition hover:bg-gray dark:hover:bg-meta-4"
                >
                  {/* Carrera */}
                  <td className="px-4 py-4">
                    <span className="text-sm font-medium text-black dark:text-white">
                      {plan.career?.name ?? `Carrera ${plan.career_id}`}
                    </span>
                  </td>

                  {/* Nombre del plan */}
                  <td className="px-4 py-4">
                    <span className="text-sm text-black dark:text-white">{plan.name}</span>
                  </td>

                  {/* Año / Versión */}
                  <td className="px-4 py-4">
                    <span className="text-sm text-black dark:text-white">{plan.year}</span>
                  </td>

                  {/* Estado */}
                  <td className="px-4 py-4">
                    <StatusBadge isPublished={plan.is_published} />
                  </td>

                  {/* Cantidad asignaturas */}
                  <td className="px-4 py-4 text-sm text-center text-black dark:text-white">
                    {(plan as any).total_subjects ?? '—'}
                  </td>

                  {/* Total créditos */}
                  <td className="px-4 py-4 text-sm text-center text-black dark:text-white">
                    {(plan as any).total_credits ?? '—'}
                  </td>

                  {/* Fecha publicación */}
                  <td className="px-4 py-4 text-sm text-body dark:text-bodydark">
                    {plan.is_published && plan.updated_at
                      ? new Date(plan.updated_at).toLocaleDateString('es-CO')
                      : '—'}
                  </td>

                  {/* Acciones */}
                  <td className="relative px-4 py-4">
                    <button
                      type="button"
                      onClick={() => toggleDropdown(planIdStr)}
                      className="inline-flex items-center gap-1 rounded-lg border border-stroke bg-white px-3 py-1.5 text-xs font-medium text-black transition hover:border-primary hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
                    >
                      Acciones
                      <svg className={`h-3.5 w-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isOpen && (
                      <>
                        {/* overlay */}
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setOpenDropdownId(null)}
                        />
                        <div className="absolute right-4 top-full z-50 mt-1 w-44 overflow-hidden rounded-xl border border-stroke bg-white shadow-4 dark:border-strokedark dark:bg-boxdark">
                          <ActionItem
                            icon="eye"
                            label="Ver detalle"
                            onClick={() => {
                              setOpenDropdownId(null)
                              navigate(`/admin/study-plans/${planIdStr}`)
                            }}
                          />
                          <ActionItem
                            icon="edit"
                            label="Editar"
                            onClick={() => {
                              setOpenDropdownId(null)
                              navigate(`/admin/study-plans/${planIdStr}`)
                            }}
                          />
                          {!plan.is_published && (
                            <ActionItem
                              icon="publish"
                              label="Publicar"
                              onClick={() => {
                                setOpenDropdownId(null)
                                onPublish(plan)
                              }}
                            />
                          )}
                          <ActionItem
                            icon="duplicate"
                            label="Duplicar versión"
                            onClick={() => {
                              setOpenDropdownId(null)
                              onDuplicate(plan)
                            }}
                          />
                          <ActionItem
                            icon="history"
                            label="Ver historial"
                            onClick={() => {
                              setOpenDropdownId(null)
                              navigate(`/admin/study-plans/${planIdStr}?tab=history`)
                            }}
                          />
                          <ActionItem
                            icon="subject"
                            label="Agregar asig."
                            onClick={() => {
                              setOpenDropdownId(null)
                              onAddSubject(planIdStr)
                            }}
                          />
                          <ActionItem
                            icon="archive"
                            label="Archivar"
                            danger
                            onClick={() => {
                              setOpenDropdownId(null)
                              // archivar (actualizar estado)
                            }}
                          />
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Ítem del dropdown ─────────────────────────────────────────────────────────
const ICONS: Record<string, React.ReactNode> = {
  eye: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  edit: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  publish: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  duplicate: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  history: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  subject: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  ),
  archive: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
  ),
}

const ActionItem: React.FC<{
  icon: string
  label: string
  onClick: () => void
  danger?: boolean
}> = ({ icon, label, onClick, danger }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition hover:bg-gray dark:hover:bg-meta-4 ${danger ? 'text-danger' : 'text-black dark:text-white'
      }`}
  >
    {ICONS[icon]}
    {label}
  </button>
)

export default StudyPlanMainTable