import React from 'react'

interface Props {
  value: string
  onChange: (value: string) => void
}

const SubjectSearchBar: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">Buscar asignatura</label>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Nombre o código"
        className="w-full rounded-md border border-stroke bg-white px-4 py-2 text-sm text-gray-700 outline-none transition focus:border-primary dark:border-strokedark dark:bg-boxdark dark:text-white"
      />
    </div>
  )
}

export default SubjectSearchBar
