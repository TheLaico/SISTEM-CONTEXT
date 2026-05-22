import React, { useEffect, useRef, useState } from 'react'

interface ActionItem {
  key: string
  label: string
  onClick: () => void
  colorClass?: string
  icon?: React.ReactNode
}

interface Props {
  items: ActionItem[]
  align?: 'right' | 'left'
}

const ActionDropdown: React.FC<Props> = ({ items, align = 'right' }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (!ref.current) return
      if (!ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen((s) => !s)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <svg className="h-5 w-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {open && (
        <div
          className={`absolute z-50 mt-2 min-w-[160px] rounded-xl bg-white border border-stroke shadow-lg py-2 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {items.map((it) => (
            <button
              key={it.key}
              onClick={() => {
                it.onClick()
                setOpen(false)
              }}
              className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                it.colorClass || 'text-gray-700'
              }`}
            >
              {it.icon}
              <span>{it.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ActionDropdown
