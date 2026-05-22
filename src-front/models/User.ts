import { Student } from './Student';
import { Teacher } from './Teacher';
import { UserRole } from './UserRole';
export interface User {
  id?: string;
  email?: string;
  password_hash?: string;
  code?: string;
  role?: UserRole;
  is_active?: boolean;

  created_at?: string;
  updated_at?: string;

  profile?: Teacher | Student;
}
