import { Criterion } from '../models/Criterion'
import { Evaluation } from '../models/Evaluation'
import { Rubric } from '../models/Rubric'

class MisEvaluacionesBusiness {
  filterEvaluationsByGroups(
    evaluations: Evaluation[],
    groupIds: string[]
  ): Evaluation[] {
    if (groupIds.length === 0) {
      return []
    }

    return evaluations.filter((evaluation) => {
      return Boolean(
        evaluation.group_id &&
        groupIds.includes(evaluation.group_id)
      )
    })
  }

  hasRubric(evaluation: Evaluation): boolean {
    return Boolean(evaluation.rubric_id)
  }

  buildEvaluationCode(evaluation: Evaluation): string {
    const id = evaluation.id ?? ''
    return `EVAL-${String(id).padStart(2, '0')}`
  }

  buildRubricSummary(
    rubric: Rubric,
    criteria: Criterion[]
  ): { totalCriteria: number; totalWeight: number } {
    const totalCriteria = criteria.length

    const totalWeight = criteria.reduce((sum, criterion) => {
      return sum + (criterion.weight ?? 0)
    }, 0)

    void rubric

    return {
      totalCriteria,
      totalWeight
    }
  }
}

export const misEvaluacionesBusiness = new MisEvaluacionesBusiness()
