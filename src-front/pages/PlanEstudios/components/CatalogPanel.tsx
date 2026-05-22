import { useEffect, useMemo, useState } from 'react'

import { Subject } from '../../../models/Subject'

interface Props {
  subjects: Subject[]
  searchQuery: string
  onSearchChange: (q: string) => void
  onAddSubject: (subject: Subject) => void
}

const ITEMS_PER_PAGE = 8

const CatalogPanel = ({ subjects, searchQuery, onSearchChange, onAddSubject }: Props) => {
  const [currentPage, setCurrentPage] = useState(1)

  const filteredSubjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    if (!query) {
      return subjects
    }

    return subjects.filter((subject) => {
      return (
        subject.name.toLowerCase().includes(query) ||
        subject.code.toLowerCase().includes(query)
      )
    })
  }, [searchQuery, subjects])

  const totalPages = Math.max(1, Math.ceil(filteredSubjects.length / ITEMS_PER_PAGE))

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, subjects])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredSubjects.length)
  const visibleSubjects = filteredSubjects.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-black dark:text-white">Catálogo de asignaturas</h3>
          <p className="text-sm text-gray-500">Busca y agrega materias al plan activo.</p>
        </div>
      </div>

      <div className="mt-4 relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar por nombre o código"
          className="w-full rounded-lg border border-gray-200 bg-white px-10 py-2.5 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-100"
        />
      </div>

      <div className="mt-4 space-y-3">
        {visibleSubjects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
            No hay asignaturas disponibles.
          </div>
        ) : (
          visibleSubjects.map((subject) => (
            <div key={subject.id} className="flex items-start justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:border-green-200 hover:bg-green-50/40">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-green-700">{subject.code}</span>
                  <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                    {subject.credits} crédito{subject.credits === 1 ? '' : 's'}
                  </span>
                </div>
                <p className="mt-1 truncate text-sm font-medium text-gray-900">{subject.name}</p>
              </div>

              <button
                type="button"
                onClick={() => onAddSubject(subject)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-base font-semibold text-white transition hover:bg-green-700"
                aria-label={`Agregar ${subject.name}`}
              >
                +
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mt-5 border-t border-gray-100 pt-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Mostrando {filteredSubjects.length === 0 ? 0 : startIndex + 1} a {endIndex} de {filteredSubjects.length} asignaturas
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`min-w-9 rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                  page === currentPage
                    ? 'border-green-600 bg-green-600 text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-green-300 hover:text-green-700'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CatalogPanel