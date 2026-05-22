// src/business/InscripcionBusiness.ts
import { Enrollment } from '../models/Enrollment'
import { Group }       from '../models/Group'
import { Registration } from '../models/Registration'
import { Semester }    from '../models/Semester'
import { Student }     from '../models/Student'
import { inscripcionService } from '../services/inscripcionService'

export const MAX_CREDITS = 20

export interface GrupoRow {
  group:           Group
  subjectName:     string
  subjectCode:     string
  credits:         number
  teacherName:     string
  cuposTotal:      number
  cuposOcupados:   number
  cuposDisp:       number
  inPlan:          boolean
  yaInscrito:      boolean
  sinCupo:         boolean
}

export interface InscripcionValidation {
  creditosSeleccionados:  number
  creditosRestantes:      number
  excedeLimite:           boolean
  gruposSinCupo:          string[]
  gruposYaInscritos:      string[]
  gruposFueraPlan:        string[]
  puedeConfirmar:         boolean
}

class InscripcionBusiness {

  // ── Búsqueda de estudiante ──────────────────────────────────────────────────
  async searchStudents(query: string): Promise<Student[]> {
    if (!query.trim()) return []
    return inscripcionService.searchStudents(query.trim())
  }

  // ── Matrícula activa ────────────────────────────────────────────────────────
  async getMatriculaActiva(studentId: string | number): Promise<Registration | null> {
    const registrations = await inscripcionService.getRegistrationsByStudent(studentId)
    return registrations.find(r => r.is_active) ?? null
  }

  // ── Semestre activo ─────────────────────────────────────────────────────────
  async getSemestreActivo(): Promise<Semester | null> {
    return inscripcionService.getActiveSemester()
  }

  // ── Construir rows de grupos para la tabla ──────────────────────────────────
  async buildGrupoRows(
    semesterId:     string | number,
    careerId:       string | number,
    _studentId:      string | number,
    existingEnrollments: Enrollment[]
  ): Promise<GrupoRow[]> {
    const [groups, studyPlans] = await Promise.all([
      inscripcionService.getGroupsBySemester(semesterId),
      inscripcionService.getStudyPlansByCareer(careerId),
    ])

    // Recolectar IDs de asignaturas en el plan de la carrera
    const planSubjectIds = new Set<number>()
    await Promise.all(
      studyPlans.map(async (sp) => {
        const ids = await inscripcionService.getSubjectsByStudyPlan(sp.id)
        ids.forEach(id => planSubjectIds.add(id))
      })
    )

    const activeGroupIds = new Set(
      existingEnrollments
        .filter(e => e.status === 'ACTIVE')
        .map(e => String(e.group_id))
    )

    return groups
      .filter(g => g.teacher_id && g.subject_id)  // precondición: docente y asignatura definidos
      .map(g => {
        const enrolled    = g.enrollments?.length ?? 0
        const capacity    = g.capacity ?? 0
        const cuposDisp   = Math.max(0, capacity - enrolled)
        const subjectId   = Number(g.subject_id)

        return {
          group:          g,
          subjectName:    g.subject?.name  ?? '—',
          subjectCode:    g.subject?.code  ?? '—',
          credits:        g.subject?.credits ?? 0,
          teacherName:    [g.teacher?.first_name, g.teacher?.last_name].filter(Boolean).join(' ') || '—',
          cuposTotal:     capacity,
          cuposOcupados:  enrolled,
          cuposDisp,
          inPlan:         planSubjectIds.has(subjectId),
          yaInscrito:     activeGroupIds.has(String(g.id)),
          sinCupo:        cuposDisp === 0,
        } satisfies GrupoRow
      })
  }

  // ── Validaciones en tiempo real ─────────────────────────────────────────────
  validateSelection(rows: GrupoRow[], selectedIds: Set<string | number>): InscripcionValidation {
    const selected = rows.filter(r => selectedIds.has(String(r.group.id)))

    const creditosSeleccionados = selected.reduce((sum, r) => sum + r.credits, 0)
    const excedeLimite          = creditosSeleccionados > MAX_CREDITS

    const gruposSinCupo     = selected.filter(r => r.sinCupo).map(r => r.group.group_code)
    const gruposYaInscritos = selected.filter(r => r.yaInscrito).map(r => r.group.group_code)
    const gruposFueraPlan   = selected.filter(r => !r.inPlan).map(r => r.group.group_code)

    const puedeConfirmar =
      selected.length > 0 &&
      !excedeLimite &&
      gruposSinCupo.length === 0 &&
      gruposYaInscritos.length === 0

    return {
      creditosSeleccionados,
      creditosRestantes:   MAX_CREDITS - creditosSeleccionados,
      excedeLimite,
      gruposSinCupo,
      gruposYaInscritos,
      gruposFueraPlan,
      puedeConfirmar,
    }
  }

  // ── Crear inscripciones ─────────────────────────────────────────────────────
  async createInscripciones(
    studentId:   string | number,
    selectedIds: Set<string | number>
  ): Promise<Enrollment[]> {
    const ids = [...selectedIds]
    const results = await Promise.all(
      ids.map(groupId =>
        inscripcionService.createEnrollment({
          student_id: String(studentId),
          group_id:   String(groupId),
          status:     'ACTIVE',
        })
      )
    )
    return results
  }

  // ── Cancelar inscripción ────────────────────────────────────────────────────
  async cancelarInscripcion(enrollmentId: string | number): Promise<Enrollment> {
    return inscripcionService.updateEnrollment(enrollmentId, { status: 'WITHDRAWN' })
  }
}

export const inscripcionBusiness = new InscripcionBusiness()