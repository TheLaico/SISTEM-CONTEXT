import React from 'react'

interface Props {
  isOpen: boolean
  title: string
  children: React.ReactNode
  onClose: () => void
}

const SemesterModal: React.FC<Props> = ({
  isOpen,
  title,
  children,
  onClose
}) => {

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">

      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">

        <div className="flex items-center justify-between mb-4">

          <h2 className="text-xl font-semibold">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>

        </div>

        <div>
          {children}
        </div>

      </div>

    </div>
  )
}

export default SemesterModal