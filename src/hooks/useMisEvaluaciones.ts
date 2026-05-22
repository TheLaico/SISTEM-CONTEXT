import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { misEvaluacionesBusiness } from '../business/MisEvaluacionesBusiness'
import { enrollmentService } from '../services/enrollmentService'
import { misEvaluacionesService } from '../services/misEvaluacionesService'
import { Criterion } from '../models/Criterion'
import { Evaluation } from '../models/Evaluation'
import { Rubric } from '../models/Rubric'
import { RootState } from '../store/store'

const useMisEvaluaciones = () => {
  const user = useSelector((state: RootState) => state.user.user)

  const [evaluaciones, setEvaluaciones] = useState<Evaluation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null)
  const [rubric, setRubric] = useState<Rubric | null>(null)
  const [criteria, setCriteria] = useState<Criterion[]>([])

  useEffect(() => {
    let isMounted = true

    const loadEvaluaciones = async () => {
      if (!user?.id) {
        setEvaluaciones([])
        setError(null)
        setLoading(false)
        return
      }

      setLoading(true)

      try {
        const enrollmentsPromise = enrollmentService.getEnrollmentsByStudentId(Number(user.id))

        const evaluationsPromise = enrollmentsPromise.then((enrollments) => {
          const groupIds = enrollments
            .map((enrollment) => String(enrollment.group_id))
            .filter((groupId) => Boolean(groupId))

          return misEvaluacionesService.getEvaluationsByGroupIds(groupIds)
        })

        const [enrollments, evaluations] = await Promise.all([
          enrollmentsPromise,
          evaluationsPromise
        ])

        const groupIds = enrollments
          .map((enrollment) => String(enrollment.group_id))
          .filter((groupId) => Boolean(groupId))

        const result = misEvaluacionesBusiness.filterEvaluationsByGroups(
          evaluations,
          groupIds
        )

        if (isMounted) {
          setEvaluaciones(result)
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : 'Error al cargar evaluaciones'
          setError(message)
          setEvaluaciones([])
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadEvaluaciones()

    return () => {
      isMounted = false
    }
  }, [user?.id])

  const loadRubricDetail = async (evaluation: Evaluation): Promise<void> => {
    if (!evaluation.rubric_id) {
      setSelectedEvaluation(evaluation)
      setRubric(null)
      setCriteria([])
      return
    }

    setLoading(true)

    try {
      const [rubricData, criteriaData] = await Promise.all([
        misEvaluacionesService.getRubricById(evaluation.rubric_id),
        misEvaluacionesService.getCriteriaByRubricId(evaluation.rubric_id)
      ])

      setSelectedEvaluation(evaluation)
      setRubric(rubricData)
      setCriteria(criteriaData)
      setError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar detalle de rúbrica'
      setError(message)
      setSelectedEvaluation(evaluation)
      setRubric(null)
      setCriteria([])
    } finally {
      setLoading(false)
    }
  }

  const clearSelection = (): void => {
    setSelectedEvaluation(null)
    setRubric(null)
    setCriteria([])
  }

  return {
    evaluaciones,
    loading,
    error,
    selectedEvaluation,
    rubric,
    criteria,
    loadRubricDetail,
    clearSelection
  }
}

export default useMisEvaluaciones
