import React, { useRef, useState, useEffect } from 'react';
import { UserTableRow } from '../../business/UserBusiness';

interface UserTableActionsProps {
  item: UserTableRow;
  onAction: (action: string, item: UserTableRow) => void;
}

const UserTableActions: React.FC<UserTableActionsProps> = ({
  item,
  onAction,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (action: string) => {
    setOpen(false);
    onAction(action, item);
  };

  return (
    <div className="relative flex items-center gap-2" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => onAction('edit', item)}
        className="rounded-md border border-stroke px-2 py-1 text-sm hover:bg-gray-100 dark:border-strokedark dark:hover:bg-meta-4"
        title="Editar usuario"
      >
        ✎
      </button>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-md border border-stroke px-2 py-1 text-sm hover:bg-gray-100 dark:border-strokedark dark:hover:bg-meta-4"
        title="Opciones"
      >
        ⋮
      </button>

      {open && (
        <div className="absolute right-0 top-9 z-50 w-44 rounded-md border border-stroke bg-white shadow-lg dark:border-strokedark dark:bg-boxdark">
          <button
            type="button"
            onClick={() => handleOptionClick('edit')}
            className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-meta-4"
          >
            Editar usuario
          </button>

          <button
            type="button"
            onClick={() => handleOptionClick('deactivate')}
            className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          >
            Desactivar usuario
          </button>

          <button
            type="button"
            onClick={() => handleOptionClick('view')}
            className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-meta-4"
          >
            Ver detalle
          </button>
        </div>
      )}
    </div>
  );
};

export default UserTableActions;
