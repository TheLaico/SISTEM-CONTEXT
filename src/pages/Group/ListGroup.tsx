// src/pages/Group/ListGroup.tsx

import { useEffect, useState } from 'react'

import Swal from 'sweetalert2'

import GroupTable from '../../components/Group/GroupTable'
import GroupModal from '../../components/Group/GroupModal'
import GroupForm from '../../components/Group/GroupForm'

import {
  Group,
  CreateGroupDto,
  UpdateGroupDto
} from '../../models/Group'

import { groupBusiness } from '../../business/GroupBusiness'

const ListGroup = () => {
  const [groups, setGroups] = useState<
    Group[]
  >([])

  const [loading, setLoading] =
    useState(false)

  const [openModal, setOpenModal] =
    useState(false)

  const [selectedGroup, setSelectedGroup] =
    useState<Group | null>(null)

  const [formData, setFormData] =
    useState<
      CreateGroupDto | UpdateGroupDto
    >({
      teacher_id: '',
      subject_id: '',
      semester_id: '',
      name: '',
      group_code: '',
      capacity: 30
    })

  const loadGroups = async () => {
    setLoading(true)

    try {
      const data =
        await groupBusiness.getGroups()

      setGroups(data)
    } catch (error) {
      console.error(error)

      Swal.fire(
        'Error',
        'Could not load groups',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGroups()
  }, [])

  const handleCreate = () => {
    setSelectedGroup(null)

    setFormData({
      teacher_id: '',
      subject_id: '',
      semester_id: '',
      name: '',
      group_code: '',
      capacity: 30
    })

    setOpenModal(true)
  }

  const handleEdit = (group: Group) => {
    setSelectedGroup(group)

    setFormData({
      teacher_id: group.teacher_id,
      subject_id: group.subject_id,
      semester_id: group.semester_id,
      name: group.name,
      group_code: group.group_code,
      capacity: group.capacity
    })

    setOpenModal(true)
  }

    const handleDelete = async (id: string) => {
      const result = await Swal.fire({
        title: '¿Eliminar grupo?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
      })

      if (!result.isConfirmed) return

      try {
        await groupBusiness.deleteGroup(id)
        Swal.fire('Eliminado', 'Grupo eliminado correctamente', 'success')
        loadGroups()
      } catch (error: any) {
        Swal.fire('Error', error.message || 'No se pudo eliminar el grupo', 'error')
      }
    }
  const handleChange = (
    field: string,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async () => {
    try {
      if (selectedGroup) {
        await groupBusiness.updateGroup(
          selectedGroup.id,
          formData as UpdateGroupDto
        )

        Swal.fire(
          'Updated',
          'Group updated successfully',
          'success'
        )
      } else {
        await groupBusiness.createGroup(
          formData as CreateGroupDto
        )

        Swal.fire(
          'Created',
          'Group created successfully',
          'success'
        )
      }

      setOpenModal(false)

      loadGroups()
    } catch (error: any) {
      Swal.fire(
        'Error',
        error.message ||
          'Operation failed',
        'error'
      )
    }
  }

  return (
    <div className="p-6">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Groups
        </h1>

        <button
          type="button"
          onClick={handleCreate}
          className="rounded-md bg-primary px-4 py-2 text-white"
        >
          Create Group
        </button>
      </div>

      <GroupTable
        groups={groups}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <GroupModal
        isOpen={openModal}
        title={
          selectedGroup
            ? 'Edit Group'
            : 'Create Group'
        }
        onClose={() =>
          setOpenModal(false)
        }
      >
        <GroupForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </GroupModal>
    </div>
  )
}

export default ListGroup