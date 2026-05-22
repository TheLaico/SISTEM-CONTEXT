import { useNavigate } from 'react-router-dom'
import { SearchX } from 'lucide-react'

import useGruposDocente from '../../hooks/useGruposDocente'
import GroupCard from '../../components/Group/GroupCard'
import GroupFiltersBar from '../../components/Group/GroupFiltersBar'
import { EMPTY_GROUP_UI_FILTERS } from '../../business/GroupBusiness'

const MisGrupos = () => {
  const navigate = useNavigate()
  const {
    groupCards,
    allCards,
    isLoading,
    error,
    filters,
    setFilters,
    uniqueSemesters,
  } = useGruposDocente()

  const handleVerDetalle = (groupId: string) => {
    navigate(`/teacher/grupos/detalle?groupId=${groupId}`)
  }

  const isFiltering =
    !!(filters.searchSubject || filters.searchCode || filters.semesterName || filters.groupStatus)

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">

      {/* Encabezado */}
      <div className="mb-6">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Mis grupos
        </h2>
        <p className="text-sm text-bodydark2 mt-1">
          {isLoading
            ? 'Cargando grupos...'
            : `${allCards.length} grupo${allCards.length !== 1 ? 's' : ''} asignado${allCards.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Estado: cargando */}
      {isLoading && (
        <p className="text-sm text-bodydark2">Cargando grupos...</p>
      )}

      {/* Estado: error */}
      {!isLoading && error && (
        <p className="text-sm text-danger">{error}</p>
      )}

      {/* Sin grupos en absoluto (no hay nada asignado) */}
      {!isLoading && !error && allCards.length === 0 && (
        <p className="text-sm text-bodydark2">
          No tienes grupos asignados en el semestre activo.
        </p>
      )}

      {/* Barra de filtros + grid — solo cuando hay datos */}
      {!isLoading && !error && allCards.length > 0 && (
        <>
          <GroupFiltersBar
            filters={filters}
            uniqueSemesters={uniqueSemesters}
            totalGroups={allCards.length}
            filteredCount={groupCards.length}
            onChange={setFilters}
            onReset={() => setFilters(EMPTY_GROUP_UI_FILTERS)}
          />

          {/* Sin resultados tras filtrar */}
          {groupCards.length === 0 && isFiltering && (
            <div className="flex flex-col items-center gap-3 py-12 text-bodydark2">
              <SearchX size={40} className="opacity-50" />
              <p className="text-sm">
                No se encontraron grupos con los filtros aplicados.
              </p>
            </div>
          )}

          {/* Grid de tarjetas */}
          {groupCards.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {groupCards.map((card) => (
                <GroupCard
                  key={card.id}
                  card={card}
                  onVerDetalle={handleVerDetalle}
                />
              ))}
            </div>
          )}
        </>
      )}

    </div>
  )
}

export default MisGrupos