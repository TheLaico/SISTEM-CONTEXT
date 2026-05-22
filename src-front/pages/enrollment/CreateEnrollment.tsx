// src/pages/Enrollment/CreateEnrollment.tsx

import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import Swal from 'sweetalert2'

import EnrollmentForm from '../../components/Enrollment/EnrollmentForm'

import { CreateEnrollmentDto } from '../../models/Enrollment'

import { enrollmentBusiness } from '../../business/EnrollmentBusiness'

const CreateEnrollment = () => {
  const navigate = useNavigate()

  const [loading, setLoading] =
    useState(false)

  const [formData, setFormData] =
    useState<CreateEnrollmentDto>({
      student_id: '',
      group_id: '',
      status: 'ACTIVE'
    })

  const handleChange = (
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)

      await enrollmentBusiness.createEnrollment(
        formData
      )

      await Swal.fire(
        'Created',
        'Enrollment created successfully',
        'success'
      )

      navigate('/enrollments/list')
    } catch (error: any) {
      Swal.fire(
        'Error',
        error.message ||
          'Could not create enrollment',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">
        Create Enrollment
      </h1>

      <EnrollmentForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  )
}

export default CreateEnrollment