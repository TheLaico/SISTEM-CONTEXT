// src/hooks/useRegistrations.ts

import {
  useEffect,
  useState
} from 'react'

import { Registration } from '../models/Registration'

import { registrationBusiness } from '../business/RegistrationBusiness'

const useRegistrations = () => {
  const [registrations, setRegistrations] =
    useState<Registration[]>([])

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  const refresh = async () => {
    try {
      setLoading(true)

      const data =
        await registrationBusiness.getRegistrations()

      setRegistrations(data)

      setError(null)
    } catch (err) {
      setError(
        'Could not load registrations'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  return {
    registrations,
    loading,
    error,
    refresh
  }
}

export default useRegistrations