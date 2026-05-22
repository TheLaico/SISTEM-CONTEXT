import React from 'react';

interface BotonAccionesProps {
    onEdit: () => void;
    onDelete: () => void;
    onView?: () => void;
}

const BotonAcciones: React.FC<BotonAccionesProps> = ({ onEdit, onDelete, onView }) => {
    return (
        <div className="flex gap-2">
            {onView && (
                <button
                    type="button"
                    onClick={onView}
                    className="rounded-md border border-stroke px-3 py-1 text-xs font-medium text-blue-500 hover:bg-blue-100"
                >
                    Ver
                </button>
            )}
            <button
                type="button"
                onClick={onEdit}
                className="rounded-md border border-stroke px-3 py-1 text-xs font-medium text-green-500 hover:bg-green-100"
            >
                Editar
            </button>
            <button
                type="button"
                onClick={onDelete}
                className="rounded-md border border-stroke px-3 py-1 text-xs font-medium text-red-500 hover:bg-red-100"
            >
                Eliminar
            </button>
        </div>
    );
};

export default BotonAcciones;
