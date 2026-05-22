import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setUser } from '../store/userSlice';
import { UserRole } from '../models/UserRole';
import { Teacher } from '../models/Teacher';
import { Student } from '../models/Student';
import { api } from '../interceptors/authInterceptor';

interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface SettingsFormState {
  email: string;
  first_name: string;
  last_name: string;
  identification: string;
  phone: string;       // solo Teacher
  specialty: string;  // solo Teacher
  password: string;
  confirmPassword: string;
}

const useSettings = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const profile = user?.profile as Teacher & Student | undefined;

  const [form, setForm] = useState<SettingsFormState>({
    email: user?.email ?? '',
    first_name: profile?.first_name ?? '',
    last_name: profile?.last_name ?? '',
    identification: profile?.identification ?? '',
    phone: (profile as Teacher)?.phone ?? '',
    specialty: (profile as Teacher)?.specialty ?? '',
    password: '',
    confirmPassword: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Sincroniza si el user en Redux cambia
  useEffect(() => {
    const p = user?.profile as Teacher & Student | undefined;
    setForm({
      email: user?.email ?? '',
      first_name: p?.first_name ?? '',
      last_name: p?.last_name ?? '',
      identification: p?.identification ?? '',
      phone: (p as Teacher)?.phone ?? '',
      specialty: (p as Teacher)?.specialty ?? '',
      password: '',
      confirmPassword: '',
    });
  }, [user]);

  const handleChange = (field: keyof SettingsFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(false);
  };

  const validate = (): string | null => {
    if (!form.email.trim()) return 'El correo es obligatorio';
    if (!form.first_name.trim()) return 'El nombre es obligatorio';
    if (!form.last_name.trim()) return 'El apellido es obligatorio';
    if (form.password && form.password !== form.confirmPassword)
      return 'Las contraseñas no coinciden';
    if (form.password && form.password.length < 6)
      return 'La contraseña debe tener al menos 6 caracteres';
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    if (!user?.id) { setError('No se pudo identificar al usuario'); return; }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload: Record<string, any> = {
        email: form.email.trim(),
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        identification: form.identification.trim(),
      };

      if (user.role === UserRole.TEACHER) {
        payload.phone = form.phone.trim();
        payload.specialty = form.specialty.trim();
      }

      if (form.password) {
        payload.password = form.password;
      }

      const response = await api.put<ApiResponse<any>>(
        `/api/users/${user.id}`,
        payload
      );

      // Actualiza Redux con los datos frescos del backend
      dispatch(setUser(response.data.data));
      setSuccess(true);
      setForm((prev) => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? (e instanceof Error ? e.message : 'Error al guardar');
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    user,
    form,
    isSubmitting,
    error,
    success,
    handleChange,
    handleSubmit,
    setError,
    setSuccess,
  };
};

export default useSettings;