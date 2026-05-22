import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import Breadcrumb from '../../components/Breadcrumb';
import UserFormValidator, {
  UserFormValues,
} from '../../components/Users/UserFormValidator';

import { userBusiness } from '../../business/UserBusiness';
import { userService } from '../../services/userService';

const CreateUserPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateUser = async (values: UserFormValues) => {
    try {
      const payload = userBusiness.buildCreateUserPayload(values);

      const createdUser = await userService.createUser(payload);

      if (createdUser) {
        Swal.fire({
          title: 'Completado',
          text: 'Se ha creado correctamente el usuario',
          icon: 'success',
          timer: 3000,
        });

        navigate('/users/list');
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Existe un problema al momento de crear el usuario',
          icon: 'error',
          timer: 3000,
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Existe un problema al momento de crear el usuario',
        icon: 'error',
        timer: 3000,
      });
    }
  };

  return (
    <div>
      <Breadcrumb pageName="Crear Usuario" showBackButton />
      <UserFormValidator handleAction={handleCreateUser} mode={1} />
    </div>
  );
};

export default CreateUserPage;
