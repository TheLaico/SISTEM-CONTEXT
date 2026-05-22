// src/pages/enrollment/ListEnrollment.tsx

import {
    useEffect,
    useState
} from 'react'

import Swal from 'sweetalert2'

import EnrollmentForm from '../../components/Enrollment/EnrollmentForm.tsx'
import EnrollmentModal from '../../components/Enrollment/EnrollmentModal.tsx'
import EnrollmentTable from '../../components/Enrollment/EnrollmentTable.tsx'

import {
    CreateEnrollmentDto,
    Enrollment,
    UpdateEnrollmentDto
} from '../../models/Enrollment.ts'

import { enrollmentBusiness } from '../../business/EnrollmentBusiness.ts'

const ListEnrollment = () => {
  const [enrollments, setEnrollments] =
    useState<Enrollment[]>([])

  const [loading, setLoading] =
    useState(false)

  const [openModal, setOpenModal] =
    useState(false)

  const [selectedEnrollment, setSelectedEnrollment] =
    useState<Enrollment | null>(null)

  const [formData, setFormData] =
    useState<
      CreateEnrollmentDto | UpdateEnrollmentDto
    >({
      student_id: '',
      group_id: '',
      status: 'ACTIVE'
    })

  const loadEnrollments = async () => {
    try {
      setLoading(true)

      const data =
        await enrollmentBusiness.getEnrollments()

      setEnrollments(data)
    } catch (error) {
      Swal.fire(
        'Error',
        'Could not load enrollments',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEnrollments()
  }, [])

  const handleCreate = () => {
    setSelectedEnrollment(null)

    setFormData({
      student_id: '',
      group_id: '',
      status: 'ACTIVE'
    })

    setOpenModal(true)
  }

  const handleEdit = (
    enrollment: Enrollment
  ) => {
    setSelectedEnrollment(enrollment)

    setFormData({
      status: enrollment.status
    })

    setOpenModal(true)
  }

  const handleChange = (
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleDelete = async (
    id: string
  ) => {
    const result = await Swal.fire({
      title: 'Delete enrollment?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete'
    })

    if (!result.isConfirmed) return

    try {
      await enrollmentBusiness.deleteEnrollment(
        id
      )

      Swal.fire(
        'Deleted',
        'Enrollment deleted successfully',
        'success'
      )

      loadEnrollments()
    } catch (error: any) {
      Swal.fire(
        'Error',
        error.message ||
          'Could not delete enrollment',
        'error'
      )
    }
  }

  const handleSubmit = async () => {
    try {
      if (selectedEnrollment) {
        await enrollmentBusiness.updateEnrollment(
          selectedEnrollment.id,
          formData as UpdateEnrollmentDto
        )

        Swal.fire(
          'Updated',
          'Enrollment updated successfully',
          'success'
        )
      } else {
        await enrollmentBusiness.createEnrollment(
          formData as CreateEnrollmentDto
        )

        Swal.fire(
          'Created',
          'Enrollment created successfully',
          'success'
        )
      }

      setOpenModal(false)

      loadEnrollments()
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
          Enrollments
        </h1>

        <button
          type="button"
          onClick={handleCreate}
          className="rounded-md bg-primary px-4 py-2 text-white"
        >
          Create Enrollment
        </button>
      </div>

      <EnrollmentTable
        enrollments={enrollments}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <EnrollmentModal
        isOpen={openModal}
        title={
          selectedEnrollment
            ? 'Edit Enrollment'
            : 'Create Enrollment'
        }
        onClose={() =>
          setOpenModal(false)
        }
      >
        <EnrollmentForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </EnrollmentModal>
    </div>
  )
}

export default ListEnrollment