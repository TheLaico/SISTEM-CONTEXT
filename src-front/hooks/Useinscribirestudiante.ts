// src/hooks/useInscribirEstudiante.ts
import { useCallback, useEffect, useState } from 'react'
import { GrupoRow, inscripcionBusiness, InscripcionValidation, MAX_CREDITS } from '../business/Inscripcionbusiness'
import { Enrollment } from '../models/Enrollment'
import { Registration } from '../models/Registration'
import { Semester } from '../models/Semester'
import { Student } from '../models/Student'
import { enrollmentService } from '../services/enrollmentService'

type Step = 1 | 2 | 3 | 4 | 5

const useInscribirEstudiante = () => {
  // ── Paso ────────────────────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>(1)

  // ── Búsqueda ─────────────────────────────────────────────────────────────────
  const [searchQuery,  setSearchQuery]  = useState('')
  const [searchResults, setSearchResults] = useState<Student[]>([])
  const [searchLoading, setSearchLoading] = useState(false)

  // ── Selección estudiante ─────────────────────────────────────────────────────
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [matricula,       setMatricula]        = useState<Registration | null>(null)
  const [matriculaError,  setMatriculaError]   = useState<string | null>(null)

  // ── Semestre activo ─────────────────────────────────────────────────────────
  const [semestre,       setSemestre]       = useState<Semester | null>(null)
  const [semestreError,  setSemestreError]  = useState<string | null>(null)

  // ── Grupos ───────────────────────────────────────────────────────────────────
  const [grupoRows,        setGrupoRows]        = useState<GrupoRow[]>([])
  const [gruposLoading,    setGruposLoading]    = useState(false)
  const [gruposError,      setGruposError]      = useState<string | null>(null)
  const [existingEnrolls,  setExistingEnrolls]  = useState<Enrollment[]>([])

  // ── Selección múltiple ───────────────────────────────────────────────────────
  const [selectedGroupIds, setSelectedGroupIds] = useState<Set<string | number>>(new Set())
  const [validation,       setValidation]       = useState<InscripcionValidation>({
    creditosSeleccionados: 0,
    creditosRestantes:     MAX_CREDITS,
    excedeLimite:          false,
    gruposSinCupo:         [],
    gruposYaInscritos:     [],
    gruposFueraPlan:       [],
    puedeConfirmar:        false,
  })

  // ── Filtros de tabla ──────────────────────────────────────────────────────────
  const [filterSearch,    setFilterSearch]    = useState('')
  const [filterPrograma,  setFilterPrograma]  = useState('')
  const [filterAsignatura, setFilterAsignatura] = useState('')
  const [showOutOfPlanOnly, setShowOutOfPlanOnly] = useState(false)

  // ── Confirmación modal ───────────────────────────────────────────────────────
  const [confirmModalOpen,    setConfirmModalOpen]    = useState(false)
  const [cancelModalOpen,     setCancelModalOpen]     = useState(false)
  const [outOfPlanWarning,    setOutOfPlanWarning]    = useState(false)
  const [pendingGroupId,      setPendingGroupId]      = useState<string | number | null>(null)
  const [submitting,          setSubmitting]          = useState(false)

  // ── Búsqueda dinámica ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return }
    const timer = setTimeout(async () => {
      setSearchLoading(true)
      try {
        const results = await inscripcionBusiness.searchStudents(searchQuery)
        setSearchResults(results)
      } finally {
        setSearchLoading(false)
      }
    }, 350)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // ── Semestre activo al montar ─────────────────────────────────────────────────
  useEffect(() => {
    inscripcionBusiness.getSemestreActivo().then(sem => {
      if (!sem) setSemestreError('No hay semestre activo.')
      else { setSemestre(sem); setSemestreError(null) }
    })
  }, [])

  // ── Seleccionar estudiante ────────────────────────────────────────────────────
  const selectStudent = useCallback(async (student: Student) => {
    setSelectedStudent(student)
    setMatriculaError(null)
    setMatricula(null)
    setGrupoRows([])
    setSelectedGroupIds(new Set())
    setStep(2)

    const mat = await inscripcionBusiness.getMatriculaActiva(student.id!)
    if (!mat) {
      setMatriculaError('Este estudiante no tiene matrícula activa.')
      setMatricula(null)
    } else {
      setMatricula(mat)
    }
  }, [])

  // ── Cargar grupos (paso 3) ────────────────────────────────────────────────────
  const loadGrupos = useCallback(async () => {
    if (!semestre || !matricula || !selectedStudent) return
    setGruposLoading(true)
    setGruposError(null)
    try {
      const studentIdNumber = Number(selectedStudent.id)
      if (Number.isNaN(studentIdNumber)) {
        throw new Error('El ID del estudiante no es numérico')
      }

      const existingArr = await enrollmentService.getEnrollmentsByStudentId(studentIdNumber)
      setExistingEnrolls(existingArr)

      const rows = await inscripcionBusiness.buildGrupoRows(
        semestre.id,
        matricula.career_id,
        selectedStudent.id!,
        existingArr
      )
      setGrupoRows(rows)
      setStep(3)
    } catch (err: any) {
      setGruposError(err.message ?? 'Error cargando grupos')
    } finally {
      setGruposLoading(false)
    }
  }, [semestre, matricula, selectedStudent])

  // ── Toggle selección grupo ────────────────────────────────────────────────────
  const toggleGroup = useCallback((row: GrupoRow) => {
    const id = String(row.group.id)

    if (row.yaInscrito || row.sinCupo) return

    // Si no está en el plan → advertencia
    if (!row.inPlan && !selectedGroupIds.has(id)) {
      setPendingGroupId(id)
      setOutOfPlanWarning(true)
      return
    }

    setSelectedGroupIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [selectedGroupIds])

  const confirmOutOfPlan = useCallback(() => {
    if (!pendingGroupId) return
    setSelectedGroupIds(prev => {
      const next = new Set(prev)
      next.add(String(pendingGroupId))
      return next
    })
    setOutOfPlanWarning(false)
    setPendingGroupId(null)
  }, [pendingGroupId])

  const rejectOutOfPlan = useCallback(() => {
    setOutOfPlanWarning(false)
    setPendingGroupId(null)
  }, [])

  // ── Recalcular validación cuando cambia selección ─────────────────────────────
  useEffect(() => {
    setValidation(inscripcionBusiness.validateSelection(grupoRows, selectedGroupIds))
  }, [selectedGroupIds, grupoRows])

  // ── Filas filtradas ───────────────────────────────────────────────────────────
  const filteredRows = grupoRows.filter(row => {
    const q = filterSearch.toLowerCase()
    const matchSearch =
      !q ||
      row.subjectName.toLowerCase().includes(q) ||
      row.subjectCode.toLowerCase().includes(q) ||
      row.group.group_code.toLowerCase().includes(q) ||
      row.teacherName.toLowerCase().includes(q)

    const matchPrograma    = !filterPrograma    || row.group.semester_id === filterPrograma
    const matchAsignatura  = !filterAsignatura  || row.subjectCode === filterAsignatura
    const matchOutOfPlan   = !showOutOfPlanOnly || !row.inPlan

    return matchSearch && matchPrograma && matchAsignatura && matchOutOfPlan
  })

  // ── Confirmar inscripción ─────────────────────────────────────────────────────
  const confirmar = useCallback(async (): Promise<Enrollment[]> => {
    if (!selectedStudent) throw new Error('No hay estudiante seleccionado')
    setSubmitting(true)
    try {
      const results = await inscripcionBusiness.createInscripciones(
        selectedStudent.id!,
        selectedGroupIds
      )
      setStep(5)
      return results
    } finally {
      setSubmitting(false)
    }
  }, [selectedStudent, selectedGroupIds])

  // ── Reset ─────────────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    setStep(1)
    setSearchQuery('')
    setSearchResults([])
    setSelectedStudent(null)
    setMatricula(null)
    setMatriculaError(null)
    setGrupoRows([])
    setSelectedGroupIds(new Set())
    setExistingEnrolls([])
    setFilterSearch('')
    setFilterPrograma('')
    setFilterAsignatura('')
  }, [])

  return {
    // ── UI state ──────────────────────────────────────────────────────────────
    step, setStep,
    // ── Búsqueda ──────────────────────────────────────────────────────────────
    searchQuery, setSearchQuery,
    searchResults, searchLoading,
    // ── Estudiante/matrícula ──────────────────────────────────────────────────
    selectedStudent, matricula, matriculaError,
    selectStudent,
    // ── Semestre ──────────────────────────────────────────────────────────────
    semestre, semestreError,
    // ── Grupos ────────────────────────────────────────────────────────────────
    grupoRows, filteredRows, gruposLoading, gruposError,
    loadGrupos,
    // ── Selección ─────────────────────────────────────────────────────────────
    selectedGroupIds, toggleGroup, validation,
    // ── Filtros ───────────────────────────────────────────────────────────────
    filterSearch, setFilterSearch,
    filterPrograma, setFilterPrograma,
    filterAsignatura, setFilterAsignatura,
    showOutOfPlanOnly, setShowOutOfPlanOnly,
    // ── Modales ───────────────────────────────────────────────────────────────
    confirmModalOpen, setConfirmModalOpen,
    cancelModalOpen, setCancelModalOpen,
    outOfPlanWarning, pendingGroupId, confirmOutOfPlan, rejectOutOfPlan,
    // ── Submit ────────────────────────────────────────────────────────────────
    submitting, confirmar,
    // ── Helpers ───────────────────────────────────────────────────────────────
    reset,
    MAX_CREDITS,
    existingEnrolls,
  }
}

export default useInscribirEstudiante