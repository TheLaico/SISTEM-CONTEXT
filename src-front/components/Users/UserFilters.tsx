import React, { useState } from 'react';
import { UserRole } from '../../models/UserRole';
import { UserSearchFilters } from '../../services/userService';

interface UserFiltersProps {
  onSearch: (filters: UserSearchFilters) => void;
  onClear: () => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({ onSearch, onClear }) => {
  const [searchText, setSearchText] = useState('');
  const [role, setRole] = useState('');
  const [isActive, setIsActive] = useState('');

  const handleSearch = () => {
    const filters: UserSearchFilters = {};

    if (role) {
      filters.role = role;
    }

    if (isActive !== '') {
      filters.is_active = isActive === 'true';
    }

    if (searchText.trim()) {
      filters.email = searchText.trim();
    }

    onSearch(filters);
  };

  const handleClear = () => {
    setSearchText('');
    setRole('');
    setIsActive('');
    onClear();
  };

  return (
    <div className="mb-4 rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-black dark:text-white">
            Buscar
          </label>
          <input
            type="text"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Buscar por email..."
            className="w-full rounded border border-stroke p-2 text-sm outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-black dark:text-white">
            Rol
          </label>
          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="w-full rounded border border-stroke p-2 text-sm outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark"
          >
            <option value="">Todos</option>
            <option value={UserRole.ADMIN}>Administrador</option>
            <option value={UserRole.TEACHER}>Docente</option>
            <option value={UserRole.STUDENT}>Estudiante</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-black dark:text-white">
            Carrera
          </label>
          <select
            disabled
            className="w-full cursor-not-allowed rounded border border-stroke bg-gray-100 p-2 text-sm outline-none dark:border-strokedark dark:bg-meta-4"
          >
            <option value="">Pendiente por matrícula</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-black dark:text-white">
            Estado
          </label>
          <select
            value={isActive}
            onChange={(event) => setIsActive(event.target.value)}
            className="w-full rounded border border-stroke p-2 text-sm outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark"
          >
            <option value="">Todos</option>
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-3">
        <button
          type="button"
          onClick={handleClear}
          className="rounded-md border border-stroke px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-100 dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
        >
          Limpiar filtros
        </button>

        <button
          type="button"
          onClick={handleSearch}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-opacity-90"
        >
          Buscar
        </button>
      </div>
    </div>
  );
};

export default UserFilters;
