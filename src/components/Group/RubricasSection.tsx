// src/components/Grupos/RubricasSection.tsx
// Nota: usa useNavigate() para navegar a /rubricas/{id}, excepción
// justificada ya que la navegación a rúbricas es responsabilidad del componente.
import { useNavigate } from 'react-router-dom'
import { Eye, Star, StarOff } from 'lucide-react'
import { Rubric } from '../../models/Rubric'

interface RubricasSectionProps {
  rubrics: Rubric[]
  isLoading?: boolean
  isReadOnly?: boolean
}

function rubricBadge(r: Rubric): { label: string; cls: string } {
  if (r.is_archived)  return { label: 'Archivada', cls: 'bg-gray-100 text-gray-500' }
  if (r.is_public)    return { label: 'Publicada',  cls: 'bg-green-100 text-green-700' }
  return                     { label: 'Borrador',   cls: 'bg-yellow-100 text-yellow-700' }
}

export default function RubricasSection({ rubrics, isLoading, isReadOnly }: RubricasSectionProps) {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-5 h-5 text-indigo-500" />
        <h2 className="text-base font-semibold text-gray-800">Rúbricas</h2>
      </div>

      {isReadOnly && (
        <p className="text-xs text-gray-400 italic mb-3">Solo lectura. El semestre está cerrado.</p>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="animate-pulse h-12 bg-gray-100 rounded-lg" />
          ))}
        </div>
      ) : rubrics.length === 0 ? (
        <div className="flex flex-col items-center py-10 text-gray-400">
          <StarOff className="w-8 h-8 mb-2 opacity-40" />
          <p className="text-sm text-center">No hay rúbricas asociadas a las evaluaciones de este grupo.</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {rubrics.map((r) => {
            const badge = rubricBadge(r)
            return (
              <li key={String(r.id)} className="py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{r.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{r.criteria?.length ?? 0} criterios</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 ${badge.cls}`}>
                  {badge.label}
                </span>
                <button
                  onClick={() => navigate(`/rubricas/${r.id}`)}
                  className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 transition-colors shrink-0"
                >
                  <Eye className="w-4 h-4" /> Ver detalle
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}