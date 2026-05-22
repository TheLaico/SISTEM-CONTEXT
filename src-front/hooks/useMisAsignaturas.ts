import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { getAsignaturasDelSemestreActivo, AsignaturaDelSemestre } from '../business/MisAsignaturasBusiness'
import { enrollmentService } from '../services/enrollmentService'
import { RootState } from '../store/store'

const useMisAsignaturas = () => {
  const user = useSelector((state: RootState) => state.user.user)

  const [asignaturas, setAsignaturas] = useState<AsignaturaDelSemestre[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadAsignaturas = async () => {
      if (!user?.id) {
        setAsignaturas([])
        setError(null)
        setLoading(false)
        return
      }

      setLoading(true)

      try {
        const [enrollments, groups, semesters, subjects] = await Promise.all([
          enrollmentService.getEnrollmentsByStudentId(Number(user.id)),
          enrollmentService.getGroups(),
          enrollmentService.getSemesters(),
          enrollmentService.getSubjects()
        ])

        const result = getAsignaturasDelSemestreActivo(
          semesters,
          enrollments,
          groups,
          subjects
        )

        if (isMounted) {
          setAsignaturas(result)
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : 'Error al cargar asignaturas'
          setError(message)
          setAsignaturas([])
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadAsignaturas()

    return () => {
      isMounted = false
    }
  }, [user?.id])

  return {
    asignaturas,
    loading,
    error
  }
}

export default useMisAsignaturas
