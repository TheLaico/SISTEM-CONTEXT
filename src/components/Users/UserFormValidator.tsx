import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';

import { User } from '../../models/User';
import { UserRole } from '../../models/UserRole';

export interface UserFormValues {
  email: string;
  password: string;
  code: string;
  role: UserRole | '';
  is_active: boolean;

  first_name: string;
  last_name: string;
  identification: string;
  phone: string;
  specialty: string;
}

interface UserFormValidatorProps {
  mode: number; // 1 = crear, 2 = actualizar
  handleAction: (values: UserFormValues) => void;
  user?: User | null;
}

const UserFormValidator: React.FC<UserFormValidatorProps> = ({
  mode,
  handleAction,
  user,
}) => {
  const [activeTab, setActiveTab] = useState<'user' | 'profile'>('user');

  const initialValues: UserFormValues = {
    email: user?.email ?? '',
    password: '',
    code: user?.code ?? '',
    role: user?.role ?? '',
    is_active: user?.is_active ?? true,

    first_name: user?.profile?.first_name ?? '',
    last_name: user?.profile?.last_name ?? '',
    identification: user?.profile?.identification ?? '',
    phone: 'phone' in (user?.profile ?? {}) ? user?.profile?.phone ?? '' : '',
    specialty:
      'specialty' in (user?.profile ?? {})
        ? user?.profile?.specialty ?? ''
        : '',
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Email inválido')
      .required('El email es obligatorio'),

    password:
      mode === 1
        ? Yup.string().required('La contraseña es obligatoria')
        : Yup.string(),

    code: Yup.string().required('El código es obligatorio'),

    role: Yup.string().required('El rol es obligatorio'),

    is_active: Yup.boolean(),

    first_name: Yup.string().when('role', {
      is: (role: UserRole) =>
        mode === 1 && (role === UserRole.TEACHER || role === UserRole.STUDENT),
      then: (schema) => schema.required('El nombre es obligatorio'),
      otherwise: (schema) => schema,
    }),

    last_name: Yup.string().when('role', {
      is: (role: UserRole) =>
        mode === 1 && (role === UserRole.TEACHER || role === UserRole.STUDENT),
      then: (schema) => schema.required('El apellido es obligatorio'),
      otherwise: (schema) => schema,
    }),

    identification: Yup.string().when('role', {
      is: (role: UserRole) =>
        mode === 1 && (role === UserRole.TEACHER || role === UserRole.STUDENT),
      then: (schema) => schema.required('La cédula es obligatoria'),
      otherwise: (schema) => schema,
    }),

    phone: Yup.string().when('role', {
      is: (role: UserRole) => mode === 1 && role === UserRole.TEACHER,
      then: (schema) => schema.required('El teléfono es obligatorio'),
      otherwise: (schema) => schema,
    }),

    specialty: Yup.string().when('role', {
      is: (role: UserRole) => mode === 1 && role === UserRole.TEACHER,
      then: (schema) => schema.required('La especialidad es obligatoria'),
      otherwise: (schema) => schema,
    }),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={(values) => handleAction(values)}
    >
      {({ values }) => (
        <Form className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="mb-6 flex gap-6 border-b border-stroke dark:border-strokedark">
            <button
              type="button"
              onClick={() => setActiveTab('user')}
              className={`pb-3 text-sm font-medium ${
                activeTab === 'user'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500'
              }`}
            >
              Datos de usuario
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`pb-3 text-sm font-medium ${
                activeTab === 'profile'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500'
              }`}
            >
              Datos del perfil
            </button>
          </div>

          {activeTab === 'user' && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  className="w-full rounded border border-stroke p-2"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="mt-1 text-sm text-red-500"
                />
              </div>

              {mode === 1 && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                    Contraseña
                  </label>
                  <Field
                    type="password"
                    name="password"
                    className="w-full rounded border border-stroke p-2"
                  />
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Código
                </label>
                <Field
                  type="text"
                  name="code"
                  className="w-full rounded border border-stroke p-2"
                />
                <ErrorMessage
                  name="code"
                  component="p"
                  className="mt-1 text-sm text-red-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Rol
                </label>
                <Field
                  as="select"
                  name="role"
                  className="w-full rounded border border-stroke p-2"
                >
                  <option value="">Seleccione un rol</option>
                  <option value={UserRole.ADMIN}>Administrador</option>
                  <option value={UserRole.TEACHER}>Docente</option>
                  <option value={UserRole.STUDENT}>Estudiante</option>
                </Field>
                <ErrorMessage
                  name="role"
                  component="p"
                  className="mt-1 text-sm text-red-500"
                />
              </div>

              {mode === 2 && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                    Estado
                  </label>
                  <label className="flex items-center gap-2">
                    <Field
                      type="checkbox"
                      name="is_active"
                      className="h-4 w-4"
                    />
                    <span>Usuario activo</span>
                  </label>
                  <ErrorMessage
                    name="is_active"
                    component="p"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              {!values.role && (
                <div
                  className="p-4 mb-4 text-sm text-blue-700 bg-blue-100 rounded-lg"
                  role="alert"
                >
                  <span className="font-medium">Aviso:</span> Primero seleccione
                  un rol en Datos de usuario.
                </div>
              )}
              {values.role === UserRole.ADMIN && (
                <div className="rounded border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
                  El rol Administrador no requiere datos de perfil.
                </div>
              )}

              {(values.role === UserRole.TEACHER ||
                values.role === UserRole.STUDENT) && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                      Nombre
                    </label>
                    <Field
                      type="text"
                      name="first_name"
                      className="w-full rounded border border-stroke p-2"
                    />
                    <ErrorMessage
                      name="first_name"
                      component="p"
                      className="mt-1 text-sm text-red-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                      Apellido
                    </label>
                    <Field
                      type="text"
                      name="last_name"
                      className="w-full rounded border border-stroke p-2"
                    />
                    <ErrorMessage
                      name="last_name"
                      component="p"
                      className="mt-1 text-sm text-red-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                      Cédula
                    </label>
                    <Field
                      type="text"
                      name="identification"
                      className="w-full rounded border border-stroke p-2"
                    />
                    <ErrorMessage
                      name="identification"
                      component="p"
                      className="mt-1 text-sm text-red-500"
                    />
                  </div>

                  {values.role === UserRole.TEACHER && (
                    <>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                          Teléfono
                        </label>
                        <Field
                          type="text"
                          name="phone"
                          className="w-full rounded border border-stroke p-2"
                        />
                        <ErrorMessage
                          name="phone"
                          component="p"
                          className="mt-1 text-sm text-red-500"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                          Especialidad
                        </label>
                        <Field
                          type="text"
                          name="specialty"
                          className="w-full rounded border border-stroke p-2"
                        />
                        <ErrorMessage
                          name="specialty"
                          component="p"
                          className="mt-1 text-sm text-red-500"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="submit"
              className={`inline-flex items-center justify-center rounded-md px-6 py-2 text-center font-medium text-white hover:bg-opacity-90 ${
                mode === 1 ? 'bg-primary' : 'bg-meta-3'
              }`}
            >
              {mode === 1 ? 'Crear' : 'Guardar cambios'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default UserFormValidator;
