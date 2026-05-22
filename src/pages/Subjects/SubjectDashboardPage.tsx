import { useEffect, useState } from 'react'
import ArchiveSubjectModal from '../../components/Subject/ArchiveSubjectModal'
import CreateSubjectModal from '../../components/Subject/CreateSubjectModal'
import EditSubjectModal from '../../components/Subject/EditSubjectModal'
import SubjectDetailsCard from '../../components/Subject/SubjectDetailsCard'
import SubjectFilters from '../../components/Subject/SubjectFilters'
import SubjectSearchBar from '../../components/Subject/SubjectSearchBar'
import SubjectTable from '../../components/Subject/SubjectTable'
import { useSubject } from '../../hooks/useSubject'
import { Subject } from '../../models/Subject'

interface Filters {
  search: string
  status: 'all' | 'active' | 'inactive'
  credits: string
}

const SubjectDashboardPage: React.FC = () => {
  const { subjects, loading, fetchSubjects, createSubject, updateSubject, archiveSubject } = useSubject()
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [filters, setFilters] = useState<Filters>({
    search: '',
    status: 'all',
    credits: ''
  })
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [archiveModalOpen, setArchiveModalOpen] = useState(false)
  const [subjectToEdit, setSubjectToEdit] = useState<Subject | null>(null)
  const [subjectToArchive, setSubjectToArchive] = useState<Subject | null>(null)
  const [createLoading, setCreateLoading] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [archiveLoading, setArchiveLoading] = useState(false)

  useEffect(() => {
    fetchSubjects()
  }, [])

  const filteredSubjects = subjects.filter((subject) => {
    // Filtro por búsqueda
    const searchLower = filters.search.toLowerCase()
    const matchesSearch =
      !filters.search ||
      subject.name.toLowerCase().includes(searchLower) ||
      subject.code.toLowerCase().includes(searchLower)

    // Filtro por estado
    const matchesStatus =
      filters.status === 'all' ||
      (filters.status === 'active' && subject.is_active) ||
      (filters.status === 'inactive' && !subject.is_active)

    // Filtro por créditos mínimos
    const matchesCredits =
      !filters.credits ||
      subject.credits >= Number(filters.credits)

    return matchesSearch && matchesStatus && matchesCredits
  })

  const handleCreate = async (payload: any) => {
    try {
      setCreateLoading(true)
      await createSubject(payload)
      setCreateModalOpen(false)
      await fetchSubjects()
    } finally {
      setCreateLoading(false)
    }
  }

  const handleEdit = async (payload: any) => {
    if (!subjectToEdit) return
    try {
      setEditLoading(true)
      await updateSubject(subjectToEdit.id, payload)
      setEditModalOpen(false)
      setSubjectToEdit(null)
      setSelectedSubject(null)
      await fetchSubjects()
    } finally {
      setEditLoading(false)
    }
  }

  const handleArchive = async () => {
    if (!subjectToArchive) return
    try {
      setArchiveLoading(true)
      await archiveSubject(subjectToArchive.id)
      setArchiveModalOpen(false)
      setSubjectToArchive(null)
      setSelectedSubject(null)
      await fetchSubjects()
    } finally {
      setArchiveLoading(false)
    }
  }

  const onEditClick = (subject: Subject) => {
    setSubjectToEdit(subject)
    setEditModalOpen(true)
  }

  const onArchiveClick = (subject: Subject) => {
    setSubjectToArchive(subject)
    setArchiveModalOpen(true)
  }

  const clearFilters = () => {
    setFilters({ search: '', status: 'all', credits: '' })
    setSelectedSubject(null)
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-black dark:text-white">Asignaturas</h2>
          <p className="text-sm text-gray-500">Catálogo de asignaturas disponibles en el sistema.</p>
        </div>
        <button
          type="button"
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-opacity-90"
        >
          + Nueva asignatura
        </button>
      </div>

      {/* búsqueda y filtros */}
      <div className="mb-6 space-y-4">
        <SubjectSearchBar
          value={filters.search}
          onChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
        />
        <div className="flex items-center gap-3">
          <SubjectFilters
            status={filters.status}
            credits={filters.credits}
            onStatusChange={(status) => setFilters((prev) => ({ ...prev, status }))}
            onCreditsChange={(credits) => setFilters((prev) => ({ ...prev, credits }))}
            onClear={clearFilters}
          />
          {(filters.search || filters.status !== 'all' || filters.credits) && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Limpiar filtros
            </button>
          )}
          <div className="ml-auto text-sm text-gray-600">
            Mostrando {filteredSubjects.length} de {subjects.length} asignaturas
          </div>
        </div>
      </div>

      {/* grid con SubjectTable y SubjectDetailsCard */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex items-center justify-center rounded-3xl border border-gray-200 bg-white py-12">
              <p className="text-sm text-gray-500">Cargando asignaturas...</p>
            </div>
          ) : (
            <SubjectTable
              subjects={filteredSubjects}
              selectedSubjectId={selectedSubject?.id}
              onSelect={setSelectedSubject}
              onEdit={onEditClick}
              onArchive={onArchiveClick}
            />
          )}
        </div>

        <div className="lg:col-span-1">
          <SubjectDetailsCard subject={selectedSubject} />
        </div>
      </div>

      {/* modales */}
      <CreateSubjectModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreate}
        loading={createLoading}
      />

      {subjectToEdit && (
        <EditSubjectModal
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false)
            setSubjectToEdit(null)
          }}
          subject={subjectToEdit}
          onEdit={handleEdit}
          loading={editLoading}
        />
      )}

      {subjectToArchive && (
        <ArchiveSubjectModal
          open={archiveModalOpen}
          onClose={() => {
            setArchiveModalOpen(false)
            setSubjectToArchive(null)
          }}
          subject={subjectToArchive}
          onConfirm={handleArchive}
          loading={archiveLoading}
        />
      )}
    </div>
  )
}

export default SubjectDashboardPage
