import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

import { LocalStorageProvider } from '../storage/LocalStorageProvider';
import { StorageProvider } from '../storage/StorageProvider';

export class AuthInterceptor {
  private api: AxiosInstance;
  private storage: StorageProvider;

  private EXCLUDED_ROUTES = ['/login', '/register', '/public'];

  constructor() {
    this.storage = new LocalStorageProvider();

    this.api = axios.create({
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.initializeInterceptors();
  }

  private handleRequest(config: InternalAxiosRequestConfig) {
    /**
     * Por ahora usamos firebaseToken porque el login real se hace con Firebase.
     * Si luego el backend genera su propio token JWT, cambia esto a:
     * const token = this.storage.getItem('token');
     */
    const token =
      this.storage.getItem('firebaseToken') || this.storage.getItem('token');

    if (this.EXCLUDED_ROUTES.some((route) => config.url?.includes(route))) {
      return config;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }

  private handleResponseError(error: any) {
    if (error.response?.status === 401) {
      this.storage.removeItem('user');
      this.storage.removeItem('firebaseToken');
      this.storage.removeItem('token');

      window.location.href = '/auth/signin';
    }

    if (error.response?.status === 403) {
      console.warn('Acceso denegado: no tienes permisos para esta acción.');
    }

    return Promise.reject(error);
  }

  private initializeInterceptors() {
    this.api.interceptors.request.use(this.handleRequest.bind(this), (error) =>
      Promise.reject(error),
    );

    this.api.interceptors.response.use(
      (response) => response,
      this.handleResponseError.bind(this),
    );
  }

  public get instance(): AxiosInstance {
    return this.api;
  }
}

export const api = new AuthInterceptor().instance;
    