import { useSelector } from 'react-redux';

import Breadcrumb from '../components/Breadcrumb';
import CoverOne from '../images/cover/cover-01.png';
import userSix from '../images/user/user-06.png';

import { RootState } from '../store/store';
import { userBusiness } from '../business/UserBusiness';
import { UserRole } from '../models/UserRole';

const Profile = () => {
  const user = useSelector((state: RootState) => state.user.user);

  if (!user) {
    return (
      <>
        <Breadcrumb pageName="Profile" />

        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <p className="text-black dark:text-white">
            No hay usuario autenticado.
          </p>
        </div>
      </>
    );
  }

  const profile = user.profile;
  const fullName = userBusiness.getUserFullName(user);
  const roleLabel = userBusiness.getUserRoleLabel(user.role);
  const statusLabel = userBusiness.getUserStatusLabel(user);

  return (
    <>
      <Breadcrumb pageName="Profile" showBackButton/>

      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="relative z-20 h-35 md:h-65">
          <img
            src={CoverOne}
            alt="profile cover"
            className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
          />
        </div>

        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
            <div className="relative drop-shadow-2">
              <img src={userSix} alt="profile" className="rounded-full" />
            </div>
          </div>

          <div className="mt-4">
            <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
              {fullName}
            </h3>

            <p className="font-medium">{roleLabel}</p>

            <div className="mx-auto mt-4.5 mb-5.5 grid max-w-125 grid-cols-3 rounded-md border border-stroke py-2.5 shadow-1 dark:border-strokedark dark:bg-[#37404F]">
              <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark">
                <span className="font-semibold text-black dark:text-white">
                  {user.code ?? '—'}
                </span>
                <span className="text-sm">Código</span>
              </div>

              <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark">
                <span className="font-semibold text-black dark:text-white">
                  {statusLabel}
                </span>
                <span className="text-sm">Estado</span>
              </div>

              <div className="flex flex-col items-center justify-center gap-1 px-4">
                <span className="font-semibold text-black dark:text-white">
                  {user.role ?? '—'}
                </span>
                <span className="text-sm">Rol</span>
              </div>
            </div>

            <div className="mx-auto max-w-180 text-left">
              <h4 className="mb-4 text-center font-semibold text-black dark:text-white">
                Información del usuario
              </h4>

              <div className="grid grid-cols-1 gap-4 rounded-md border border-stroke p-5 dark:border-strokedark md:grid-cols-2">
                <InfoItem label="Email" value={user.email} />
                <InfoItem label="Código" value={user.code} />
                <InfoItem label="Rol" value={roleLabel} />
                <InfoItem label="Estado" value={statusLabel} />
                <InfoItem label="Fecha de creación" value={user.created_at} />
                <InfoItem
                  label="Última actualización"
                  value={user.updated_at}
                />
              </div>
            </div>

            <div className="mx-auto mt-6 max-w-180 text-left">
              <h4 className="mb-4 text-center font-semibold text-black dark:text-white">
                Información del perfil
              </h4>

              {user.role === UserRole.ADMIN && (
                <div
                  className="rounded-lg bg-blue-100 p-4 text-sm text-blue-700 dark:bg-blue-200 dark:text-blue-800"
                  role="alert"
                >
                  <span className="font-medium">Aviso:</span> El administrador
                  no requiere datos de perfil.
                </div>
              )}

              {profile && user.role !== UserRole.ADMIN && (
                <div className="grid grid-cols-1 gap-4 rounded-md border border-stroke p-5 dark:border-strokedark md:grid-cols-2">
                  <InfoItem label="Nombre" value={profile.first_name} />
                  <InfoItem label="Apellido" value={profile.last_name} />
                  <InfoItem
                    label="Identificación"
                    value={profile.identification}
                  />

                  {user.role === UserRole.TEACHER && (
                    <>
                      <InfoItem label="Teléfono" value={profile.phone} />
                      <InfoItem
                        label="Especialidad"
                        value={profile.specialty}
                      />
                    </>
                  )}
                </div>
              )}

              {!profile && user.role !== UserRole.ADMIN && (
                <div
                  className="rounded-lg bg-yellow-100 p-4 text-sm text-yellow-700"
                  role="alert"
                >
                  <span className="font-medium">Aviso:</span> Este usuario no
                  tiene datos de perfil asociados.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

interface InfoItemProps {
  label: string;
  value?: string | number | boolean | null;
}

const InfoItem = ({ label, value }: InfoItemProps) => {
  return (
    <div>
      <p className="mb-1 text-sm font-medium text-gray-500">{label}</p>
      <p className="text-base text-black dark:text-white">
        {value === null || value === undefined || value === ''
          ? '—'
          : String(value)}
      </p>
    </div>
  );
};

export default Profile;
