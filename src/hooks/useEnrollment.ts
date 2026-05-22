// src/hooks/useEnrollments.ts

import {
  useEffect,
  useState
} from 'react'

import { Enrollment } from '../models/Enrollment'

import { enrollmentBusiness } from '../business/EnrollmentBusiness'

const useEnrollments = () => {
  const [enrollments, setEnrollments] =
    useState<Enrollment[]>([])

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  const refresh = async () => {
    try {
      setLoading(true)

      const data =
        await enrollmentBusiness.getEnrollments()

      setEnrollments(data)

      setError(null)
    } catch (err) {
      setError(
        'Could not load enrollments'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  return {
    enrollments,
    loading,
    error,
    refresh
  }
}

export default useEnrollments