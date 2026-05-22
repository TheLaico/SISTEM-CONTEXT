import React, { useState } from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
  onPublish: (year: number) => void
}

const PublishVersionModal: React.FC<Props> = ({ isOpen, onClose, onPublish }) => {
  if (!isOpen) return null

  const [year, setYear] = useState<number>(new Date().getFullYear())

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded bg-white p-6">
        <h3 className="text-lg font-semibold">Publicar nueva versión</h3>
        <div className="mt-4 space-y-3">
          <input value={year} onChange={(e) => setYear(Number(e.target.value))} type="number" placeholder="Año de la versión (ej. 2026)" className="w-full rounded border px-3 py-2" />
          <div className="text-sm text-gray-500">La nueva versión reemplazará la anterior. Asegúrate de que cumple las validaciones.</div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded border px-3 py-1">Cancelar</button>
          <button onClick={() => onPublish(year)} className="rounded bg-blue-600 px-3 py-1 text-white">Publicar</button>
        </div>
      </div>
    </div>
  )
}

export default PublishVersionModal
