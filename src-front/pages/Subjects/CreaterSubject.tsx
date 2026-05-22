import { useState } from 'react'

import SubjectForm from '../../components/Subject/SubjectForm'

import { CreateSubjectDto } from '../../models/Subject'

import { subjectBusiness } from '../../business/SubjectBusiness'

const CreateSubject = () => {
  const [loading, setLoading] =
    useState(false)

  const [formData, setFormData] =
    useState<CreateSubjectDto>({
      name: '',
      code: '',
      description: '',
      credits: 0,
      is_active: true
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

      await subjectBusiness.createSubject(
        formData
      )

      alert('Subject created successfully')

      setFormData({
        name: '',
        code: '',
        description: '',
        credits: 0,
        is_active: true
      })
    } catch (error) {
      console.error(error)

      alert('Error creating subject')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">
        Create Subject
      </h1>

      <SubjectForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  )
}

export default CreateSubject