import { UserFormValues } from '../components/Users/UserFormValidator';
import { User } from '../models/User';
import { UserRole } from '../models/UserRole';

export interface UserTableRow {
  id?: string;
  code?: string;
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  created_at?: string;
  is_active?: boolean;
  career?: string;
}
class UserBusiness {
  getUserFullName(user: User): string {
    if (user.profile) {
      const firstName = user.profile.first_name ?? '';
      const lastName = user.profile.last_name ?? '';

      return `${firstName} ${lastName}`.trim();
    }

    if (user.role === UserRole.ADMIN) {
      return 'Administrador';
    }

    return 'Sin perfil';
  }

  getUserRoleLabel(role?: UserRole): string {
    switch (role) {
      case UserRole.ADMIN:
        return 'Administrador';
      case UserRole.TEACHER:
        return 'Docente';
      case UserRole.STUDENT:
        return 'Estudiante';
      default:
        return 'Desconocido';
    }
  }

  getUserStatusLabel(user: User): string {
    return user.is_active ? 'Activo' : 'Inactivo';
  }

  formatUserCreatedAt(date?: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  }

  getUserCareer(user: User, careerName?: string): string {
    if (user.role !== UserRole.STUDENT) {
      return 'No aplica';
    }

    return careerName ?? 'No disponible';
  }

  mapUserToTableRow(user: User, careerName?: string): UserTableRow {
    return {
      id: user.id,
      code: user.code,
      name: this.getUserFullName(user),
      email: user.email,
      career: this.getUserCareer(user, careerName),
      role: this.getUserRoleLabel(user.role),
      status: this.getUserStatusLabel(user),
      is_active: user.is_active,
      created_at: this.formatUserCreatedAt(user.created_at),
    };
  }

  mapUsersToTableRows(
    users: User[],
    careerByStudentId: Record<string, string> = {},
  ): UserTableRow[] {
    return users.map((user) => {
      const studentId = user.profile?.id ? String(user.profile.id) : undefined;

      const careerName = studentId ? careerByStudentId[studentId] : undefined;

      return this.mapUserToTableRow(user, careerName);
    });
  }
  buildUpdateUserPayload(values: UserFormValues) {
    const payload: Record<string, any> = {
      email: values.email,
      code: values.code,
      role: values.role,
      is_active: values.is_active,
    };

    if (values.password) {
      payload.password = values.password;
    }

    if (values.role === UserRole.TEACHER || values.role === UserRole.STUDENT) {
      payload.first_name = values.first_name;
      payload.last_name = values.last_name;
      payload.identification = values.identification;
    }

    if (values.role === UserRole.TEACHER) {
      payload.phone = values.phone;
      payload.specialty = values.specialty;
    }

    return payload;
  }

  buildCreateUserPayload(values: UserFormValues) {
    const payload: Record<string, any> = {
      email: values.email,
      password: values.password,
      code: values.code,
      role: values.role,
      is_active: values.is_active,
    };

    if (values.role === UserRole.TEACHER || values.role === UserRole.STUDENT) {
      payload.first_name = values.first_name;
      payload.last_name = values.last_name;
      payload.identification = values.identification;
    }

    if (values.role === UserRole.TEACHER) {
      payload.phone = values.phone;
      payload.specialty = values.specialty;
    }

    return payload;
  }
}

export const userBusiness = new UserBusiness();
