import { AxiosError } from 'axios';
import {
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

import { firebaseAuth } from '../firebase/firebase.config';
import { api } from '../interceptors/authInterceptor';
import { User } from '../models/User';
import { LocalStorageProvider } from '../storage/LocalStorageProvider';
import { store } from '../store/store';
import { setUser } from '../store/userSlice';
import { userService } from './userService';

const storage = new LocalStorageProvider();

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  data: {
    access_token: string;
    token_type: string;
    user: User;
  };
  message: string;
}

type SocialProvider =
  | GoogleAuthProvider
  | GithubAuthProvider
  | FacebookAuthProvider;

class AuthService {
  private readonly userKey = 'user';
  private readonly tokenKey = 'token';
  private readonly firebaseTokenKey = 'firebaseToken';

  async loginWithCredentials(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await api.post<LoginResponse>(
        '/api/auth/login',
        credentials,
      );

      const { access_token, user } = response.data.data;

      if (!access_token || !user) {
        throw new Error('No se recibió información válida de autenticación.');
      }

      if (!user.is_active) {
        throw new Error('El usuario se encuentra inactivo.');
      }

      storage.setItem(this.tokenKey, access_token);
      storage.removeItem(this.firebaseTokenKey);
      storage.setItem(this.userKey, JSON.stringify(user));

      store.dispatch(setUser(user));

      return user;
    } catch (error) {
      const axiosError = error as AxiosError<{
        message?: string;
        error?: string;
      }>;

      if (axiosError.response?.status === 401) {
        throw new Error('Correo o contraseña incorrectos.');
      }

      throw new Error(
        axiosError.response?.data?.message ??
          axiosError.response?.data?.error ??
          'No se pudo iniciar sesión. Intenta nuevamente.',
      );
    }
  }

  async loginWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();

    provider.setCustomParameters({
      prompt: 'select_account',
    });

    return this.loginWithProvider(provider);
  }

  async loginWithGithub(): Promise<User> {
    const provider = new GithubAuthProvider();

    provider.addScope('user:email');
    provider.setCustomParameters({
      allow_signup: 'false',
    });

    return this.loginWithProvider(provider);
  }

  async loginWithFacebook(): Promise<User> {
    const provider = new FacebookAuthProvider();

    provider.addScope('email');

    return this.loginWithProvider(provider);
  }

  private async loginWithProvider(provider: SocialProvider): Promise<User> {
    const result = await signInWithPopup(firebaseAuth, provider);
    const firebaseUser = result.user;

    if (!firebaseUser.email) {
      await this.logout();
      throw new Error('La cuenta autenticada no tiene email.');
    }

    const firebaseToken = await firebaseUser.getIdToken();

    storage.setItem(this.firebaseTokenKey, firebaseToken);
    storage.removeItem(this.tokenKey);

    const users = await userService.searchUsers({
      email: firebaseUser.email,
    });

    const backendUser = users[0];

    if (!backendUser) {
      await this.logout();
      throw new Error('El usuario no existe en el sistema académico.');
    }

    if (!backendUser.is_active) {
      await this.logout();
      throw new Error('El usuario se encuentra inactivo.');
    }

    storage.setItem(this.userKey, JSON.stringify(backendUser));

    store.dispatch(setUser(backendUser));

    return backendUser;
  }

  async logout(): Promise<void> {
    try {
      await signOut(firebaseAuth);
    } catch {
      // Si el login fue clásico, Firebase puede no tener sesión activa.
    }

    storage.removeItem(this.userKey);
    storage.removeItem(this.tokenKey);
    storage.removeItem(this.firebaseTokenKey);

    store.dispatch(setUser(null));
  }

  getCurrentUser(): User | null {
    const storedUser = storage.getItem(this.userKey);

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch {
      storage.removeItem(this.userKey);
      return null;
    }
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  getToken(): string | null {
    return storage.getItem(this.tokenKey);
  }

  getFirebaseToken(): string | null {
    return storage.getItem(this.firebaseTokenKey);
  }
}

export const authService = new AuthService();
