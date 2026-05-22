import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { semesterBusiness } from '../../business/SemesterBusiness';
import SemesterForm from '../../components/Semester/SemesterForm';
import useCarreras from '../../hooks/useCareer';
import { Semester, UpdateSemesterDto } from '../../models/Semester';

const EditSemester = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [semester, setSemester] = useState<Semester | null>(null);
  const [formData, setFormData] = useState<UpdateSemesterDto>({
    name: '',
    code: '',
    career_id: '',
    start_date: '',
    end_date: '',
    is_active: false,
  });
  const { careers, loading: careersLoading } = useCarreras();

  useEffect(() => {
    if (id) {
      loadSemester(id);
    }
  }, [id]);

  const loadSemester = async (semesterId: string) => {
    try {
      setInitialLoading(true);
      const semesters = await semesterBusiness.getSemesters();
      const found = semesters.find((s) => s.id === semesterId);
      if (found) {
        setSemester(found);
        setFormData({
          name: found.name,
          code: found.code,
          career_id: found.career_id,
          start_date: found.start_date,
          end_date: found.end_date,
          is_active: found.is_active,
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Período académico no encontrado',
          icon: 'error',
        });
        navigate('/semestres/list');
      }
    } catch (error: any) {
      Swal.fire({
        title: 'Error',
        text: error.message || 'No se pudo cargar el período académico',
        icon: 'error',
      });
      navigate('/semestres/list');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!semester) return;

    try {
      setLoading(true);
      await semesterBusiness.updateSemester(semester.id, formData);
      Swal.fire({
        title: 'Éxito',
        text: 'Período académico actualizado correctamente',
        icon: 'success',
      });
      navigate('/semestres/list');
    } catch (error: any) {
      Swal.fire({
        title: 'Error',
        text: error.message || 'No se pudo actualizar el período académico',
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  if (!semester) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-red-600">Período académico no encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => navigate('/semestres/list')}
          className="mb-4 inline-flex items-center rounded-lg bg-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 transition-colors"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Volver
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          Editar Período Académico
        </h1>
        <p className="mt-2 text-gray-600">
          Actualiza los datos del período académico
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <SemesterForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          careers={careers}
          loading={loading || careersLoading}
          isEdit
        />
      </div>
    </div>
  );
};

export default EditSemester;
