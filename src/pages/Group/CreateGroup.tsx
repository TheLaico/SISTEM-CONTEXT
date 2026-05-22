// src/pages/Group/CreateGroup.tsx

import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import Swal from 'sweetalert2'

import GroupForm from '../../components/Group/GroupForm'

import {
  CreateGroupDto
} from '../../models/Group'

import { groupBusiness } from '../../business/GroupBusiness'

const CreateGroup = () => {
  const navigate = useNavigate()

  const [loading, setLoading] =
    useState(false)

  const [formData, setFormData] =
    useState<CreateGroupDto>({
      teacher_id: '',
      subject_id: '',
      semester_id: '',
      name: '',
      group_code: '',
      capacity: 30
    })

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
      setLoading(true)

      await groupBusiness.createGroup(
        formData
      )

      await Swal.fire(
        'Created',
        'Group created successfully',
        'success'
      )

      navigate('/grupos/list')
    } catch (error: any) {
      Swal.fire(
        'Error',
        error.message ||
          'Could not create group',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">
        Create Group
      </h1>

      <GroupForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  )
}

export default CreateGroup