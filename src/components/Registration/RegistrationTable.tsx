// src/components/Registration/RegistrationTable.tsx

import React from 'react'

import { Registration } from '../../models/Registration'

interface Props {
  registrations: Registration[]

  onEdit: (
    registration: Registration
  ) => void

  onDelete: (id: string) => void
}

const RegistrationTable: React.FC<Props> = ({
  registrations,
  onEdit,
  onDelete
}) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Admission</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {registrations.map(
          (registration) => (
            <tr key={registration.id}>
              <td>
                {
                  registration.admission_period
                }
              </td>

              <td>
                {
                  registration.academic_status
                }
              </td>

              <td>
                <button
                  onClick={() =>
                    onEdit(registration)
                  }
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    onDelete(
                      registration.id
                    )
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          )
        )}
      </tbody>
    </table>
  )
}

export default RegistrationTable