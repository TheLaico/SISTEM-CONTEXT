import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'

import { RootState } from '../store/store'
import { Group } from '../models/Group'
import {
  GroupCardData,
  GroupUIFilters,
  EMPTY_GROUP_UI_FILTERS,
  groupBusiness,
} from '../business/GroupBusiness'
import { groupService } from '../services/groupService'
import {
  getEvaluationsByGroup,
  getGradesByGroup,
  getRubricsByGroup,
} from '../services/evaluacionService'

interface UseGruposDocenteResult {
  groupCards: GroupCardData[]       // cards filtradas — para el grid
  allCards: GroupCardData[]         // cards sin filtrar — para el select de semestres
  groups: Group[]                   // modelo de dominio (por si se necesita en otros hooks)
  isLoading: boolean
  error: string | null
  filters: GroupUIFilters
  setFilters: React.Dispatch<React.SetStateAction<GroupUIFilters>>
  uniqueSemesters: string[]
}

const useGruposDocente = (): UseGruposDocenteResult => {
  const user = useSelector((state: RootState) => state.user.user)

  const [groups, setGroups] = useState<Group[]>([])
  const [enrichedCards, setEnrichedCards] = useState<GroupCardData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<GroupUIFilters>(EMPTY_GROUP_UI_FILTERS)

  // ── Carga + enriquecimiento ────────────────────────────────────────────────
  useEffect(() => {
    if (!user?.id) return

    const fetchGrupos = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // 1. Grupos del docente filtrados por semestre activo
        const raw = await groupService.getGroupsByTeacher(user.id!)
        const filtered = groupBusiness.filterActiveGroups(raw)
        setGroups(filtered)

        // 2. Cards base (hasEvaluations y hasLockedGrades = false)
        const baseCards = groupBusiness.mapGroupsToCards(filtered)

        // 3. Enriquecer en paralelo; fallo parcial no bloquea el resto
        const enriched = await Promise.all(
          baseCards.map(async (card) => {
            try {
              const [evaluations, grades, rubrics] = await Promise.all([
                getEvaluationsByGroup(card.id),
                getGradesByGroup(card.id),
                getRubricsByGroup(card.id),
              ])
              return groupBusiness.enrichGroupCard(card, evaluations, grades, rubrics)
            } catch (err) {
              console.error(
                `Error al enriquecer grupo ${card.id} (${card.name}):`,
                err
              )
              return card
            }
          })
        )

        setEnrichedCards(enriched)
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Error al cargar los grupos'
        setError(msg)
        toast.error(msg)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGrupos()
  }, [user?.id])

  // ── Derivados síncronos ───────────────────────────────────────────────────

  /** Cards sin filtrar → fuente de verdad para selects y contadores */
  const allCards = enrichedCards

  /** Opciones únicas de semestre extraídas del total (no del filtrado) */
  const uniqueSemesters = useMemo(
    () => groupBusiness.getUniqueSemesters(allCards),
    [allCards]
  )

  /** Cards visibles tras aplicar los filtros de UI */
  const groupCards = useMemo(
    () => groupBusiness.filterGroups(allCards, filters),
    [allCards, filters]
  )

  return {
    groupCards,
    allCards,
    groups,
    isLoading,
    error,
    filters,
    setFilters,
    uniqueSemesters,
  }
}

export default useGruposDocente