import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { misNotasBusiness, NotaRow } from '../business/MisNotasBusiness'
import { GradeDetail } from '../models/GradeDetail'
import { misNotasService } from '../services/misNotasService'
import { RootState } from '../store/store'

type GradeDetailsMap = Record<string, GradeDetail[]>

const useMisNotas = () => {
  const user = useSelector((state: RootState) => state.user.user)

  const [rows, setRows] = useState<NotaRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [promedioPonderado, setPromedioPonderado] = useState<number | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadNotas = async () => {
      if (!user?.id) {
        setRows([])
        setPromedioPonderado(null)
        setError(null)
        setLoading(false)
        return
      }

      setLoading(true)

      try {
        const [grades, evaluations, enrollments, groups, subjects] = await Promise.all([
          misNotasService.getGradesByStudentId(String(user.id)),
          misNotasService.getEvaluations(),
          misNotasService.getEnrollmentsByStudentId(Number(user.id)),
          misNotasService.getGroups(),
          misNotasService.getSubjects()
        ])

        const gradeDetailsResults = await Promise.allSettled(
          grades.map(async (grade) => {
            const gradeId = String(grade.id ?? '')

            if (!gradeId) {
              return { gradeId, details: [] }
            }

            const details = await misNotasService.getGradeDetailsByGradeId(gradeId)

            return { gradeId, details }
          })
        )

        const gradeDetailsByGradeId = gradeDetailsResults.reduce<GradeDetailsMap>(
          (acc, result) => {
            if (result.status === 'fulfilled') {
              acc[result.value.gradeId] = result.value.details
            }

            return acc
          },
          {}
        )

        const notaRows = misNotasBusiness.buildNotaRows(
          grades,
          evaluations,
          enrollments,
          groups,
          subjects,
          gradeDetailsByGradeId
        )

        const promedio = misNotasBusiness.calcularPromedioPonderado(notaRows)

        if (isMounted) {
          setRows(notaRows)
          setPromedioPonderado(promedio)
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : 'Error al cargar notas'
          setError(message)
          setRows([])
          setPromedioPonderado(null)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadNotas()

    return () => {
      isMounted = false
    }
  }, [user?.id])

  return {
    rows,
    loading,
    error,
    promedioPonderado
  }
}

export default useMisNotas
