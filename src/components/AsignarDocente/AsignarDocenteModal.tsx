// src/components/AsignarDocente/AsignarDocenteModal.tsx
import { useState, useRef, useEffect } from 'react'
import { Group } from '../../models/Group'
import { Semester } from '../../models/Semester'
import { User } from '../../models/User'
import DocenteCard from './DocenteCard'

interface Props {
  group: Group
  activeSemester: Semester | null
  onSearchTeachers: (q: string) => Promise<User[]>
  onAssign: (groupId: string, teacherId: string) => Promise<void>
  onClose: () => void
}

const AsignarDocenteModal = ({ group, activeSemester, onSearchTeachers, onAssign, onClose }: Props) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<User[]>([])
  const [selected, setSelected] = useState<User | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [searching, setSearching] = useState(false)
  const [saving, setSaving] = useState(false)
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isReassign = !!group.teacher_id
  const hasSubject = !!group.subject
  const hasNotes = !!(group as any).has_notes

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    if (debounce.current) clearTimeout(debounce.current)
    debounce.current = setTimeout(async () => {
      setSearching(true)
      const data = await onSearchTeachers(query)
      setResults(data)
      setSearching(false)
    }, 400)
  }, [query])

  const validate = (teacher: User): string | null => {
    if (!teacher.is_active) return 'El docente no está activo.'
    if (isReassign && String(group.teacher_id) === String(teacher.id))
      return 'Este docente ya está asignado a este grupo.'
    // Validar duplicidad: mismo docente, misma asignatura, mismo semestre
    const profile = teacher.profile as any
    const assignedGroups: Group[] = profile?.groups ?? []
    const conflict = assignedGroups.find(
      (g) =>
        String(g.subject_id) === String(group.subject_id) &&
        String(g.semester_id) === String(activeSemester?.id) &&
        String(g.id) !== String(group.id),
    )
    if (conflict)
      return 'El docente ya tiene asignado un grupo de esta asignatura en el semestre activo.'
    return null
  }

  const handleSelect = (teacher: User) => {
    const err = validate(teacher)
    setValidationError(err)
    setSelected(teacher)
    setResults([])
    setQuery('')
    setSuccessMsg(null)
  }

  const handleConfirm = async () => {
    if (!selected || validationError) return
    setSaving(true)
    try {
      await onAssign(String(group.id), String(selected.id))
      setSuccessMsg('Docente asignado correctamente.')
      setTimeout(onClose, 1800)
    } catch (err: any) {
      setValidationError(err.message || 'Error al asignar docente.')
    } finally {
      setSaving(false)
    }
  }

  const canProceed = hasSubject && !(isReassign && hasNotes)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-strokedark">
          <h2 className="text-lg font-semibold text-black dark:text-white">
            {isReassign ? 'Reasignar Docente' : 'Asignar Docente'}
          </h2>
          <button
            onClick={onClose}
            className="text-bodydark2 hover:text-black dark:hover:text-white transition text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Info del grupo */}
        <div className="bg-gray-2 dark:bg-meta-4 px-6 py-4 space-y-2">
          <InfoRow label="Grupo" value={`${group.group_code} — ${group.name}`} />
          <InfoRow
            label="Asignatura"
            value={
              hasSubject ? (
                group.subject!.name
              ) : (
                <span className="text-warning text-xs font-medium">
                  ⚠️ Este grupo no tiene asignatura asignada
                </span>
              )
            }
          />
          <InfoRow label="Semestre" value={group.semester?.name ?? '—'} />

          {isReassign && hasNotes && (
            <div className="mt-2 rounded border border-warning bg-warning bg-opacity-10 px-4 py-2">
              <p className="text-xs font-medium text-warning">
                🔒 No es posible reasignar: este grupo tiene notas registradas.
              </p>
            </div>
          )}
        </div>

        {/* Cuerpo: buscar y seleccionar */}
        {canProceed && (
          <div className="px-6 py-5 space-y-4">
            {/* Buscador */}
            {!selected && (
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-bodydark2">
                  Buscar docente
                </label>
                <input
                  autoFocus
                  type="text"
                  placeholder="Nombre, apellido o cédula..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full rounded border border-stroke bg-transparent px-4 py-2.5 text-sm text-black outline-none focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white"
                />
                {searching && (
                  <p className="mt-1 text-xs text-bodydark2">Buscando...</p>
                )}
                {results.length > 0 && (
                  <ul className="mt-1 max-h-44 overflow-y-auto rounded border border-stroke divide-y divide-stroke dark:border-strokedark dark:divide-strokedark">
                    {results.map((t) => (
                      <li
                        key={t.id}
                        onClick={() => handleSelect(t)}
                        className="flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-2 dark:hover:bg-meta-4 transition"
                      >
                        <span className="text-black dark:text-white">
                          {(t.profile as any)?.first_name ?? ''}{' '}
                          {(t.profile as any)?.last_name ?? ''}
                        </span>
                        <span className="text-xs text-bodydark2">
                          {(t.profile as any)?.identification ?? t.code ?? ''}
                        </span>
                        {!t.is_active && (
                          <span className="ml-2 rounded-full bg-danger bg-opacity-10 px-2 py-0.5 text-xs text-danger">
                            Inactivo
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Card del docente seleccionado */}
            {selected && (
              <DocenteCard
                teacher={selected}
                onClear={() => { setSelected(null); setValidationError(null) }}
              />
            )}

            {/* Mensajes de validación */}
            {validationError && (
              <div className="rounded border border-danger bg-danger bg-opacity-10 px-4 py-2.5">
                <p className="text-xs font-medium text-danger">{validationError}</p>
              </div>
            )}
            {successMsg && (
              <div className="rounded border border-success bg-success bg-opacity-10 px-4 py-2.5">
                <p className="text-sm font-semibold text-success text-center">{successMsg}</p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-stroke px-6 py-4 dark:border-strokedark">
          <button
            onClick={onClose}
            className="rounded border border-stroke px-5 py-2 text-sm font-medium text-black hover:bg-gray-100 dark:border-strokedark dark:text-white dark:hover:bg-meta-4 transition"
          >
            Cancelar
          </button>
          {canProceed && (
            <button
              onClick={handleConfirm}
              disabled={!selected || !!validationError || saving}
              className="rounded bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {saving ? 'Guardando...' : isReassign ? 'Confirmar reasignación' : 'Asignar docente'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Helper row
const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-start gap-2 text-sm">
    <span className="min-w-[90px] font-semibold text-bodydark2">{label}:</span>
    <span className="text-black dark:text-white">{value}</span>
  </div>
)

export default AsignarDocenteModal