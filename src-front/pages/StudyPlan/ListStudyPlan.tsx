import { useState } from 'react'

import Swal from 'sweetalert2'

import StudyPlanForm from '../../components/StudyPlan/StudyPlanForm'
import StudyPlanModal from '../../components/StudyPlan/StudyPlanModal'
import StudyPlanListTable from './StudyPlanListTable'

import {
  CreateStudyPlanDto,
  StudyPlan,
  UpdateStudyPlanDto
} from '../../models/StudyPlan'

import { studyPlanBusiness } from '../../business/StudyPlanBusiness'
import useStudyPlans from '../../hooks/useStudyPlans'

const ListStudyPlan = () => {
  const { studyPlans, careers, loading, error, refresh } = useStudyPlans()

  const [saving, setSaving] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [selectedStudyPlan, setSelectedStudyPlan] = useState<StudyPlan | null>(null)

  const [formData, setFormData] = useState<CreateStudyPlanDto | UpdateStudyPlanDto>({
    career_id: '',
    name: '',
    year: new Date().getFullYear(),
    suggested_semester: 1
  })

  const handleCreate = () => {
    setSelectedStudyPlan(null)
    setFormData({
      career_id: '',
      name: '',
      year: new Date().getFullYear(),
      suggested_semester: 1
    })
    setOpenModal(true)
  }

  const handleEdit = (studyPlan: StudyPlan) => {
    setSelectedStudyPlan(studyPlan)
    setFormData({
      career_id: String(studyPlan.career_id),
      name: studyPlan.name,
      year: studyPlan.year,
      suggested_semester: studyPlan.suggested_semester
    })
    setOpenModal(true)
  }

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    try {
      setSaving(true)

      if (selectedStudyPlan) {
        await studyPlanBusiness.updateStudyPlan(
          String(selectedStudyPlan.id),
          formData as UpdateStudyPlanDto
        )
        Swal.fire('Actualizado', 'Plan de estudio actualizado correctamente', 'success')
      } else {
        await studyPlanBusiness.createStudyPlan(formData as CreateStudyPlanDto)
        Swal.fire('Creado', 'Plan de estudio creado correctamente', 'success')
      }

      setOpenModal(false)
      await refresh()
    } catch (err: any) {
      Swal.fire('Error', err.message || 'Operación fallida', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (studyPlan: StudyPlan) => {
    const result = await Swal.fire({
      title: '¿Eliminar plan de estudio?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    })

    if (!result.isConfirmed) return

    try {
      await studyPlanBusiness.deleteStudyPlan(String(studyPlan.id))
      Swal.fire('Eliminado', 'Plan de estudio eliminado correctamente', 'success')
      await refresh()
    } catch {
      Swal.fire('Error', 'No se pudo eliminar el plan de estudio', 'error')
    }
  }

  return (
    <div className="p-6">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Planes de Estudio</h1>
        <button
          type="button"
          onClick={handleCreate}
          className="rounded-md bg-primary px-4 py-2 text-white"
        >
          Crear Plan de Estudio
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-10 text-center text-sm text-gray-500">
          Cargando planes de estudio...
        </div>
      ) : (
        <StudyPlanListTable
          studyPlans={studyPlans}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <StudyPlanModal
        isOpen={openModal}
        title={selectedStudyPlan ? 'Editar Plan de Estudio' : 'Crear Plan de Estudio'}
        onClose={() => setOpenModal(false)}
      >
        <StudyPlanForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={saving}
          careers={careers}
        />
      </StudyPlanModal>
    </div>
  )
}

export default ListStudyPlan