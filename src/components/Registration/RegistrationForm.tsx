// src/components/Registration/RegistrationForm.tsx

import React from 'react'

import {
  CreateRegistrationDto,
  UpdateRegistrationDto
} from '../../models/Registration'

interface Props {
  formData:
    | CreateRegistrationDto
    | UpdateRegistrationDto

  onChange: (
    field: string,
    value: string | boolean
  ) => void

  onSubmit: () => void

  loading?: boolean
}

const RegistrationForm: React.FC<Props> = ({
  formData,
  onChange,
  onSubmit,
  loading = false
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label>
          Career ID
        </label>

        <input
          type="text"
          value={formData.career_id || ''}
          onChange={(e) =>
            onChange(
              'career_id',
              e.target.value
            )
          }
        />
      </div>

      <div>
        <label>
          Student ID
        </label>

        <input
          type="text"
          value={formData.student_id || ''}
          onChange={(e) =>
            onChange(
              'student_id',
              e.target.value
            )
          }
        />
      </div>

      <div>
        <label>
          Admission Period
        </label>

        <input
          type="text"
          value={
            formData.admission_period || ''
          }
          onChange={(e) =>
            onChange(
              'admission_period',
              e.target.value
            )
          }
        />
      </div>

      <div>
        <label>
          Academic Status
        </label>

        <input
          type="text"
          value={
            formData.academic_status || ''
          }
          onChange={(e) =>
            onChange(
              'academic_status',
              e.target.value
            )
          }
        />
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={loading}
      >
        {loading
          ? 'Saving...'
          : 'Save Registration'}
      </button>
    </div>
  )
}

export default RegistrationForm