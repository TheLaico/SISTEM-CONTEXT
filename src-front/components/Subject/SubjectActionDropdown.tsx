import React, { useEffect, useRef, useState } from 'react'
import { Subject } from '../../models/Subject'

interface Props {
  subject: Subject
  onEdit: (subject: Subject) => void
  onArchive: (subject: Subject) => void
}

const SubjectActionDropdown: React.FC<Props> = ({ subject, onEdit, onArchive }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center rounded-full border border-gray-300 bg-white px-3 py-1 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
      >
        Acciones
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-40 overflow-hidden rounded-2xl border border-gray-200 bg-white text-sm shadow-lg">
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              onEdit(subject)
            }}
            className="block w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              onArchive(subject)
            }}
            className="block w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50"
          >
            Archivar
          </button>
        </div>
      )}
    </div>
  )
}

export default SubjectActionDropdown
