// src/components/Enrollment/EnrollmentTable.tsx
//mi version dar

import React from 'react'

import { Enrollment } from '../../models/Enrollment'

interface Props {
  enrollments: Enrollment[]

  onEdit: (
    enrollment: Enrollment
  ) => void

  onDelete: (id: string) => void
}

const EnrollmentTable: React.FC<Props> = ({
  enrollments,
  onEdit,
  onDelete
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">
              Student
            </th>

            <th className="border p-2">
              Group
            </th>

            <th className="border p-2">
              Status
            </th>

            <th className="border p-2">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {enrollments.map(
            (enrollment) => (
              <tr key={enrollment.id}>
                <td className="border p-2">
                  {
                    enrollment.student_id
                  }
                </td>

                <td className="border p-2">
                  {enrollment.group_id}
                </td>

                <td className="border p-2">
                  {enrollment.status}
                </td>

                <td className="border p-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onEdit(
                          enrollment
                        )
                      }
                      className="rounded bg-blue-500 px-3 py-1 text-white"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onDelete(
                          enrollment.id
                        )
                      }
                      className="rounded bg-red-500 px-3 py-1 text-white"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  )
}

export default EnrollmentTable