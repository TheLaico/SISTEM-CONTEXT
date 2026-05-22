// src/pages/Registration/CreateRegistration.tsx

import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import Swal from 'sweetalert2'

import RegistrationForm from '../../components/Registration/RegistrationForm'

import {
  CreateRegistrationDto
} from '../../models/Registration'

import { registrationBusiness } from '../../business/RegistrationBusiness'

const CreateRegistration = () => {
  const navigate = useNavigate()

  const [loading, setLoading] =
    useState(false)

  const [formData, setFormData] =
    useState<CreateRegistrationDto>({
      career_id: '',
      student_id: '',
      admission_period: '',
      academic_status: ''
    })

  const handleChange = (
    field: string,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)

      await registrationBusiness.createRegistration(
        formData
      )

      await Swal.fire(
        'Created',
        'Registration created successfully',
        'success'
      )

      navigate('/registrations/list')
    } catch (error: any) {
      Swal.fire(
        'Error',
        error.message,
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h1>
        Create Registration
      </h1>

      <RegistrationForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  )
}

export default CreateRegistration