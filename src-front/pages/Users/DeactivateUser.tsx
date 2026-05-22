import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

import Breadcrumb from '../../components/Breadcrumb';

import { User } from '../../models/User';

import { userService } from '../../services/userService';
import { userBusiness } from '../../business/UserBusiness';

const DeactivateUser: React.FC = () => {
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

  const handleDeactivateUser = async () => {
    if (!user?.id) return;

    try {
      const result = await userService.deactivateUser(user.id);

      if (result) {
        Swal.fire({
          title: 'Completado',
          text: 'El usuario ha sido desactivado correctamente',
          icon: 'success',
          timer: 3000,
        });

        navigate('/users/list');
      } else {
        Swal.fire({
          title: 'Error',
          text: 'No fue posible desactivar el usuario',
          icon: 'error',
          timer: 3000,
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Existe un problema al momento de desactivar el usuario',
        icon: 'error',
        timer: 3000,
      });
    }
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      <Breadcrumb pageName="Desactivar Usuario" showBackButton />

      <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="mb-6 text-center">
          <h2 className="mb-4 text-2xl font-bold text-red-600">
            Desactivar usuario
          </h2>

          <p className="text-gray-600">
            ¿Está seguro que desea desactivar este usuario?
          </p>

          <p className="mt-2 text-sm text-gray-500">
            El usuario no podrá iniciar sesión en el sistema, pero su
            información se mantendrá.
          </p>
        </div>

        <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4">
          <p>
            <strong>Usuario:</strong> {userBusiness.getUserFullName(user)}
          </p>

          <p>
            <strong>Email:</strong> {user.email}
          </p>

          <p>
            <strong>Código:</strong> {user.code}
          </p>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/users/list')}
            className="rounded-md border border-stroke px-6 py-2 font-medium text-black transition hover:bg-gray-100"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleDeactivateUser}
            className="rounded-md bg-red-600 px-6 py-2 font-medium text-white transition hover:bg-red-700"
          >
            Desactivar usuario
          </button>
        </div>
      </div>
    </>
  );
};

export default DeactivateUser;
