import { Enrollment } from '../models/Enrollment'
import { Group } from '../models/Group'
import { Semester } from '../models/Semester'
import { Subject } from '../models/Subject'

export interface AsignaturaDelSemestre {
  enrollmentId: number;
  groupId: number;
  groupName: string;
  groupCode: string;
  subjectId: number;
  subjectName: string;
  subjectCode: string;
  credits: number;
  semesterId: number;
  semesterName: string;
  teacherId: number;
}

function toNumber(value: string | number | undefined): number {
  const parsedValue = Number(value)
  return Number.isNaN(parsedValue) ? 0 : parsedValue
}

function findActiveSemester(semesters: Semester[]): Semester | undefined {
  return semesters.find((semester) => semester.is_active === true)
}

export function getAsignaturasDelSemestreActivo(
  semesters: Semester[],
  enrollments: Enrollment[],
  groups: Group[],
  subjects: Subject[]
): AsignaturaDelSemestre[] {
  const activeSemester = findActiveSemester(semesters)

  if (!activeSemester) {
    return []
  }

  const activeSemesterGroups = groups.filter(
    (group) => group.semester_id === activeSemester.id
  )

  const results: AsignaturaDelSemestre[] = []

  for (const enrollment of enrollments) {
    const group = activeSemesterGroups.find(
      (currentGroup) => currentGroup.id === enrollment.group_id
    )

    if (!group) {
      continue
    }

    const subject = subjects.find(
      (currentSubject) => currentSubject.id === group.subject_id
    )

    if (!subject) {
      continue
    }

    results.push({
      enrollmentId: toNumber(enrollment.id),
      groupId: toNumber(group.id),
      groupName: group.name,
      groupCode: group.group_code,
      subjectId: toNumber(subject.id),
      subjectName: subject.name,
      subjectCode: subject.code,
      credits: subject.credits,
      semesterId: toNumber(activeSemester.id),
      semesterName: activeSemester.name,
      teacherId: toNumber(group.teacher_id)
    })
  }

  return results
}

export function formatCredits(credits: number): string {
  return `${credits} crédito${credits === 1 ? '' : 's'}`
}
