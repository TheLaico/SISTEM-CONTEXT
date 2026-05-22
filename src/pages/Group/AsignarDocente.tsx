// src/pages/Group/AsignarDocente.tsx
import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { Group } from '../../models/Group'
import { Semester } from '../../models/Semester'
import { User } from '../../models/User'
import { groupService } from '../../services/groupService'
import { semesterService } from '../../services/semesterService'
import { userService } from '../../services/userService'
import { UserRole } from '../../models/UserRole'
import SemesterActivoBanner from '../../components/AsignarDocente/SemesterActivoBanner'
import GruposTable from '../../components/AsignarDocente/GruposTable'
import AsignarDocenteModal from '../../components/AsignarDocente/AsignarDocenteModal'
import HistorialAsignaciones from '../../components/AsignarDocente/HistorialAsignaciones'
import FiltrosHeader from '../../components/AsignarDocente/FiltrosHeader'

export interface AssignmentRecord {
  id: string
  group: Group
  teacher: User | null
  assignedAt: string
  active: boolean
}

const AsignarDocente = () => {
  const [semesters, setSemesters] = useState<Semester[]>([])
  const [activeSemester, setActiveSemester] = useState<Semester | null>(null)
  const [groups, setGroups] = useState<Group[]>([])
  const [teachers, setTeachers] = useState<User[]>([])
  const [history, setHistory] = useState<AssignmentRecord[]>([])
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [view, setView] = useState<'groups' | 'history'>('groups')
  const [loadingGroups, setLoadingGroups] = useState(false)
  const [filters, setFilters] = useState({
    semester: '',
    subject: '',
    teacher: '',
  })

  // Cargar semestres al montar
  useEffect(() => {
    semesterService.getSemesters().then((data) => {
      setSemesters(data)
      const active = data.find((s) => s.is_active) ?? null
      setActiveSemester(active)
      if (active) setFilters((f) => ({ ...f, semester: active.id }))
    })
  }, [])

  // Cargar grupos cuando cambia el semestre seleccionado
  useEffect(() => {
    if (!filters.semester) return
    setLoadingGroups(true)
    groupService
      .getGroups()
      .then((data) => {
        const filtered = data.filter(
          (g) => String(g.semester_id) === String(filters.semester),
        )
        setGroups(filtered)
      })
      .finally(() => setLoadingGroups(false))
  }, [filters.semester])

  const searchTeachers = useCallback(async (query: string): Promise<User[]> => {
    if (!query.trim()) return []
    const results = await userService.searchUsers({
      role: UserRole.TEACHER,
      first_name: query,
    })
    // También busca por apellido y cédula en paralelo
    const byLastName = await userService.searchUsers({
      role: UserRole.TEACHER,
      last_name: query,
    })
    const byId = await userService.searchUsers({
      role: UserRole.TEACHER,
      identification: query,
    })
    const all = [...results, ...byLastName, ...byId]
    const unique = all.filter(
      (u, i, arr) => arr.findIndex((x) => x.id === u.id) === i,
    )
    setTeachers(unique)
    return unique
  }, [])

  const handleAssign = async (groupId: string, teacherId: string) => {
    await groupService.assignTeacher(groupId, teacherId)
    toast.success('Docente asignado correctamente')
    // Refrescar grupos
    const data = await groupService.getGroups()
    const filtered = data.filter(
      (g) => String(g.semester_id) === String(filters.semester),
    )
    setGroups(filtered)
    // Agregar al historial local
    const group = filtered.find((g) => String(g.id) === String(groupId))
    const teacher = teachers.find((t) => String(t.id) === String(teacherId)) ?? null
    if (group) {
      setHistory((prev) => [
        {
          id: `${groupId}-${Date.now()}`,
          group,
          teacher,
          assignedAt: new Date().toISOString(),
          active: true,
        },
        ...prev,
      ])
    }
  }

  const openModal = (group: Group) => {
    setSelectedGroup(group)
    setModalOpen(true)
  }

  // Grupos filtrados por subject/teacher texto
  const groupsFiltered = groups.filter((g) => {
    const matchSubject =
      !filters.subject ||
      (g.subject?.name ?? '').toLowerCase().includes(filters.subject.toLowerCase())
    const teacherName =
      `${g.teacher?.first_name ?? ''} ${g.teacher?.last_name ?? ''}`.toLowerCase()
    const matchTeacher =
      !filters.teacher || teacherName.includes(filters.teacher.toLowerCase())
    return matchSubject && matchTeacher
  })

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      {/* Header */}
      <FiltrosHeader
        semesters={semesters}
        filters={filters}
        onFilterChange={(key, val) => setFilters((f) => ({ ...f, [key]: val }))}
        view={view}
        onViewChange={setView}
      />

      {/* Banner semestre activo */}
      <SemesterActivoBanner activeSemester={activeSemester} />

      {/* Contenido principal */}
      {view === 'groups' ? (
        <GruposTable
          groups={groupsFiltered}
          loading={loadingGroups}
          activeSemester={activeSemester}
          onAssign={openModal}
        />
      ) : (
        <HistorialAsignaciones history={history} />
      )}

      {/* Modal */}
      {modalOpen && selectedGroup && (
        <AsignarDocenteModal
          group={selectedGroup}
          activeSemester={activeSemester}
          onSearchTeachers={searchTeachers}
          onAssign={handleAssign}
          onClose={() => {
            setSelectedGroup(null)
            setModalOpen(false)
          }}
        />
      )}
    </div>
  )
}

export default AsignarDocente