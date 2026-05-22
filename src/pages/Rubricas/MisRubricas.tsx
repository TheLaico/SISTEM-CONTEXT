import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';
import { getRubricas, deleteRubrica, archivarRubrica, publishRubric } from '../../services/rubricaService';

interface RubricaItem {
  id: string;
  title: string;
  description: string;
  is_public: boolean;
  is_archived: boolean;
  created_at: string;
}

const estadoBadge = (r: RubricaItem) => {
  if (r.is_archived)
    return <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">Archivada</span>;
  if (r.is_public)
    return <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">Publicada</span>;
  return <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">Borrador</span>;
};

const MisRubricasPage = () => {
  const navigate = useNavigate();
  const [rubricas, setRubricas] = useState<RubricaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    id: string;
    type: 'delete' | 'archive' | 'publish';
    title: string;
  } | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRubricas();
      setRubricas(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar las rúbricas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    setActionLoading(id);
    try {
      await deleteRubrica(id);
      setRubricas((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al eliminar');
    } finally {
      setActionLoading(null);
      setConfirmDialog(null);
    }
  };

  const handleArchivar = async (id: string) => {
    setActionLoading(id);
    try {
      await archivarRubrica(id);
      setRubricas((prev) => prev.map((r) => r.id === id ? { ...r, is_archived: true } : r));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al archivar');
    } finally {
      setActionLoading(null);
      setConfirmDialog(null);
    }
  };

  const handlePublicar = async (id: string) => {
    setActionLoading(id);
    try {
      await publishRubric(id);
      setRubricas((prev) => prev.map((r) => r.id === id ? { ...r, is_public: true } : r));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al publicar');
    } finally {
      setActionLoading(null);
      setConfirmDialog(null);
    }
  };

  const handleConfirm = () => {
    if (!confirmDialog) return;
    if (confirmDialog.type === 'delete') handleDelete(confirmDialog.id);
    else if (confirmDialog.type === 'archive') handleArchivar(confirmDialog.id);
    else handlePublicar(confirmDialog.id);
  };

  const activas = rubricas.filter((r) => !r.is_archived);
  const archivadas = rubricas.filter((r) => r.is_archived);

  return (
    <div className="space-y-6 px-4 pb-6 sm:px-6 lg:px-8">
      <Breadcrumb pageName="Mis rúbricas" />

      {/* Header */}
      <div className="flex items-center justify-between rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div>
          <h1 className="text-2xl font-semibold text-black dark:text-white">Mis rúbricas</h1>
          <p className="mt-1 text-sm text-meta-3 dark:text-meta-2">
            Gestiona tus rúbricas de evaluación — borradores, publicadas y archivadas.
          </p>
        </div>
        <Link
          to="/rubricas/create"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
        >
          + Nueva rúbrica
        </Link>
      </div>

      {/* Error global */}
      {error && (
        <div className="flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-500/40 dark:bg-red-950/30 dark:text-red-200">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-4 text-lg font-bold">×</button>
        </div>
      )}

      {loading ? (
        <div className="flex h-40 items-center justify-center text-sm text-meta-3">Cargando rúbricas...</div>
      ) : (
        <>
          {/* Tabla rúbricas activas */}
          <section className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
              <h2 className="text-base font-semibold text-black dark:text-white">
                Rúbricas activas <span className="ml-2 text-sm font-normal text-meta-3">({activas.length})</span>
              </h2>
            </div>

            {activas.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-sm text-meta-3 dark:text-meta-2">
                <span className="text-3xl">📋</span>
                <p>No tienes rúbricas todavía.</p>
                <Link to="/rubricas/create" className="text-primary underline">
                  Crear mi primera rúbrica
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm text-black dark:text-white">
                  <thead>
                    <tr className="border-b border-stroke dark:border-strokedark">
                      <th className="px-6 py-3 font-medium text-meta-3 dark:text-meta-2">Título</th>
                      <th className="px-6 py-3 font-medium text-meta-3 dark:text-meta-2">Descripción</th>
                      <th className="px-6 py-3 font-medium text-meta-3 dark:text-meta-2">Estado</th>
                      <th className="px-6 py-3 font-medium text-meta-3 dark:text-meta-2">Creada</th>
                      <th className="px-6 py-3 font-medium text-meta-3 dark:text-meta-2">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activas.map((r) => (
                      <tr key={r.id} className="border-b border-stroke last:border-0 hover:bg-gray-50 dark:border-strokedark dark:hover:bg-meta-4">
                        <td className="px-6 py-4 font-medium">{r.title}</td>
                        <td className="px-6 py-4 max-w-xs truncate text-meta-3 dark:text-meta-2">{r.description || '—'}</td>
                        <td className="px-6 py-4">{estadoBadge(r)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-meta-3 dark:text-meta-2">
                          {new Date(r.created_at).toLocaleDateString('es-CO')}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap items-center gap-2">

                            {/* BORRADOR: publicar + eliminar */}
                            {!r.is_public && (
                              <>
                                <button
                                  onClick={() => setConfirmDialog({ id: r.id, type: 'publish', title: r.title })}
                                  disabled={actionLoading === r.id}
                                  className="rounded border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                                >
                                  Publicar
                                </button>
                                <button
                                  onClick={() => setConfirmDialog({ id: r.id, type: 'delete', title: r.title })}
                                  disabled={actionLoading === r.id}
                                  className="rounded border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                                >
                                  Eliminar
                                </button>
                              </>
                            )}

                            {/* PUBLICADA: archivar + asociar */}
                            {r.is_public && (
                              <>
                                <button
                                  onClick={() => setConfirmDialog({ id: r.id, type: 'archive', title: r.title })}
                                  disabled={actionLoading === r.id}
                                  className="rounded border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 transition hover:bg-amber-100 disabled:opacity-50"
                                >
                                  Archivar
                                </button>
                                <button
                                  onClick={() => navigate('/evaluaciones/asociar-rubrica')}
                                  className="rounded border border-stroke bg-white px-3 py-1 text-xs font-medium text-black transition hover:bg-gray dark:border-strokedark dark:bg-boxdark dark:text-white"
                                >
                                  Asociar
                                </button>
                              </>
                            )}

                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Archivadas */}
          {archivadas.length > 0 && (
            <details className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <summary className="cursor-pointer select-none px-6 py-4 text-sm font-medium text-meta-3 dark:text-meta-2">
                Rúbricas archivadas ({archivadas.length})
              </summary>
              <div className="overflow-x-auto border-t border-stroke dark:border-strokedark">
                <table className="min-w-full text-left text-sm text-black dark:text-white">
                  <tbody>
                    {archivadas.map((r) => (
                      <tr key={r.id} className="border-b border-stroke last:border-0 opacity-60 dark:border-strokedark">
                        <td className="px-6 py-3 font-medium">{r.title}</td>
                        <td className="px-6 py-3 text-meta-3 dark:text-meta-2">{r.description || '—'}</td>
                        <td className="px-6 py-3">{estadoBadge(r)}</td>
                        <td className="px-6 py-3 text-meta-3 dark:text-meta-2">
                          {new Date(r.created_at).toLocaleDateString('es-CO')}
                        </td>
                        <td className="px-6 py-3" />
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          )}
        </>
      )}

      {/* Diálogo de confirmación */}
      {confirmDialog && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h3 className="text-base font-semibold text-black dark:text-white">
              {confirmDialog.type === 'delete' && 'Eliminar rúbrica'}
              {confirmDialog.type === 'archive' && 'Archivar rúbrica'}
              {confirmDialog.type === 'publish' && 'Publicar rúbrica'}
            </h3>
            <p className="mt-2 text-sm text-meta-3 dark:text-meta-2">
              {confirmDialog.type === 'delete' && (
                <>¿Eliminar <strong>"{confirmDialog.title}"</strong>? Esta acción no se puede deshacer.</>
              )}
              {confirmDialog.type === 'archive' && (
                <>¿Archivar <strong>"{confirmDialog.title}"</strong>? Quedará inactiva pero no se perderán sus datos.</>
              )}
              {confirmDialog.type === 'publish' && (
                <>¿Publicar <strong>"{confirmDialog.title}"</strong>? Una vez publicada no podrá editarse ni eliminarse, solo archivarse.</>
              )}
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setConfirmDialog(null)}
                className="rounded border border-stroke bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray dark:border-strokedark dark:bg-boxdark dark:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                disabled={actionLoading === confirmDialog.id}
                className={`rounded px-4 py-2 text-sm font-medium text-white transition disabled:opacity-60 ${
                  confirmDialog.type === 'delete'
                    ? 'bg-red-600 hover:bg-red-700'
                    : confirmDialog.type === 'archive'
                    ? 'bg-amber-500 hover:bg-amber-600'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {actionLoading === confirmDialog.id
                  ? 'Procesando...'
                  : confirmDialog.type === 'delete'
                  ? 'Eliminar'
                  : confirmDialog.type === 'archive'
                  ? 'Archivar'
                  : 'Publicar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisRubricasPage;