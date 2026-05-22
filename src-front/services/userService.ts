import { User } from '../models/User';
import { api } from '../interceptors/authInterceptor';

const API_URL = '/api/users/';

interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface UserSearchFilters {
  role?: string;
  is_active?: boolean;
  email?: string;
  code?: string;
  identification?: string;
  first_name?: string;
  last_name?: string;
}

class UserService {
  async getUsers(): Promise<User[]> {
    try {
      const response = await api.get<ApiResponse<User[]>>(API_URL);
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return [];
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const response = await api.get<ApiResponse<User>>(`${API_URL}${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Usuario no encontrado:', error);
      return null;
    }
  }

  async createUser(user: Partial<User>): Promise<User | null> {
    try {
      const response = await api.post<ApiResponse<User>>(API_URL, user);
      return response.data.data;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      return null;
    }
  }

  async updateUser(id: string, user: Partial<User>): Promise<User | null> {
    try {
      const response = await api.put<ApiResponse<User>>(
        `${API_URL}${id}`,
        user,
      );

      return response.data.data;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      return null;
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      await api.delete(`${API_URL}${id}`);
      return true;
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      return false;
    }
  }

  async deactivateUser(id: string): Promise<User | null> {
    try {
      const response = await api.patch<ApiResponse<User>>(
        `${API_URL}${id}/deactivate`,
      );

      return response.data.data;
    } catch (error) {
      console.error('Error al desactivar usuario:', error);
      return null;
    }
  }

  async searchUsers(filters: UserSearchFilters): Promise<User[]> {
    try {
      const response = await api.get<ApiResponse<User[]>>(`${API_URL}search`, {
        params: filters,
      });

      return response.data.data;
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
      return [];
    }
  }
}

export const userService = new UserService();
