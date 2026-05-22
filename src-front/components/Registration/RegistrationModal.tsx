// src/components/Registration/RegistrationModal.tsx

import React from 'react'

interface Props {
  isOpen: boolean

  title: string

  children: React.ReactNode

  onClose: () => void
}

const RegistrationModal: React.FC<Props> = ({
  isOpen,
  title,
  children,
  onClose
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg">
        <div className="flex justify-between">
          <h2>{title}</h2>

          <button onClick={onClose}>
            X
          </button>
        </div>

        {children}
      </div>
    </div>
  )
}

export default RegistrationModal