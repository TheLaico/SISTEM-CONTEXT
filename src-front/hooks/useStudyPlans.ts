import { useEffect, useState } from 'react'

import { StudyPlan } from '../models/StudyPlan'
import { Career } from '../models/Career'

import { studyPlanBusiness } from '../business/StudyPlanBusiness'
import { studyPlanService } from '../services/studyPlanService'
import { subjectService } from '../services/subjectService'
import { careerService } from '../services/careerService'

const useStudyPlans = () => {
  const [studyPlans, setStudyPlans] =
    useState<StudyPlan[]>([])

  const [careers, setCareers] =
    useState<Career[]>([])

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  const refresh = async () => {
    try {
      setLoading(true)

      const [plans, subjects, careerList] = await Promise.all([
        studyPlanBusiness.getStudyPlans(),
        subjectService.getSubjects(),
        careerService.getCareers()
      ])

      setCareers(careerList)

      const enrichedPlans = plans.map((plan) => ({
        ...plan,
        subject: subjects.find((subject) => String(subject.id) === String(plan.subject_id)),
        career: careerList.find((career) => String(career.id) === String(plan.career_id))
      }))

      console.debug('useStudyPlans: loaded counts', { plans: plans.length, subjects: subjects.length, careers: careerList.length })
      setStudyPlans(enrichedPlans)

      setError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not load study plans'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  return {
    studyPlans,
    careers,
    loading,
    error,
    refresh
  }
}

export default useStudyPlans