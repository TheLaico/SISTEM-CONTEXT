// src/pages/PlanEstudios/components/SemesterStructureView.tsx
import React from 'react'
import { StudyPlanSubject } from '../../../types/studyPlan'

interface Props {
  subjectsBySemester: Record<number, StudyPlanSubject[]>
  totalSubjects: number
  totalCredits: number
  updatedAt?: string
}

const SemesterStructureView: React.FC<Props> = ({
  subjectsBySemester,
  totalSubjects,
  totalCredits,
  updatedAt,
}) => {
  const semesters = Object.keys(subjectsBySemester).map(Number).sort((a, b) => a - b)

  if (semesters.length === 0) {
    return (
      <div className="flex min-h-32 items-center justify-center rounded-2xl border border-dashed border-stroke bg-white p-8 text-center shadow-card dark:border-strokedark dark:bg-boxdark">
        <p className="text-sm text-body dark:text-bodydark">
          No hay asignaturas organizadas por semestre aún.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Resumen académico */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-stroke bg-white p-4 shadow-card dark:border-strokedark dark:bg-boxdark">
          <p className="text-xs font-semibold uppercase tracking-wide text-body dark:text-bodydark">Total asignaturas</p>
          <p className="mt-1 text-2xl font-bold text-black dark:text-white">{totalSubjects}</p>
        </div>
        <div className="rounded-2xl border border-stroke bg-white p-4 shadow-card dark:border-strokedark dark:bg-boxdark">
          <p className="text-xs font-semibold uppercase tracking-wide text-body dark:text-bodydark">Total créditos</p>
          <p className="mt-1 text-2xl font-bold text-black dark:text-white">{totalCredits}</p>
        </div>
        <div className="rounded-2xl border border-stroke bg-white p-4 shadow-card dark:border-strokedark dark:bg-boxdark">
          <p className="text-xs font-semibold uppercase tracking-wide text-body dark:text-bodydark">Última actualización</p>
          <p className="mt-1 text-sm font-medium text-black dark:text-white">
            {updatedAt ? new Date(updatedAt).toLocaleDateString('es-CO') : '—'}
          </p>
        </div>
      </div>

      {/* Por semestre */}
      {semesters.map((semester) => {
        const subjects = subjectsBySemester[semester]
        const semesterCredits = subjects.reduce((sum, s) => sum + s.credits, 0)

        return (
          <div
            key={semester}
            className="rounded-2xl border border-stroke bg-white shadow-card dark:border-strokedark dark:bg-boxdark"
          >
            {/* Encabezado del semestre */}
            <div className="flex items-center justify-between border-b border-stroke bg-gray px-5 py-3 dark:border-strokedark dark:bg-meta-4">
              <h4 className="text-sm font-semibold text-black dark:text-white">
                Semestre {semester}
              </h4>
              <div className="flex items-center gap-3 text-xs text-body dark:text-bodydark">
                <span>{subjects.length} asignatura{subjects.length !== 1 ? 's' : ''}</span>
                <span className="h-3 w-px bg-stroke dark:bg-strokedark" />
                <span>{semesterCredits} créditos</span>
              </div>
            </div>

            {/* Lista de asignaturas */}
            <div className="divide-y divide-stroke dark:divide-strokedark">
              {subjects.map((subject) => (
                <div
                  key={subject.subject_id}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary bg-opacity-10 text-xs font-bold text-primary">
                      {subject.subject_code?.slice(0, 2).toUpperCase() || '—'}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-black dark:text-white">{subject.subject_name}</p>
                      <p className="text-xs text-body dark:text-bodydark">{subject.subject_code}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-body dark:text-bodydark">
                    {subject.credits} cr.
                  </span>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default SemesterStructureView