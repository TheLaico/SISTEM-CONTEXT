// src/pages/Inscripciones/components/AvailableGroupsTable.tsx
import React, { useMemo, useState } from 'react'
import { Group } from '../../../models/Group'
import { GroupTableRow } from '../../../types/enrollmentFlow'

interface Props {
  groupRows: GroupTableRow[]
  allGroups: Group[]
  selectedGroups: Group[]
  studyPlanSubjectIds: string[]
  dismissedWarnings: Set<string>
  onToggleGroup: (group: Group) => void
  onWarningGroup: (group: Group) => void
  disabled?: boolean
}

const CapacityBadge: React.FC<{ available: number; total: number }> = ({ available, total }) => {
  const pct = total > 0 ? available / total : 0
  const color =
    available === 0
      ? 'text-danger'
      : pct <= 0.2
      ? 'text-warning'
      : 'text-meta-3'

  return (
    <span className={`text-sm font-semibold ${color}`}>
      {available === 0 ? 'Grupo lleno' : `${available} / ${total}`}
    </span>
  )
}

const AvailableGroupsTable: React.FC<Props> = ({
  groupRows,
  allGroups,
  selectedGroups,
  studyPlanSubjectIds,
  dismissedWarnings,
  onToggleGroup,
  onWarningGroup,
  disabled,
}) => {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const perPage = 8

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return groupRows
    return groupRows.filter(
      (r) =>
        r.groupCode.toLowerCase().includes(q) ||
        r.subjectName.toLowerCase().includes(q) ||
        r.subjectCode.toLowerCase().includes(q) ||
        r.teacherName.toLowerCase().includes(q)
    )
  }, [groupRows, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const displayed = useMemo(
    () => filtered.slice((page - 1) * perPage, page * perPage),
    [filtered, page]
  )

  const isGroupSelected = (rowId: string) =>
    selectedGroups.some((g) => String(g.id) === rowId)

  const isOutsidePlan = (subjectCode: string, rowId: string) => {
    // verificar si la asignatura del grupo está en el plan
    const group = allGroups.find((g) => String(g.id) === rowId)
    if (!group?.subject_id) return false
    return !studyPlanSubjectIds.includes(String(group.subject_id))
  }

  const handleCheck = (row: GroupTableRow) => {
    if (row.availableCapacity <= 0) return
    const group = allGroups.find((g) => String(g.id) === row.id)
    if (!group) return

    const outOfPlan =
      group.subject_id &&
      !studyPlanSubjectIds.includes(String(group.subject_id)) &&
      !dismissedWarnings.has(row.id) &&
      !isGroupSelected(row.id)

    if (outOfPlan) {
      onWarningGroup(group)
    } else {
      onToggleGroup(group)
    }
  }

  return (
    <div className="rounded-2xl border border-stroke bg-white shadow-card dark:border-strokedark dark:bg-boxdark">
      <div className="flex items-center justify-between border-b border-stroke px-5 py-4 dark:border-strokedark">
        <div>
          <h3 className="text-base font-semibold text-black dark:text-white">Grupos disponibles</h3>
          <p className="mt-0.5 text-xs text-body dark:text-bodydark">
            Solo grupos del semestre activo
          </p>
        </div>
        <span className="rounded-full bg-primary bg-opacity-10 px-3 py-1 text-xs font-semibold text-primary">
          {groupRows.length} grupos
        </span>
      </div>

      <div className="p-5">
        {/* Buscador */}
        <div className="relative mb-4">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-body" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Buscar por asignatura, grupo o docente..."
            className="w-full rounded-lg border border-stroke py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
          />
        </div>

        {disabled ? (
          <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed border-stroke py-10 text-sm text-body dark:border-strokedark dark:text-bodydark">
            Selecciona un estudiante con matrícula activa para ver los grupos disponibles.
          </div>
        ) : displayed.length === 0 ? (
          <div className="py-10 text-center text-sm text-body dark:text-bodydark">
            {search ? 'Sin resultados para la búsqueda.' : 'No hay grupos disponibles en el semestre activo.'}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg border border-stroke dark:border-strokedark">
              <table className="min-w-full divide-y divide-stroke text-sm dark:divide-strokedark">
                <thead className="bg-gray dark:bg-meta-4">
                  <tr>
                    <th className="w-8 px-3 py-3" />
                    {['Código', 'Asignatura', 'Docente', 'Créditos', 'Cupos', 'Estado'].map((col) => (
                      <th key={col} className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-body dark:text-bodydark">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stroke dark:divide-strokedark">
                  {displayed.map((row) => {
                    const selected = isGroupSelected(row.id)
                    const full = row.availableCapacity <= 0
                    const outPlan = isOutsidePlan(row.subjectCode, row.id)

                    return (
                      <tr
                        key={row.id}
                        onClick={() => !full && handleCheck(row)}
                        className={`cursor-pointer transition ${
                          selected
                            ? 'bg-primary bg-opacity-5'
                            : full
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-gray dark:hover:bg-meta-4'
                        }`}
                      >
                        <td className="px-3 py-3">
                          <input
                            type="checkbox"
                            readOnly
                            checked={selected}
                            disabled={full}
                            className="h-4 w-4 accent-primary"
                          />
                        </td>
                        <td className="px-3 py-3 font-medium text-black dark:text-white">
                          {row.groupCode}
                          {outPlan && (
                            <span className="ml-1.5 inline-flex rounded-full bg-warning bg-opacity-10 px-1.5 py-0.5 text-xs text-warning">
                              Fuera del plan
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-3 text-black dark:text-white">
                          <div>
                            <p>{row.subjectName}</p>
                            <p className="text-xs text-body dark:text-bodydark font-mono">{row.subjectCode}</p>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-black dark:text-white">{row.teacherName || '—'}</td>
                        <td className="px-3 py-3 text-center font-semibold text-black dark:text-white">
                          {row.credits}
                        </td>
                        <td className="px-3 py-3">
                          <CapacityBadge available={row.availableCapacity} total={row.totalCapacity} />
                        </td>
                        <td className="px-3 py-3">
                          {full ? (
                            <span className="inline-flex rounded-full bg-danger bg-opacity-10 px-2.5 py-1 text-xs font-semibold text-danger">
                              Lleno
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-meta-3 bg-opacity-10 px-2.5 py-1 text-xs font-semibold text-meta-3">
                              Disponible
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div className="mt-3 flex items-center justify-between text-xs text-body dark:text-bodydark">
              <span>
                {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} de {filtered.length}
              </span>
              <div className="flex gap-1">
                <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="rounded border border-stroke px-2 py-1 disabled:opacity-40 dark:border-strokedark">‹</button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                  <button key={i} type="button" onClick={() => setPage(i + 1)} className={`rounded px-2 py-1 ${page === i + 1 ? 'bg-primary text-white' : 'border border-stroke dark:border-strokedark'}`}>{i + 1}</button>
                ))}
                <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="rounded border border-stroke px-2 py-1 disabled:opacity-40 dark:border-strokedark">›</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AvailableGroupsTable