import { useState } from 'react'

import {
    CreateSubjectDto,
    Subject,
    UpdateSubjectDto
} from '../models/Subject'

import { subjectBusiness } from '../business/subjectBusiness'

export const useSubject = () => {
  const [subjects, setSubjects] =
    useState<Subject[]>([])

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  const fetchSubjects = async () => {
    try {
      setLoading(true)

      const data =
        await subjectBusiness.getSubjects()

      setSubjects(data)
    } catch (err) {
      console.error(err)

      setError('Error fetching subjects')
    } finally {
      setLoading(false)
    }
  }

  const createSubject = async (
    payload: CreateSubjectDto
  ) => {
    try {
      setLoading(true)

      const createdSubject =
        await subjectBusiness.createSubject(
          payload
        )

      setSubjects((prev) => [
        ...prev,
        createdSubject
      ])

      return createdSubject
    } catch (err) {
      console.error(err)

      setError('Error creating subject')

      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateSubject = async (
    id: string,
    payload: UpdateSubjectDto
  ) => {
    try {
      setLoading(true)

      const updatedSubject =
        await subjectBusiness.updateSubject(
          id,
          payload
        )

      setSubjects((prev) =>
        prev.map((subject) =>
          subject.id === id
            ? updatedSubject
            : subject
        )
      )

      return updatedSubject
    } catch (err) {
      console.error(err)

      setError('Error updating subject')

      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteSubject = async (
    id: string
  ) => {
    try {
      setLoading(true)

      await subjectBusiness.deleteSubject(id)

      setSubjects((prev) =>
        prev.filter(
          (subject) => subject.id !== id
        )
      )
    } catch (err) {
      console.error(err)

      setError('Error deleting subject')

      throw err
    } finally {
      setLoading(false)
    }
  }

  const archiveSubject = async (id: string) => {
    return updateSubject(id, { is_active: false })
  }

  return {
    subjects,
    loading,
    error,

    fetchSubjects,

    createSubject,

    updateSubject,

    deleteSubject,

    archiveSubject
  }
}