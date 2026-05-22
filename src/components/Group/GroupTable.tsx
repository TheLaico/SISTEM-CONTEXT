import React from 'react'

import { Group } from '../../models/Group'

interface Props {
  groups: Group[]

  onEdit: (group: Group) => void

  onDelete: (id: string) => void
}

const GroupTable: React.FC<Props> = ({
  groups,
  onEdit,
  onDelete
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">
              Name
            </th>

            <th className="border p-2">
              Code
            </th>

            <th className="border p-2">
              Capacity
            </th>

            <th className="border p-2">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {groups.map((group) => (
            <tr key={group.id}>
              <td className="border p-2">
                {group.name}
              </td>

              <td className="border p-2">
                {group.group_code}
              </td>

              <td className="border p-2">
                {group.capacity}
              </td>

              <td className="border p-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onEdit(group)
                    }
                    className="rounded bg-blue-500 px-3 py-1 text-white"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onDelete(group.id)
                    }
                    className="rounded bg-red-500 px-3 py-1 text-white"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default GroupTable