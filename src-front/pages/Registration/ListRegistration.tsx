// src/pages/Registration/ListRegistration.tsx

import {
  useEffect,
  useState
} from 'react'

import Swal from 'sweetalert2'

import RegistrationTable from '../../components/Registration/RegistrationTable'
import RegistrationModal from '../../components/Registration/RegistrationModal'
import RegistrationForm from '../../components/Registration/RegistrationForm'

import {
  Registration,
  CreateRegistrationDto,
  UpdateRegistrationDto
} from '../../models/Registration'

import { registrationBusiness } from '../../business/RegistrationBusiness'

const ListRegistration = () => {
  const [registrations, setRegistrations] =
    useState<Registration[]>([])

  const [loading, setLoading] =
    useState(false)

  const [openModal, setOpenModal] =
    useState(false)

  const [selectedRegistration, setSelectedRegistration] =
    useState<Registration | null>(null)

  const [formData, setFormData] =
    useState<
      CreateRegistrationDto |
      UpdateRegistrationDto
    >({
      career_id: '',
      student_id: '',
      admission_period: '',
      academic_status: ''
    })

  const loadRegistrations =
    async () => {
      try {
        setLoading(true)

        const data =
          await registrationBusiness.getRegistrations()

        setRegistrations(data)
      } catch (error) {
        Swal.fire(
          'Error',
          'Could not load registrations',
          'error'
        )
      } finally {
        setLoading(false)
      }
    }

  useEffect(() => {
    loadRegistrations()
  }, [])

  const handleCreate = () => {
    setSelectedRegistration(null)

    setFormData({
      career_id: '',
      student_id: '',
      admission_period: '',
      academic_status: ''
    })

    setOpenModal(true)
  }

  const handleEdit = (
    registration: Registration
  ) => {
    setSelectedRegistration(
      registration
    )

    setFormData({
      career_id:
        registration.career_id,
      student_id:
        registration.student_id,
      admission_period:
        registration.admission_period,
      academic_status:
        registration.academic_status,
      is_active:
        registration.is_active
    })

    setOpenModal(true)
  }

  const handleChange = (
    field: string,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async () => {
    try {
      if (selectedRegistration) {
        await registrationBusiness.updateRegistration(
          selectedRegistration.id,
          formData as UpdateRegistrationDto
        )

        Swal.fire(
          'Updated',
          'Registration updated',
          'success'
        )
      } else {
        await registrationBusiness.createRegistration(
          formData as CreateRegistrationDto
        )

        Swal.fire(
          'Created',
          'Registration created',
          'success'
        )
      }

      setOpenModal(false)

      loadRegistrations()
    } catch (error: any) {
      Swal.fire(
        'Error',
        error.message,
        'error'
      )
    }
  }

  const handleDelete = async (
    id: string
  ) => {
    try {
      await registrationBusiness.deleteRegistration(
        id
      )

      Swal.fire(
        'Deleted',
        'Registration deleted',
        'success'
      )

      loadRegistrations()
    } catch (error) {
      Swal.fire(
        'Error',
        'Could not delete registration',
        'error'
      )
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between mb-5">
        <h1>
          Registrations
        </h1>

        <button
          onClick={handleCreate}
        >
          Create
        </button>
      </div>

      <RegistrationTable
        registrations={registrations}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <RegistrationModal
        isOpen={openModal}
        title={
          selectedRegistration
            ? 'Edit Registration'
            : 'Create Registration'
        }
        onClose={() =>
          setOpenModal(false)
        }
      >
        <RegistrationForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </RegistrationModal>
    </div>
  )
}

export default ListRegistration