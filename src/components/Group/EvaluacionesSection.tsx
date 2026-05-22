// src/components/Grupos/EvaluacionesSection.tsx
import { useState } from 'react'
import { ClipboardList, ClipboardX, Link, Pencil, Plus, Trash2 } from 'lucide-react'
import { EvaluationRow } from '../../business/GroupBusiness'
import { EvaluationCreatePayload } from '../../types/evaluacion'

interface EvaluacionesSectionProps {
  evaluations: EvaluationRow[]
  isLoading?: boolean
  isReadOnly?: boolean
  onCreateEvaluation: (payload: EvaluationCreatePayload) => Promise<void>
  onUpdateEvaluation: (id: number | string, payload: Partial<EvaluationCreatePayload>) => Promise<void>
  onDeleteEvaluation: (id: number | string) => Promise<void>
  onAssociateRubric:  (evaluationId: number | string, rubricId: number | string) => Promise<void>
}

interface FormState { name: string; weight: string; description: string }
const EMPTY_FORM: FormState = { name: '', weight: '', description: '' }

const RUBRIC_BADGE: Record<string, string> = {
  associated_public: 'bg-green-100 text-green-700',
  associated_draft:  'bg-yellow-100 text-yellow-700',
  none:              'bg-gray-100 text-gray-500',
}

export default function EvaluacionesSection({
  evaluations, isLoading, isReadOnly,
  onCreateEvaluation, onUpdateEvaluation, onDeleteEvaluation,
}: EvaluacionesSectionProps) {
  const [modalOpen, setModalOpen]   = useState(false)
  const [editTarget, setEditTarget] = useState<EvaluationRow | null>(null)
  const [form, setForm]             = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving]         = useState(false)

  const openCreate = () => { setEditTarget(null); setForm(EMPTY_FORM); setModalOpen(true) }
  const openEdit   = (ev: EvaluationRow) => {
    setEditTarget(ev)
    setForm({ name: ev.name, weight: String(ev.weight), description: ev.description })
    setModalOpen(true)
  }
  const closeModal = () => { setModalOpen(false); setEditTarget(null); setForm(EMPTY_FORM) }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload: EvaluationCreatePayload = {
        name:        form.name,
        weight:      Number(form.weight),
        description: form.description || undefined,
        group_id:    0, // DetalleGrupo debe pasarlo vía props si es necesario
        subject_id:  0,
      }
      if (editTarget) {
        await onUpdateEvaluation(editTarget.id, { name: payload.name, weight: payload.weight, description: payload.description })
      } else {
        await onCreateEvaluation(payload)
      }
      closeModal()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <ClipboardList className="w-5 h-5 text-indigo-500" />
        <h2 className="text-base font-semibold text-gray-800">Evaluaciones</h2>
        <button
          onClick={openCreate}
          disabled={isReadOnly}
          className="ml-auto flex items-center gap-1 text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" /> Nueva evaluación
        </button>
      </div>

      {/* Lista */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse h-14 bg-gray-100 rounded-lg" />
          ))}
        </div>
      ) : evaluations.length === 0 ? (
        <div className="flex flex-col items-center py-10 text-gray-400">
          <ClipboardX className="w-8 h-8 mb-2 opacity-40" />
          <p className="text-sm">No hay evaluaciones registradas.</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {evaluations.map((ev) => {
            const rubricKey = ev.hasRubric ? (ev.rubricIsPublic ? 'associated_public' : 'associated_draft') : 'none'
            const rubricLabel = ev.hasRubric ? (ev.rubricIsPublic ? 'Rúbrica asociada' : 'Rúbrica borrador') : 'Sin rúbrica'
            return (
              <li key={String(ev.id)} className="py-3 flex items-center gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{ev.name}</p>
                  {ev.description && (
                    <p className="text-xs text-gray-400 truncate">{ev.description}</p>
                  )}
                </div>
                <span className="text-xs bg-indigo-50 text-indigo-600 font-semibold px-2 py-0.5 rounded-full">
                  {ev.weightLabel}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${RUBRIC_BADGE[rubricKey]}`}>
                  {rubricLabel}
                </span>
                {!isReadOnly && (
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(ev)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500 transition-colors" title="Editar">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteEvaluation(ev.id)}
                      disabled={!ev.canDelete}
                      className="p-1.5 rounded hover:bg-red-50 text-red-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      disabled={!ev.canAssociateRubric}
                      className="p-1.5 rounded hover:bg-indigo-50 text-indigo-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Asociar rúbrica"
                    >
                      <Link className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-semibold text-gray-800">
              {editTarget ? 'Editar evaluación' : 'Nueva evaluación'}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Nombre</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  placeholder="Ej: Parcial 1"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Peso (%)</label>
                <input
                  type="number"
                  min={1} max={100}
                  value={form.weight}
                  onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  placeholder="Ej: 30"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Descripción (opcional)</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                  placeholder="Descripción de la evaluación..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={closeModal} className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name.trim() || !form.weight}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-40"
              >
                {saving ? 'Guardando…' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}