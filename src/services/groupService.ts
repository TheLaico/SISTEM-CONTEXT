import { api } from '../interceptors/authInterceptor'

import {
  Group,
  CreateGroupDto,
  UpdateGroupDto,
  GroupFilters
} from '../models/Group'

const BASE_URL = '/api/academic/groups'

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return 'Error al ejecutar la operación de grupos'
}

class GroupService {
  async getGroups(): Promise<Group[]> {
    try {
      const response = await api.get(BASE_URL)
      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  }

  async getGroupById(id: string | number): Promise<Group> {
    try {
      const response = await api.get(`${BASE_URL}/${id}`)
      const data = response.data.data
      if (!data) throw new Error(`Grupo ${id} no encontrado`)
      return data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  }

  async createGroup(payload: CreateGroupDto): Promise<Group> {
    try {
      const response = await api.post(BASE_URL, payload)
      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  }

  async updateGroup(id: string, payload: UpdateGroupDto): Promise<Group> {
    try {
      const response = await api.put(`${BASE_URL}/${id}`, payload)
      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  }

  async deleteGroup(id: string): Promise<void> {
    try {
      await api.delete(`${BASE_URL}/${id}`)
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  }

  async searchGroups(filters: GroupFilters): Promise<Group[]> {
    try {
      const response = await api.get(`${BASE_URL}/search`, { params: filters })
      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  }

  /**
   * Obtiene los grupos asignados a un docente específico.
   * Endpoint: GET /api/academic/groups/search?teacher_id={teacherId}
   * Delega en searchGroups para no duplicar la llamada HTTP.
   */// AGREGAR: obtener grupos filtrados por docente
  async getGroupsByTeacher(teacherId: number | string): Promise<Group[]> {
    try {
      const response = await api.get(`${BASE_URL}/search`, {
        params: { teacher_id: teacherId }
      })
      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  }

  // AGREGAR: asignar docente a un grupo
  async assignTeacher(groupId: number | string, teacherId: number | string): Promise<Group> {
    try {
      const response = await api.patch(
        `${BASE_URL}/${groupId}/assign-teacher/${teacherId}`
      )
      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  }
}

export const groupService = new GroupService()