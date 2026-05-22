// src/hooks/useGroups.ts

import { useEffect, useState } from 'react'

import { Group } from '../models/Group'

import { groupBusiness } from '../business/GroupBusiness'

const useGroups = () => {
  const [groups, setGroups] = useState<
    Group[]
  >([])

  const [loading, setLoading] =
    useState(false)

  const [error, setError] = useState<
    string | null
  >(null)

  const refresh = async () => {
    try {
      setLoading(true)

      const data =
        await groupBusiness.getGroups()

      setGroups(data)

      setError(null)
    } catch (err) {
      console.error(err)

      setError(
        'Could not load groups'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  return {
    groups,
    loading,
    error,
    refresh
  }
}

export default useGroups