import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Breadcrumb from '../../components/Breadcrumb';
import { userBusiness } from '../../business/UserBusiness';
import { User } from '../../models/User';
import { UserRole } from '../../models/UserRole';
import { userService } from '../../services/userService';

const ViewUserPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;

      const userData = await userService.getUserById(id);
      setUser(userData);
    };

    fetchUser();
  }, [id]);

  if (!user) {
    return <div>Cargando...</div>;
  }

  const profile = user.profile;

  return (
    <>
      <Breadcrumb pageName="Detalle de Usuario" showBackButton />

      <div className="space-y-6">
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
            Datos de usuario
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InfoItem label="Código" value={user.code} />
            <InfoItem label="Email" value={user.email} />
            <InfoItem
              label="Rol"
              value={userBusiness.getUserRoleLabel(user.role)}
            />
            <InfoItem
              label="Estado"
              value={userBusiness.getUserStatusLabel(user)}
            />
            <InfoItem
              label="Fecha de creación"
              value={userBusiness.formatUserCreatedAt(user.created_at)}
            />
            <InfoItem
              label="Última actualización"
              value={userBusiness.formatUserCreatedAt(user.updated_at)}
            />
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
            Datos de perfil
          </h2>

          {user.role === UserRole.ADMIN && (
            <div
              className="rounded-lg bg-blue-100 p-4 text-sm text-blue-700 dark:bg-blue-200 dark:text-blue-800"
              role="alert"
            >
              <span className="font-medium">Aviso:</span> El rol Administrador
              no requiere datos de perfil.
            </div>
          )}

          {profile && user.role !== UserRole.ADMIN && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoItem label="Nombre" value={profile.first_name} />
              <InfoItem label="Apellido" value={profile.last_name} />
              <InfoItem label="Cédula" value={profile.identification} />

              {user.role === UserRole.TEACHER && (
                <>
                  <InfoItem label="Teléfono" value={profile.phone} />
                  <InfoItem label="Especialidad" value={profile.specialty} />
                </>
              )}
            </div>
          )}

          {!profile && user.role !== UserRole.ADMIN && (
            <div
              className="rounded-lg bg-yellow-100 p-4 text-sm text-yellow-700"
              role="alert"
            >
              <span className="font-medium">Aviso:</span> Este usuario no tiene
              datos de perfil asociados.
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/users/list')}
            className="rounded-md border border-stroke px-6 py-2 font-medium text-black transition hover:bg-gray-100"
          >
            Volver
          </button>

          <button
            type="button"
            onClick={() => navigate(`/users/update/${user.id}`)}
            className="rounded-md bg-primary px-6 py-2 font-medium text-white transition hover:bg-opacity-90"
          >
            Editar
          </button>
        </div>
      </div>
    </>
  );
};

interface InfoItemProps {
  label: string;
  value?: string | number | boolean | null;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => {
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

export default ViewUserPage;
