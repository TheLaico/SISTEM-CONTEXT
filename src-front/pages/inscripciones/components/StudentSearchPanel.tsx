// src/pages/Inscripciones/components/StudentSearchPanel.tsx
import React, { useMemo, useState } from 'react'
import { Student } from '../../../models/Student'
import { Registration } from '../../../models/Registration'

interface Props {
  searchQuery: string
  onSearchChange: (q: string) => void
  searchResults: Student[]
  selectedStudent: Student | null
  studentRegistration: Registration | null
  isSearching: boolean
  onSelectStudent: (student: Student) => void
}

const StudentSearchPanel: React.FC<Props> = ({
  searchQuery,
  onSearchChange,
  searchResults,
  selectedStudent,
  studentRegistration,
  isSearching,
  onSelectStudent,
}) => {
  const [page, setPage] = useState(1)
  const perPage = 5

  const totalPages = Math.max(1, Math.ceil(searchResults.length / perPage))
  const displayed = useMemo(
    () => searchResults.slice((page - 1) * perPage, page * perPage),
    [searchResults, page]
  )

  const getStudentName = (s: Student) =>
    `${s.first_name || s.user?.profile?.first_name || ''} ${s.last_name || s.user?.profile?.last_name || ''}`.trim() || '—'

  const getStudentId = (s: Student) =>
    s.id || s.user_id || s.user?.id || s.user?.profile?.id || ''

  const getIdentification = (s: Student) =>
    s.identification || s.user?.profile?.identification || '—'

  const hasActiveRegistration = studentRegistration?.is_active === true

  return (
    <div className="rounded-2xl border border-stroke bg-white shadow-card dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke px-5 py-4 dark:border-strokedark">
        <h3 className="text-base font-semibold text-black dark:text-white">Buscar estudiante</h3>
        <p className="mt-0.5 text-xs text-body dark:text-bodydark">
          Busca por nombre, código o cédula
        </p>
      </div>

      <div className="p-5">
        {/* Input búsqueda */}
        <div className="relative mb-4">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-body"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value)
              setPage(1)
            }}
            placeholder="Nombre, código o cédula..."
            className="w-full rounded-lg border border-stroke py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
          />
          {isSearching && (
            <span className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          )}
        </div>

        {/* Tabla de resultados */}
        {searchResults.length > 0 && (
          <>
            <div className="mb-3 overflow-x-auto rounded-lg border border-stroke dark:border-strokedark">
              <table className="min-w-full divide-y divide-stroke text-sm dark:divide-strokedark">
                <thead className="bg-gray dark:bg-meta-4">
                  <tr>
                    <th className="w-8 px-3 py-2" />
                    <th className="px-3 py-2 text-left text-xs font-semibold text-body dark:text-bodydark">Estudiante</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-body dark:text-bodydark">Cédula</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-body dark:text-bodydark">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stroke dark:divide-strokedark">
                  {displayed.map((student) => {
                    const sid = String(getStudentId(student))
                    const selId = selectedStudent
                      ? String(getStudentId(selectedStudent))
                      : ''
                    const isSelected = sid === selId
                    const isActive = student.user?.is_active ?? true

                    return (
                      <tr
                        key={sid}
                        onClick={() => onSelectStudent(student)}
                        className={`cursor-pointer transition ${
                          isSelected
                            ? 'bg-primary bg-opacity-5'
                            : 'hover:bg-gray dark:hover:bg-meta-4'
                        }`}
                      >
                        <td className="px-3 py-2.5">
                          <input
                            type="radio"
                            readOnly
                            checked={isSelected}
                            className="h-4 w-4 accent-primary"
                          />
                        </td>
                        <td className="px-3 py-2.5 font-medium text-black dark:text-white">
                          {getStudentName(student)}
                        </td>
                        <td className="px-3 py-2.5 text-body dark:text-bodydark">
                          {getIdentification(student)}
                        </td>
                        <td className="px-3 py-2.5">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${isActive ? 'bg-meta-3 bg-opacity-10 text-meta-3' : 'bg-danger bg-opacity-10 text-danger'}`}>
                            {isActive ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div className="flex items-center justify-between text-xs text-body dark:text-bodydark">
              <span>
                {(page - 1) * perPage + 1}–{Math.min(page * perPage, searchResults.length)} de {searchResults.length}
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded border border-stroke px-2 py-1 disabled:opacity-40 dark:border-strokedark"
                >‹</button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPage(i + 1)}
                    className={`rounded px-2 py-1 ${page === i + 1 ? 'bg-primary text-white' : 'border border-stroke dark:border-strokedark'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded border border-stroke px-2 py-1 disabled:opacity-40 dark:border-strokedark"
                >›</button>
              </div>
            </div>
          </>
        )}

        {searchQuery.length > 2 && !isSearching && searchResults.length === 0 && (
          <p className="py-6 text-center text-sm text-body dark:text-bodydark">
            No se encontraron estudiantes con ese criterio.
          </p>
        )}

        {searchQuery.length <= 2 && !selectedStudent && (
          <p className="py-4 text-center text-sm text-body dark:text-bodydark">
            Escribe al menos 3 caracteres para buscar.
          </p>
        )}

        {/* Card del estudiante seleccionado */}
        {selectedStudent && (
          <div className={`mt-4 rounded-xl border p-4 ${
            hasActiveRegistration
              ? 'border-meta-3 bg-meta-3 bg-opacity-5'
              : 'border-danger bg-danger bg-opacity-5'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                hasActiveRegistration ? 'bg-meta-3 bg-opacity-20 text-meta-3' : 'bg-danger bg-opacity-20 text-danger'
              }`}>
                {getStudentName(selectedStudent).charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-black dark:text-white">
                  {getStudentName(selectedStudent)}
                </p>
                <p className="text-xs text-body dark:text-bodydark">
                  {getIdentification(selectedStudent)}
                </p>
              </div>
            </div>

            {studentRegistration ? (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-body dark:text-bodydark">Carrera</p>
                  <p className="font-medium text-black dark:text-white">
                    {studentRegistration.career?.name || `ID: ${studentRegistration.career_id}`}
                  </p>
                </div>
                <div>
                  <p className="text-body dark:text-bodydark">Periodo ingreso</p>
                  <p className="font-medium text-black dark:text-white">
                    {studentRegistration.admission_period || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-body dark:text-bodydark">Estado académico</p>
                  <p className="font-medium text-black dark:text-white">
                    {studentRegistration.academic_status || 'Activo'}
                  </p>
                </div>
                <div>
                  <p className="text-body dark:text-bodydark">Matrícula</p>
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                    hasActiveRegistration
                      ? 'bg-meta-3 bg-opacity-10 text-meta-3'
                      : 'bg-danger bg-opacity-10 text-danger'
                  }`}>
                    {hasActiveRegistration ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-danger font-medium">
                ⚠ El estudiante no posee matrícula activa. No puede inscribirse en grupos.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentSearchPanel