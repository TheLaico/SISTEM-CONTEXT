import {
  CreateSubjectDto,
  Subject,
  SubjectFilters,
  UpdateSubjectDto
} from '../models/Subject'

import { groupService } from '../services/groupService'
import { semesterService } from '../services/semesterService'
import { studyPlanService } from '../services/studyPlanService'
import { subjectService } from '../services/subjectService'

export const subjectBusiness = {
  async createSubject(
    payload: CreateSubjectDto
  ): Promise<Subject> {
    this.validateSubject(payload)
    await this.ensureUniqueSubjectCode(payload.code)

    return await subjectService.createSubject(
      payload
    )
  },

  async getSubjects(): Promise<Subject[]> {
    return await subjectService.getSubjects()
  },

  async getSubjectById(
    id: string
  ): Promise<Subject> {
    if (!id) {
      throw new Error(
        'Subject id is required'
      )
    }

    return await subjectService.getSubjectById(
      id
    )
  },

  async updateSubject(
    id: string,
    payload: UpdateSubjectDto
  ): Promise<Subject> {
    if (!id) {
      throw new Error(
        'Subject id is required'
      )
    }

    this.validateUpdateSubject(payload)

    if (payload.code) {
      await this.ensureUniqueSubjectCode(
        payload.code,
        id
      )
    }

    return await subjectService.updateSubject(
      id,
      payload
    )
  },

  async deleteSubject(
    id: string
  ): Promise<void> {
    if (!id) {
      throw new Error(
        'Subject id is required'
      )
    }

    await subjectService.deleteSubject(id)
  },

  async searchSubjects(
    filters: SubjectFilters
  ): Promise<Subject[]> {
    return await subjectService.searchSubjects(
      filters
    )
  },

  async ensureUniqueSubjectCode(
    code: string,
    currentId?: string
  ): Promise<void> {
    const subjects =
      await subjectService.getSubjects()
    const normalizedCode = code
      .trim()
      .toLowerCase()

    const duplicate = subjects.some(
      (subject) =>
        subject.code
          .trim()
          .toLowerCase() === normalizedCode &&
        subject.id !== currentId
    )

    if (duplicate) {
      throw new Error('Subject code already exists')
    }
  },

  validateSubject(
    payload: CreateSubjectDto
  ): void {
    if (!payload.name?.trim()) {
      throw new Error(
        'Subject name is required'
      )
    }

    if (!payload.code?.trim()) {
      throw new Error(
        'Subject code is required'
      )
    }

    if (
      payload.credits === undefined ||
      payload.credits <= 0
    ) {
      throw new Error(
        'Credits must be greater than zero'
      )
    }
  },

  validateUpdateSubject(
    payload: UpdateSubjectDto
  ): void {
    if (
      payload.name !== undefined &&
      !payload.name.trim()
    ) {
      throw new Error(
        'Subject name cannot be empty'
      )
    }

    if (
      payload.code !== undefined &&
      !payload.code.trim()
    ) {
      throw new Error(
        'Subject code cannot be empty'
      )
    }

    if (
      payload.credits !== undefined &&
      payload.credits <= 0
    ) {
      throw new Error(
        'Credits must be greater than zero'
      )
    }
  },

  async canEditSubject(id: string): Promise<boolean> {
    try {
      // Obtener todos los grupos con esta asignatura
      const groups = await groupService.getGroups()
      const subjectGroups = groups.filter(g => g.subject_id === id)

      if (subjectGroups.length === 0) {
        return true
      }

      // Obtener semestres activos
      const allSemesters = await semesterService.getSemesters()
      const activeSemesters = allSemesters.filter(s => s.is_active)

      // Verificar si hay grupos activos en semestres vigentes
      const hasActiveGroups = subjectGroups.some(g =>
        activeSemesters.some(s => s.id === g.semester_id)
      )

      return !hasActiveGroups
    } catch (error) {
      console.error('Error checking if subject can be edited:', error)
      return true
    }
  },

  async canArchiveSubject(id: string): Promise<{ canArchive: boolean; reason?: string }> {
    try {
      // Verificar grupos activos
      const groups = await groupService.getGroups()
      const subjectGroups = groups.filter(g => g.subject_id === id)

      if (subjectGroups.length > 0) {
        const allSemesters = await semesterService.getSemesters()
        const activeSemesters = allSemesters.filter(s => s.is_active)

        const activeGroups = subjectGroups.filter(g =>
          activeSemesters.some(s => s.id === g.semester_id)
        )

        if (activeGroups.length > 0) {
          const semesterNames = [...new Set(
            activeGroups
              .map(g => allSemesters.find(s => s.id === g.semester_id)?.name)
              .filter(Boolean)
          )].join(', ')

          return {
            canArchive: false,
            reason: `La asignatura tiene ${activeGroups.length} grupo(s) activo(s) en el semestre vigente (${semesterNames}).`
          }
        }
      }

      // Verificar planes de estudio publicados
      const studyPlans = await studyPlanService.getStudyPlans()
      const publishedPlans = studyPlans.filter(
        sp => sp.subject_id === id && sp.is_published
      )

      if (publishedPlans.length > 0) {
        const planNames = publishedPlans.map(p => p.name).join(', ')
        return {
          canArchive: false,
          reason: `La asignatura está incluida en plan(es) de estudio vigente(s): ${planNames}.`
        }
      }

      return { canArchive: true }
    } catch (error) {
      console.error('Error checking if subject can be archived:', error)
      // Si hay error, permitir el archivo por ahora
      return { canArchive: true }
    }
  }
}