import { Grade } from '../models/Grade'
import { GradeDetail } from '../models/GradeDetail'
import { Evaluation } from '../models/Evaluation'
import { Enrollment } from '../models/Enrollment'
import { Group } from '../models/Group'
import { Subject } from '../models/Subject'

export interface GradeDetailRow {
  criterionName: string
  levelName: string
  score: number
  comment: string
}

export interface NotaRow {
  gradeId: string
  evaluationName: string
  evaluationCode: string
  subjectName: string
  groupName: string
  weight: number
  finalScore: number | null
  status: string
  isLocked: boolean
  observations: string
  details: GradeDetailRow[]
}

class MisNotasBusiness {
  buildGradeDetailRows(details: GradeDetail[] = []): GradeDetailRow[] {
    return details.map((detail) => ({
      criterionName: detail.scale?.criterion?.name ?? 'Criterio sin nombre',
      levelName: detail.scale?.name ?? 'Nivel sin nombre',
      score: detail.score,
      comment: detail.comment ?? ''
    }))
  }

  buildNotaRows(
    grades: Grade[],
    evaluations: Evaluation[],
    enrollments: Enrollment[],
    groups: Group[],
    subjects: Subject[],
    gradeDetailsByGradeId: Record<string, GradeDetail[]> = {}
  ): NotaRow[] {
    return grades
      .map((grade) => {
        const enrollment = enrollments.find(
          (e) => e.id === grade.enrollment_id
        )

        if (!enrollment) {
          return null
        }

        const group = groups.find((g) => g.id === enrollment.group_id)
        const subject = subjects.find((s) => s.id === group?.subject_id)
        const evaluation = evaluations.find(
          (e) => e.id === grade.evaluation_id
        )

        if (!group || !subject || !evaluation) {
          return null
        }

        const evaluationCode = this.buildEvaluationCode(evaluation)

        return {
          gradeId: grade.id ?? '',
          evaluationName: evaluation.name ?? 'Sin nombre',
          evaluationCode,
          subjectName: subject.name ?? 'Sin nombre',
          groupName: group.name ?? 'Sin nombre',
          weight: evaluation.weight ?? 0,
          finalScore: grade.final_score ?? null,
          status: grade.status ?? 'DRAFT',
          isLocked: grade.is_locked ?? false,
          observations: grade.observations ?? '',
          details: this.buildGradeDetailRows(gradeDetailsByGradeId[grade.id ?? ''])
        }
      })
      .filter((row): row is NotaRow => row !== null)
  }

  buildEvaluationCode(evaluation: Evaluation): string {
    const id = evaluation.id ?? ''
    return `EVAL-${String(id).padStart(2, '0')}`
  }

  getStatusLabel(status: string): string {
    if (status === 'DRAFT') {
      return 'Borrador'
    }

    if (status === 'SENT') {
      return 'Enviada'
    }

    return status
  }

  getStatusColor(status: string): string {
    if (status === 'DRAFT') {
      return 'yellow'
    }

    if (status === 'SENT') {
      return 'green'
    }

    return 'gray'
  }

  calcularPromedioPonderado(rows: NotaRow[]): number | null {
    const rowsWithScore = rows.filter((row) => row.finalScore !== null)

    if (rowsWithScore.length === 0) {
      return null
    }

    const sum = rowsWithScore.reduce((acc, row) => {
      const score = row.finalScore ?? 0
      const weight = row.weight ?? 0
      return acc + (score * weight) / 100
    }, 0)

    return sum
  }

  formatScore(score: number | null): string {
    if (score === null) {
      return 'Pendiente'
    }

    return score.toFixed(1)
  }
}

export const misNotasBusiness = new MisNotasBusiness()
