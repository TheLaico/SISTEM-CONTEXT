// src/hooks/useInscripciones.ts
// Re-exports useEnrollments under the Spanish alias used in ListInscripciones
import useEnrollments from './useEnrollment'

const useInscripciones = () => {
  const { enrollments, loading, error, refresh } = useEnrollments()
  return { inscripciones: enrollments, loading, error, refresh }
}

export default useInscripciones