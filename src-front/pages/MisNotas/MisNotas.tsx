import { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { TiDownload } from 'react-icons/ti'
import { useSelector } from 'react-redux'

import { misNotasBusiness } from '../../business/MisNotasBusiness'
import useMisNotas from '../../hooks/useMisNotas'
import { RootState } from '../../store/store'
import { generarReportePDF } from '../../utils/generarReportePDF'

const getScoreBadgeColor = (score: number | null): string => {
  if (score === null) return 'bg-gray-100 text-gray-700 dark:bg-meta-4 dark:text-gray-300'
  if (score >= 90) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
  if (score >= 70) return 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'
  if (score >= 50) return 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300'
  return 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300'
}

const getStatusBadgeColor = (status: string): string => {
  const color = misNotasBusiness.getStatusColor(status)

  if (color === 'yellow') return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300'
  if (color === 'green') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'

  return 'bg-gray-100 text-gray-700 dark:bg-meta-4 dark:text-gray-300'
}

const MisNotas = () => {
  const { rows, loading, error, promedioPonderado } = useMisNotas()
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null)
  const user = useSelector((state: RootState) => state.user.user)
  const studentName = (user as { name?: string } | null)?.name?.trim() || 'estudiante'

  const handleDownloadReport = () => {
    generarReportePDF({
      rows,
      promedioPonderado,
      studentName,
    })
  }

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300">
        <Link to="/" className="transition hover:text-primary">
          Inicio
        </Link>
        <span>&gt;</span>
        <span className="font-medium text-gray-700 dark:text-white">Mis notas</span>
      </nav>

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black dark:text-white">
            Mis notas
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Consulta las calificaciones registradas en tus evaluaciones.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadReport}
          disabled={rows.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600 dark:disabled:bg-meta-4 dark:disabled:text-gray-400"
        >
          <TiDownload className="h-4 w-4" />
          Descargar reporte
        </button>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="rounded-3xl border border-stroke bg-white p-6 shadow-sm dark:border-strokedark dark:bg-boxdark">
            <div className="space-y-3 animate-pulse">
              <div className="h-4 w-40 rounded bg-gray-200 dark:bg-meta-4" />
              <div className="h-8 w-24 rounded bg-gray-200 dark:bg-meta-4" />
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
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
          {error}
        </div>
      ) : (
        <>
          <div className="rounded-3xl border border-stroke bg-white p-6 shadow-sm dark:border-strokedark dark:bg-boxdark">
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Promedio ponderado general
            </p>

            <div className="mt-3 flex items-center gap-3">
              <div className={`inline-flex rounded-full px-4 py-2 text-xl font-bold ${getScoreBadgeColor(promedioPonderado)}`}>
                {misNotasBusiness.formatScore(promedioPonderado)}
              </div>
            </div>
          </div>

          {rows.length === 0 ? (
            <div className="rounded-3xl border border-stroke bg-white p-8 text-center shadow-sm dark:border-strokedark dark:bg-boxdark">
              <p className="text-sm text-gray-500 dark:text-gray-300">
                No tienes notas registradas aún.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark">
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-0 text-left">
                  <thead className="bg-gray-50 dark:bg-meta-4">
                    <tr>
                      <th className="px-4 py-4 text-sm font-semibold text-gray-700 dark:text-white">
                        Evaluación
                      </th>
                      <th className="px-4 py-4 text-sm font-semibold text-gray-700 dark:text-white">
                        Asignatura
                      </th>
                      <th className="px-4 py-4 text-sm font-semibold text-gray-700 dark:text-white">
                        Grupo
                      </th>
                      <th className="px-4 py-4 text-sm font-semibold text-gray-700 dark:text-white">
                        Peso
                      </th>
                      <th className="px-4 py-4 text-sm font-semibold text-gray-700 dark:text-white">
                        Nota
                      </th>
                      <th className="px-4 py-4 text-sm font-semibold text-gray-700 dark:text-white">
                        Estado
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map((row, index) => (
                      <Fragment key={row.gradeId ?? `nota-${index}`}>
                        <tr
                          key={row.gradeId ?? `nota-${index}`}
                          className="border-t transition hover:bg-gray-50 dark:border-strokedark dark:hover:bg-meta-4"
                        >
                          <td className="px-4 py-4">
                            <button
                              type="button"
                              onClick={() => setExpandedRowId((current) => (current === row.gradeId ? null : row.gradeId))}
                              className="flex items-start gap-3 text-left"
                            >
                              <span className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-stroke text-xs font-semibold text-gray-600 dark:border-strokedark dark:text-gray-300">
                                {expandedRowId === row.gradeId ? '−' : '+'}
                              </span>
                              <span>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {row.evaluationName}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {row.evaluationCode}
                                </p>
                              </span>
                            </button>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                            {row.subjectName}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                            {row.groupName}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                            {row.weight}%
                          </td>
                          <td className={`px-4 py-4 text-sm font-semibold ${row.isLocked ? 'font-bold' : ''}`}>
                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getScoreBadgeColor(row.finalScore)}`}>
                              {misNotasBusiness.formatScore(row.finalScore)}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeColor(row.status)}`}
                            >
                              {misNotasBusiness.getStatusLabel(row.status)}
                            </span>
                          </td>
                        </tr>
                        {expandedRowId === row.gradeId && (
                          <tr className="border-t bg-gray-50 dark:border-strokedark dark:bg-meta-4/40">
                            <td colSpan={6} className="px-4 py-4">
                              <div className="overflow-hidden rounded-2xl border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                                <table className="min-w-full text-left text-sm">
                                  <thead className="bg-gray-50 dark:bg-meta-4">
                                    <tr>
                                      <th className="px-4 py-3 font-semibold text-gray-700 dark:text-white">Criterio</th>
                                      <th className="px-4 py-3 font-semibold text-gray-700 dark:text-white">Nivel obtenido</th>
                                      <th className="px-4 py-3 font-semibold text-gray-700 dark:text-white">Puntaje</th>
                                      <th className="px-4 py-3 font-semibold text-gray-700 dark:text-white">Comentario</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {row.details.length === 0 ? (
                                      <tr>
                                        <td colSpan={4} className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300">
                                          No hay desglose por criterio disponible.
                                        </td>
                                      </tr>
                                    ) : (
                                      row.details.map((detail, detailIndex) => (
                                        <tr key={`${row.gradeId}-${detailIndex}`} className="border-t border-stroke dark:border-strokedark">
                                          <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                                            <div>
                                              <p className="font-medium text-black dark:text-white">{detail.criterionName}</p>
                                              {detail.comment ? (
                                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{detail.comment}</p>
                                              ) : null}
                                            </div>
                                          </td>
                                          <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{detail.levelName}</td>
                                          <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{detail.score}</td>
                                          <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                                            {detail.comment?.trim() ? detail.comment : '—'}
                                          </td>
                                        </tr>
                                      ))
                                    )}
                                  </tbody>
                                </table>
                              </div>

                              {row.observations.trim() ? (
                                <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-700/40 dark:bg-emerald-950/20 dark:text-emerald-200">
                                  <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                                    Observación general
                                  </span>
                                  <p className="mt-2 text-sm leading-6">
                                    {row.observations}
                                  </p>
                                </div>
                              ) : null}
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default MisNotas
