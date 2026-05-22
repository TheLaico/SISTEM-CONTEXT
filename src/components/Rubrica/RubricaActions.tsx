import React, { useRef, useState } from 'react';
import { Rubric } from '../../models/Rubric';
import { deleteRubrica, archivarRubrica } from '../../services/rubricaService';

interface RubricaActionsProps {
  rubrica: Rubric;
  onArchived?: () => void;
  onDeleted?: () => void;
}

const RubricaActions = ({ rubrica, onArchived, onDeleted }: RubricaActionsProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const archiveDialogRef = useRef<HTMLDialogElement | null>(null);
  const deleteDialogRef = useRef<HTMLDialogElement | null>(null);

  const isPublished = !!rubrica?.is_public;

  const openArchiveConfirm = () => {
    setError(null);
    archiveDialogRef.current?.showModal();
  };

  const openDeleteConfirm = () => {
    setError(null);
    deleteDialogRef.current?.showModal();
  };

  const handleArchive = async () => {
    if (!rubrica.id) return;
    setLoading(true);
    setError(null);
    try {
      await archivarRubrica(rubrica.id);
      archiveDialogRef.current?.close();
      onArchived?.();
    } catch (err: any) {
      setError(err?.message || 'No se pudo archivar la rúbrica.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!rubrica.id) return;
    setLoading(true);
    setError(null);
    try {
      await deleteRubrica(rubrica.id);
      deleteDialogRef.current?.close();
      onDeleted?.();
    } catch (err: any) {
      setError(err?.message || 'No se pudo eliminar la rúbrica.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {isPublished ? (
        <>
          <button
            onClick={openArchiveConfirm}
            disabled={loading}
            className="inline-flex items-center px-3 py-1.5 bg-yellow-500 text-white rounded-md text-sm"
          >
            {loading ? 'Procesando...' : 'Archivar'}
          </button>

          <dialog ref={archiveDialogRef} className="rounded-md p-4">
            <h3 className="font-medium text-lg">Archivar rúbrica</h3>
            <p className="mt-2">Esta rúbrica está publicada y no puede eliminarse. ¿Deseas archivarla?</p>
            {error && <p className="text-red-600 mt-2">{error}</p>}
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => archiveDialogRef.current?.close()}
                className="px-3 py-1.5 rounded-md border"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={handleArchive}
                className="px-3 py-1.5 rounded-md bg-yellow-500 text-white"
                disabled={loading}
              >
                {loading ? 'Archivando...' : 'Archivar'}
              </button>
            </div>
          </dialog>
        </>
      ) : (
        <>
          <button
            onClick={openDeleteConfirm}
            disabled={loading}
            className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white rounded-md text-sm"
          >
            {loading ? 'Procesando...' : 'Eliminar'}
          </button>

          <dialog ref={deleteDialogRef} className="rounded-md p-4">
            <h3 className="font-medium text-lg">Eliminar rúbrica</h3>
            <p className="mt-2">¿Estás seguro que quieres eliminar esta rúbrica? Esta acción no se puede deshacer.</p>
            {error && <p className="text-red-600 mt-2">{error}</p>}
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => deleteDialogRef.current?.close()}
                className="px-3 py-1.5 rounded-md border"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1.5 rounded-md bg-red-600 text-white"
                disabled={loading}
              >
                {loading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </dialog>
        </>
      )}
    </div>
  );
};

export default RubricaActions;
