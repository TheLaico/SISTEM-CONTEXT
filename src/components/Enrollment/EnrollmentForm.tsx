// src/components/Enrollment/EnrollmentForm.tsx
// mi version dar

import React from 'react'

import {
  CreateEnrollmentDto,
  UpdateEnrollmentDto
} from '../../models/Enrollment'

interface Props {
  formData:
    | CreateEnrollmentDto
    | UpdateEnrollmentDto

  onChange: (
    field: string,
    value: string
  ) => void

  onSubmit: () => void

  loading?: boolean
}

const EnrollmentForm: React.FC<Props> = ({
  formData,
  onChange,
  onSubmit,
  loading = false
}) => {
  return (
    <div className="space-y-4">
      {'student_id' in formData && (
        <div>
          <label className="mb-1 block text-sm font-medium">
            Student ID
          </label>

          <input
            type="text"
            value={
              formData.student_id || ''
            }
            onChange={(e) =>
              onChange(
                'student_id',
                e.target.value
              )
            }
            className="w-full rounded-md border p-2"
          />
        </div>
      )}

      {'group_id' in formData && (
        <div>
          <label className="mb-1 block text-sm font-medium">
            Group ID
          </label>

          <input
            type="text"
            value={
              formData.group_id || ''
            }
            onChange={(e) =>
              onChange(
                'group_id',
                e.target.value
              )
            }
            className="w-full rounded-md border p-2"
          />
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium">
          Status
        </label>

        <input
          type="text"
          value={formData.status || ''}
          onChange={(e) =>
            onChange(
              'status',
              e.target.value
            )
          }
          className="w-full rounded-md border p-2"
        />
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={loading}
        className="rounded-md bg-primary px-4 py-2 text-white"
      >
        {loading
          ? 'Saving...'
          : 'Save Enrollment'}
      </button>
    </div>
  )
}

export default EnrollmentForm