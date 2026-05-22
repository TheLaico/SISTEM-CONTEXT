import React from 'react'

interface Props {
  isOpen: boolean

  title: string

  children: React.ReactNode

  onClose: () => void
}

const StudyPlanModal: React.FC<Props> = ({
  isOpen,
  title,
  children,
  onClose
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-xl"
          >
            ×
          </button>
        </div>

        {children}
      </div>
    </div>
  )
}

export default StudyPlanModal