import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import SemesterForm from '../../components/Semester/SemesterForm';
import useCarreras from '../../hooks/useCareer';
import { useSemester } from '../../hooks/useSemester';
import { CreateSemesterDto } from '../../models/Semester';

const CreateSemester: React.FC = () => {
  const navigate = useNavigate();
  const {
    careers,
    loading: careersLoading,
    error: careersError,
  } = useCarreras();
  const { createSemester, loading: semesterLoading } = useSemester();

  const [formData, setFormData] = useState<CreateSemesterDto>({
    career_id: '',
    name: '',
    code: '',
    start_date: '',
    end_date: '',
    is_active: false,
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    try {
      await createSemester(formData);

      await Swal.fire({
        icon: 'success',
        title: 'Semestre creado',
        text: 'El semestre se creó correctamente',
      });

      setFormData({
        career_id: '',
        name: '',
        code: '',
        start_date: '',
        end_date: '',
        is_active: false,
      });

      navigate('/semestres/list');
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error?.message || 'No se pudo crear el semestre',
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Crear Semestre</h1>
          <p className="text-sm text-gray-600 mt-1">
            Completa los datos del semestre y asigna la carrera correspondiente.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/academic')}
          className="inline-flex items-center rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
        >
          Volver
        </button>
      </div>

      {careersError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 mb-6">
          {careersError}
        </div>
      )}

      {careersLoading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-500">Cargando carreras...</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <SemesterForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            isEdit={false}
            careers={careers}
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate('/academic')}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={
                semesterLoading || careersLoading || careers.length === 0
              }
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {semesterLoading ? 'Guardando...' : 'Crear semestre'}
            </button>
          </div>
        </form>
      )}

      {!careersLoading && careers.length === 0 && (
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-900 mt-6">
          Registra una carrera antes de crear un semestre.
        </div>
      )}
    </div>
  );
};

export default CreateSemester;
