import React, { useEffect, useState } from 'react'

import SubjectForm from './SubjectForm'

import {
  Subject,
  CreateSubjectDto,
  UpdateSubjectDto
} from '../../models/Subject'

interface Props {
  open: boolean

  subject?: Subject | null

  loading?: boolean

  onClose: () => void

  onSave: (
    payload:
      | CreateSubjectDto
      | UpdateSubjectDto
  ) => void
}

const SubjectModal: React.FC<Props> = ({
  open,
  subject,
  loading = false,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<
    CreateSubjectDto | UpdateSubjectDto
  >({
    name: '',
    code: '',
    description: '',
    credits: 0
  })

  useEffect(() => {
    if (subject) {
      setFormData({
        name: subject.name,
        code: subject.code,
        description: subject.description,
        credits: subject.credits,
        is_active: subject.is_active
      })
    } else {
      setFormData({
        name: '',
        code: '',
        description: '',
        credits: 0
      })
    }
  }, [subject])

  const handleChange = (
    field: string,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = () => {
    onSave(formData)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {subject
              ? 'Edit Subject'
              : 'Create Subject'}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-xl"
          >
            ×
          </button>
        </div>

        <SubjectForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  )
}

export default SubjectModal