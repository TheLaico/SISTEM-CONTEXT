import { useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'

import { misEvaluacionesBusiness } from '../../business/MisEvaluacionesBusiness'
import useMisEvaluaciones from '../../hooks/useMisEvaluaciones'

const getScaleHeaderColorClass = (value: number | undefined): string => {
  if (value === 100) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
  if (value === 75) return 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'
  if (value === 50) return 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300'
  if (value === 25) return 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300'

  return 'bg-gray-100 text-gray-700 dark:bg-meta-4 dark:text-gray-300'
}

const getTeacherName = (evaluationTeacher?: {
  first_name?: string
  last_name?: string
  user?: { email?: string }
}): string => {
  const fullName = `${evaluationTeacher?.first_name || ''} ${evaluationTeacher?.last_name || ''}`.trim()

  if (fullName) return fullName
  if (evaluationTeacher?.user?.email) return evaluationTeacher.user.email

  return 'No disponible'
}

const ConsultarRubrica = () => {
  const { id } = useParams<{ id: string }>()

  const {
    evaluaciones,
    loading,
    error,
    selectedEvaluation,
    rubric,
    criteria,
    loadRubricDetail,
    clearSelection
  } = useMisEvaluaciones()

  const evaluation = useMemo(() => {
    return evaluaciones.find((item) => item.id === id) ?? null
  }, [evaluaciones, id])

  useEffect(() => {
    if (!id || !evaluation) {
      return
    }

    void loadRubricDetail(evaluation)

    return () => {
      clearSelection()
    }
  }, [id, evaluation])

  const matrixHeaders = useMemo(() => {
    const firstCriterion = criteria[0]

    if (!firstCriterion?.scales || firstCriterion.scales.length === 0) {
      return []
    }

    return [...firstCriterion.scales].sort((left, right) => {
      return (right.value ?? 0) - (left.value ?? 0)
    })
  }, [criteria])

  const rubricSummary = useMemo(() => {
    if (!rubric) {
      return { totalCriteria: 0, totalWeight: 0 }
    }

    return misEvaluacionesBusiness.buildRubricSummary(rubric, criteria)
  }, [rubric, criteria])

  if (loading && !selectedEvaluation) {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl border border-stroke bg-white p-6 shadow-sm dark:border-strokedark dark:bg-boxdark">
          <div className="space-y-3 animate-pulse">
            <div className="h-4 w-52 rounded bg-gray-200 dark:bg-meta-4" />
            <div className="h-4 w-80 rounded bg-gray-200 dark:bg-meta-4" />
          </div>
        </div>

        <div className="rounded-3xl border border-stroke bg-white p-8 shadow-sm dark:border-strokedark dark:bg-boxdark">
          <div className="space-y-3 animate-pulse">
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-meta-4" />
            <div className="h-4 w-11/12 rounded bg-gray-200 dark:bg-meta-4" />
            <div className="h-4 w-10/12 rounded bg-gray-200 dark:bg-meta-4" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
        {error}
      </div>
    )
  }

  if (!id || !evaluation) {
    return (
      <div className="space-y-6">
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300">
          <Link to="/" className="transition hover:text-primary">Inicio</Link>
          <span>&gt;</span>
          <Link to="/mis-evaluaciones" className="transition hover:text-primary">Mis evaluaciones</Link>
          <span>&gt;</span>
          <span className="font-medium text-gray-700 dark:text-white">Rúbrica</span>
        </nav>

        <div className="rounded-3xl border border-stroke bg-white p-8 text-center shadow-sm dark:border-strokedark dark:bg-boxdark">
          <p className="text-sm text-gray-500 dark:text-gray-300">
            No se encontró la evaluación solicitada.
          </p>
        </div>
      </div>
    )
  }

  const hasRubric = misEvaluacionesBusiness.hasRubric(evaluation)
  const evaluationCode = misEvaluacionesBusiness.buildEvaluationCode(evaluation)
  const teacherName = getTeacherName(evaluation.group?.teacher)

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-300">
          <Link to="/" className="transition hover:text-primary">Inicio</Link>
          <span>&gt;</span>
          <Link to="/mis-evaluaciones" className="transition hover:text-primary">Mis evaluaciones</Link>
          <span>&gt;</span>
          <span className="font-medium text-gray-700 dark:text-white">{evaluation.name || 'Evaluación'}</span>
          <span>&gt;</span>
          <span className="font-medium text-gray-700 dark:text-white">Rúbrica</span>
        </nav>

        <Link
          to="/mis-evaluaciones"
          className="inline-flex items-center text-sm font-medium text-primary transition hover:underline"
        >
          ← Volver a mis evaluaciones
        </Link>
      </div>

      <section className="rounded-3xl border border-stroke bg-white p-6 shadow-sm dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-black dark:text-white">
              {evaluation.name || 'Evaluación sin nombre'}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
              Código {evaluationCode}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
              Rúbrica asociada
            </span>
            <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
              Publicada
            </span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-stroke bg-gray-50 p-4 dark:border-strokedark dark:bg-meta-4/40">
            <p className="text-xs font-medium uppercase tracking-wide text-meta-3 dark:text-meta-2">Tipo</p>
            <p className="mt-1 text-sm font-semibold text-black dark:text-white">
              {hasRubric ? 'Con rúbrica' : 'Sin rúbrica'}
            </p>
          </div>
          <div className="rounded-xl border border-stroke bg-gray-50 p-4 dark:border-strokedark dark:bg-meta-4/40">
            <p className="text-xs font-medium uppercase tracking-wide text-meta-3 dark:text-meta-2">Peso</p>
            <p className="mt-1 text-sm font-semibold text-black dark:text-white">{evaluation.weight ?? 0}%</p>
          </div>
          <div className="rounded-xl border border-stroke bg-gray-50 p-4 dark:border-strokedark dark:bg-meta-4/40">
            <p className="text-xs font-medium uppercase tracking-wide text-meta-3 dark:text-meta-2">Asignatura</p>
            <p className="mt-1 text-sm font-semibold text-black dark:text-white">
              {evaluation.subject ? `${evaluation.subject.name || 'Sin nombre'} (${evaluation.subject.code || '---'})` : 'No disponible'}
            </p>
          </div>
          <div className="rounded-xl border border-stroke bg-gray-50 p-4 dark:border-strokedark dark:bg-meta-4/40">
            <p className="text-xs font-medium uppercase tracking-wide text-meta-3 dark:text-meta-2">Grupo</p>
            <p className="mt-1 text-sm font-semibold text-black dark:text-white">
              {evaluation.group ? `${evaluation.group.name || 'Sin nombre'} (${evaluation.group.group_code || '---'})` : 'No disponible'}
            </p>
          </div>
          <div className="rounded-xl border border-stroke bg-gray-50 p-4 dark:border-strokedark dark:bg-meta-4/40 md:col-span-2 xl:col-span-4">
            <p className="text-xs font-medium uppercase tracking-wide text-meta-3 dark:text-meta-2">Docente</p>
            <p className="mt-1 text-sm font-semibold text-black dark:text-white">{teacherName}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(280px,1fr)]">
        <section className="rounded-3xl border border-stroke bg-white p-6 shadow-sm dark:border-strokedark dark:bg-boxdark">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stroke pb-5 dark:border-strokedark">
            <div>
              <h2 className="text-xl font-semibold text-black dark:text-white">
                {rubric?.title || 'Rúbrica sin título'}
              </h2>
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                  Pública
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
            >
              Descargar rúbrica
            </button>
          </div>

          <p className="mt-5 text-sm text-meta-3 dark:text-meta-2">
            {rubric?.description || 'Sin descripción para esta rúbrica.'}
          </p>

          <div className="mt-6 overflow-x-auto rounded-xl border border-stroke dark:border-strokedark">
            <table className="min-w-full border-separate border-spacing-0 text-left text-sm text-black dark:text-white">
              <thead>
                <tr className="border-b border-stroke dark:border-strokedark">
                  <th className="sticky left-0 z-10 min-w-[260px] bg-white px-4 py-3 font-semibold text-meta-3 dark:bg-boxdark dark:text-meta-2">
                    Criterio (Peso)
                  </th>
                  {matrixHeaders.map((scale) => (
                    <th
                      key={scale.id || `scale-${scale.value}`}
                      className={`min-w-[180px] px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide ${getScaleHeaderColorClass(scale.value)}`}
                    >
                      <p>{scale.name || `Nivel ${scale.value ?? '-'}`}</p>
                      <p className="mt-1 text-[11px]">{scale.value ?? 0}%</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {criteria.map((criterion, criterionIndex) => (
                  <tr
                    key={criterion.id || `criterion-${criterionIndex}`}
                    className="border-b border-stroke transition hover:bg-gray-50 dark:border-strokedark dark:hover:bg-meta-4"
                  >
                    <td className="sticky left-0 z-10 bg-white px-4 py-4 align-top dark:bg-boxdark">
                      <p className="text-sm font-semibold text-black dark:text-white">
                        {criterion.name || 'Criterio sin nombre'} ({criterion.weight ?? 0}%)
                      </p>
                      <p className="mt-1 text-xs text-meta-3 dark:text-meta-2">
                        {criterion.description || 'Sin descripción'}
                      </p>
                    </td>

                    {matrixHeaders.map((headerScale) => {
                      const currentScale = (criterion.scales || []).find((scale) => {
                        return (scale.value ?? 0) === (headerScale.value ?? 0)
                      })

                      return (
                        <td
                          key={`${criterion.id || criterionIndex}-${headerScale.id || headerScale.value}`}
                          className="px-4 py-4 align-top text-sm text-meta-3 dark:text-meta-2"
                        >
                          {currentScale?.description || '—'}
                        </td>
                      )
                    })}
                  </tr>
                ))}

                {criteria.length === 0 && (
                  <tr>
                    <td
                      colSpan={Math.max(matrixHeaders.length + 1, 2)}
                      className="px-4 py-8 text-center text-sm text-meta-3 dark:text-meta-2"
                    >
                      No hay criterios disponibles para esta rúbrica.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:border-emerald-700/40 dark:bg-emerald-950/20 dark:text-emerald-200">
            La suma de los pesos de los criterios es 100 %
          </div>
        </section>

        <aside className="space-y-4">
          <section className="rounded-3xl border border-stroke bg-white p-6 shadow-sm dark:border-strokedark dark:bg-boxdark">
            <h3 className="text-base font-semibold text-black dark:text-white">Información de la rúbrica</h3>

            <div className="mt-4 space-y-3 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-meta-3 dark:text-meta-2">Título</p>
                <p className="mt-1 font-medium text-black dark:text-white">{rubric?.title || 'No disponible'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-meta-3 dark:text-meta-2">Estado</p>
                <p className="mt-1 font-medium text-black dark:text-white">Pública</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-meta-3 dark:text-meta-2">Fecha de publicación</p>
                <p className="mt-1 font-medium text-black dark:text-white">
                  {rubric?.created_at
                    ? new Intl.DateTimeFormat('es-CO', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    }).format(new Date(rubric.created_at))
                    : 'No disponible'}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-meta-3 dark:text-meta-2">Cantidad de criterios</p>
                <p className="mt-1 font-medium text-black dark:text-white">{rubricSummary.totalCriteria}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-meta-3 dark:text-meta-2">Suma de pesos</p>
                <p className="mt-1 font-medium text-black dark:text-white">{rubricSummary.totalWeight}%</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-meta-3 dark:text-meta-2">Asignatura</p>
                <p className="mt-1 font-medium text-black dark:text-white">{evaluation.subject?.name || 'No disponible'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-meta-3 dark:text-meta-2">Evaluación</p>
                <p className="mt-1 font-medium text-black dark:text-white">{evaluation.name || 'No disponible'}</p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-stroke bg-white p-6 shadow-sm dark:border-strokedark dark:bg-boxdark">
            <h3 className="text-base font-semibold text-black dark:text-white">¿Qué es esta rúbrica?</h3>
            <p className="mt-3 text-sm text-meta-3 dark:text-meta-2">
              Esta rúbrica describe los criterios y niveles de desempeño con los que se evaluará tu actividad.
              Te permite entender cómo se distribuye la calificación y qué se espera en cada nivel.
            </p>
          </section>

          <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm dark:border-amber-700/40 dark:bg-amber-950/20">
            <h3 className="text-base font-semibold text-amber-900 dark:text-amber-100">Recordatorio</h3>
            <p className="mt-3 text-sm text-amber-800 dark:text-amber-200">
              Revisa cada criterio antes de entregar tu actividad. La rúbrica se mantiene en modo lectura y sirve
              como guía para planificar tu trabajo y mejorar tu resultado final.
            </p>
          </section>
        </aside>
      </div>
    </div>
  )
}

export default ConsultarRubrica
