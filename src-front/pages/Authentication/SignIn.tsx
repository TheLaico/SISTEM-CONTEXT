import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { authService } from '../../services/authService';

type LoadingProvider = 'credentials' | 'google' | 'github' | 'facebook' | null;

const SignIn: React.FC = () => {
  const navigate = useNavigate();

  const [loginError, setLoginError] = useState<string>('');
  const [loadingProvider, setLoadingProvider] = useState<LoadingProvider>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCredentialsLogin = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setLoginError('');
    setLoadingProvider('credentials');

    try {
      const user = await authService.loginWithCredentials({
        email,
        password,
      });

      console.log('Usuario autenticado con credenciales:', user);
      navigate('/');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo iniciar sesión. Verifica tus credenciales.';

      setLoginError(message);
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleGoogleLogin = async () => {
    setLoginError('');
    setLoadingProvider('google');

    try {
      const user = await authService.loginWithGoogle();
      console.log('Usuario autenticado con Google:', user);
      navigate('/');
    } catch (error) {
      const firebaseError = error as { code?: string; message?: string };

      if (firebaseError.code === 'auth/popup-closed-by-user') {
        return;
      }

      setLoginError(
        firebaseError.message ?? 'No se pudo iniciar sesión con Google.',
      );
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleGithubLogin = async () => {
    setLoginError('');
    setLoadingProvider('github');

    try {
      const user = await authService.loginWithGithub();
      console.log('Usuario autenticado con GitHub:', user);
      navigate('/');
    } catch (error) {
      const firebaseError = error as { code?: string; message?: string };

      if (firebaseError.code === 'auth/popup-closed-by-user') {
        return;
      }

      setLoginError(
        firebaseError.message ?? 'No se pudo iniciar sesión con GitHub.',
      );
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleFacebookLogin = async () => {
    setLoginError('');
    setLoadingProvider('facebook');

    try {
      const user = await authService.loginWithFacebook();
      console.log('Usuario autenticado con Facebook:', user);
      navigate('/');
    } catch (error) {
      const firebaseError = error as { code?: string; message?: string };

      if (firebaseError.code === 'auth/popup-closed-by-user') {
        return;
      }

      setLoginError(
        firebaseError.message ?? 'No se pudo iniciar sesión con Facebook.',
      );
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="px-26 py-17.5 text-center">
              <h1 className="mb-4 text-3xl font-bold text-black dark:text-white">
                Academic Service
              </h1>

              <p className="2xl:px-20 text-gray-600 dark:text-gray-300">
                Sistema académico para la gestión de usuarios, roles,
                evaluaciones y calificaciones.
              </p>
            </div>
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <span className="mb-1.5 block font-medium text-gray-600 dark:text-gray-300">
                Sistema Académico
              </span>

              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Iniciar sesión
              </h2>

              {loginError && (
                <p className="mb-4 rounded-md bg-red-100 px-4 py-2 text-sm text-red-600">
                  {loginError}
                </p>
              )}

              <div className="grid grid-cols-1 gap-4 rounded-md bg-white p-6 shadow-md dark:bg-boxdark">
                <form onSubmit={handleCredentialsLogin} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="admin@example.com"
                      required
                      className="w-full rounded-lg border border-stroke bg-white px-4 py-3 text-black outline-none transition focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Ingresa tu contraseña"
                      required
                      className="w-full rounded-lg border border-stroke bg-white px-4 py-3 text-black outline-none transition focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loadingProvider !== null}
                    className="w-full rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loadingProvider === 'credentials'
                      ? 'Validando...'
                      : 'Ingresar'}
                  </button>
                </form>

                <div className="flex items-center gap-3">
                  <span className="h-px flex-1 bg-stroke dark:bg-strokedark" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    o ingresa con
                  </span>
                  <span className="h-px flex-1 bg-stroke dark:bg-strokedark" />
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loadingProvider !== null}
                  className="flex w-full items-center justify-center gap-3.5 rounded-lg border border-stroke bg-white p-4 text-black transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:bg-opacity-80"
                >
                  {loadingProvider === 'google'
                    ? 'Validando...'
                    : 'Sign in with Google'}
                </button>

                <button
                  type="button"
                  onClick={handleGithubLogin}
                  disabled={loadingProvider !== null}
                  className="flex w-full items-center justify-center gap-3.5 rounded-lg border border-stroke bg-white p-4 text-black transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:bg-opacity-80"
                >
                  {loadingProvider === 'github'
                    ? 'Validando...'
                    : 'Sign in with GitHub'}
                </button>

                <button
                  type="button"
                  onClick={handleFacebookLogin}
                  disabled={loadingProvider !== null}
                  className="flex w-full items-center justify-center gap-3.5 rounded-lg border border-stroke bg-white p-4 text-black transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:bg-opacity-80"
                >
                  {loadingProvider === 'facebook'
                    ? 'Validando...'
                    : 'Sign in with Facebook'}
                </button>

                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  Puedes ingresar con credenciales institucionales o mediante
                  una cuenta social asociada al mismo email registrado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
