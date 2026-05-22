import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import Swal from 'sweetalert2'

import StudyPlanForm from '../../components/StudyPlan/StudyPlanForm'

import { CreateStudyPlanDto } from '../../models/StudyPlan'

import { studyPlanBusiness } from '../../business/StudyPlanBusiness'

const CreateStudyPlan = () => {
  const navigate = useNavigate()

  const [loading, setLoading] =
    useState(false)

  const [formData, setFormData] =
    useState<CreateStudyPlanDto>({
      career_id: '',
      subject_id: '',
      name: '',
      year: 2025,
      suggested_semester: 1
    })

  const handleChange = (
    field: string,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)

      await studyPlanBusiness.createStudyPlan(
        formData
      )

      await Swal.fire(
        'Created',
        'Study plan created successfully',
        'success'
      )

      navigate('/study-plans/list')
    } catch (error: any) {
      Swal.fire(
        'Error',
        error.message ||
          'Could not create study plan',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">
        Create Study Plan
      </h1>

      <StudyPlanForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  )
}

export default CreateStudyPlan