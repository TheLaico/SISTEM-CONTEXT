import Breadcrumb from '../components/Breadcrumb';
import { UserRole } from '../models/UserRole';
import useSettings from '../hooks/useSettings';

const Settings = () => {
  const {
    user,
    form,
    isSubmitting,
    error,
    success,
    handleChange,
    handleSubmit,
    setError,
    setSuccess,
  } = useSettings();

  const isTeacher = user?.role === UserRole.TEACHER;
  const isAdmin   = user?.role === UserRole.ADMIN;

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Configuración" />

      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Información personal
              </h3>
            </div>

            <div className="p-7 space-y-5">

              {/* Feedback */}
              {error && (
                <div className="flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-500/40 dark:bg-red-950/30 dark:text-red-200">
                  <span>{error}</span>
                  <button onClick={() => setError(null)} className="ml-4 text-lg font-bold">×</button>
                </div>
              )}

              {success && (
                <div className="flex items-center justify-between rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-950/30 dark:text-emerald-200">
                  <span>Datos actualizados correctamente.</span>
                  <button onClick={() => setSuccess(false)} className="ml-4 text-lg font-bold">×</button>
                </div>
              )}

              {/* Nombre y Apellido */}
              {!isAdmin && (
                <div className="flex flex-col gap-5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                      Nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.first_name}
                      onChange={(e) => handleChange('first_name', e.target.value)}
                      className="w-full rounded border border-stroke bg-gray py-3 px-4 text-sm text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                    />
                  </div>
                  <div className="w-full sm:w-1/2">
                    <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                      Apellido <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.last_name}
                      onChange={(e) => handleChange('last_name', e.target.value)}
                      className="w-full rounded border border-stroke bg-gray py-3 px-4 text-sm text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {/* Correo */}
              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Correo electrónico <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full rounded border border-stroke bg-gray py-3 px-4 text-sm text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                />
              </div>

              {/* Identificación */}
              {!isAdmin && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                    Identificación
                  </label>
                  <input
                    type="text"
                    value={form.identification}
                    onChange={(e) => handleChange('identification', e.target.value)}
                    className="w-full rounded border border-stroke bg-gray py-3 px-4 text-sm text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                  />
                </div>
              )}

              {/* Campos exclusivos de Docente */}
              {isTeacher && (
                <div className="flex flex-col gap-5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                      Teléfono
                    </label>
                    <input
                      type="text"
                      value={form.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="+57 300 000 0000"
                      className="w-full rounded border border-stroke bg-gray py-3 px-4 text-sm text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                    />
                  </div>
                  <div className="w-full sm:w-1/2">
                    <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                      Especialidad
                    </label>
                    <input
                      type="text"
                      value={form.specialty}
                      onChange={(e) => handleChange('specialty', e.target.value)}
                      placeholder="Ej: Ingeniería de Software"
                      className="w-full rounded border border-stroke bg-gray py-3 px-4 text-sm text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {/* Separador contraseña */}
              <div className="border-t border-stroke pt-5 dark:border-strokedark">
                <h4 className="mb-4 text-sm font-medium text-black dark:text-white">
                  Cambiar contraseña <span className="font-normal text-meta-3">(opcional — deja en blanco para no cambiar)</span>
                </h4>
                <div className="flex flex-col gap-5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                      Nueva contraseña
                    </label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full rounded border border-stroke bg-gray py-3 px-4 text-sm text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                    />
                  </div>
                  <div className="w-full sm:w-1/2">
                    <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                      Confirmar contraseña
                    </label>
                    <input
                      type="password"
                      value={form.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      placeholder="Repite la contraseña"
                      className="w-full rounded border border-stroke bg-gray py-3 px-4 text-sm text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => window.location.reload()}
                  className="rounded border border-stroke py-2 px-6 text-sm font-medium text-black transition hover:shadow-1 disabled:opacity-60 dark:border-strokedark dark:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="rounded bg-primary py-2 px-6 text-sm font-medium text-white transition hover:bg-primary/90 disabled:opacity-60"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Panel lateral — info de solo lectura */}
        <div className="col-span-5 xl:col-span-2">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">Mi cuenta</h3>
            </div>
            <div className="p-7 space-y-4">

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-meta-3 dark:text-meta-2">Código</p>
                <p className="mt-1 text-sm font-semibold text-black dark:text-white">{user?.code ?? '—'}</p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-meta-3 dark:text-meta-2">Rol</p>
                <p className="mt-1 text-sm font-semibold text-black dark:text-white">
                  {user?.role === UserRole.ADMIN ? 'Administrador'
                    : user?.role === UserRole.TEACHER ? 'Docente'
                    : user?.role === UserRole.STUDENT ? 'Estudiante'
                    : '—'}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-meta-3 dark:text-meta-2">Estado</p>
                <span className={`mt-1 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  user?.is_active
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                }`}>
                  {user?.is_active ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-500/30 dark:bg-amber-950/20 dark:text-amber-200">
                El código de usuario y el rol solo pueden ser modificados por un administrador.
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;