import React from 'react'

import {
  CreateGroupDto,
  UpdateGroupDto
} from '../../models/Group'

interface Props {
  formData:
    | CreateGroupDto
    | UpdateGroupDto

  onChange: (
    field: string,
    value: string | number
  ) => void

  onSubmit: () => void

  loading?: boolean
}

const GroupForm: React.FC<Props> = ({
  formData,
  onChange,
  onSubmit,
  loading = false
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">
          Group Name
        </label>

        <input
          type="text"
          value={formData.name || ''}
          onChange={(e) =>
            onChange(
              'name',
              e.target.value
            )
          }
          className="w-full rounded-md border p-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Group Code
        </label>

        <input
          type="text"
          value={formData.group_code || ''}
          onChange={(e) =>
            onChange(
              'group_code',
              e.target.value
            )
          }
          className="w-full rounded-md border p-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Teacher ID
        </label>

        <input
          type="text"
          value={
            formData.teacher_id || ''
          }
          onChange={(e) =>
            onChange(
              'teacher_id',
              e.target.value
            )
          }
          className="w-full rounded-md border p-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Subject ID
        </label>

        <input
          type="text"
          value={
            formData.subject_id || ''
          }
          onChange={(e) =>
            onChange(
              'subject_id',
              e.target.value
            )
          }
          className="w-full rounded-md border p-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Semester ID
        </label>

        <input
          type="text"
          value={
            formData.semester_id || ''
          }
          onChange={(e) =>
            onChange(
              'semester_id',
              e.target.value
            )
          }
          className="w-full rounded-md border p-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Capacity
        </label>

        <input
          type="number"
          value={
            formData.capacity || 0
          }
          onChange={(e) =>
            onChange(
              'capacity',
              Number(e.target.value)
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
          : 'Save Group'}
      </button>
    </div>
  )
}

export default GroupForm