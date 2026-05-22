import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { careerBusiness } from '../../business/CareerBusiness';
import CareerForm from '../../components/Career/CareerForm';
import { Career, UpdateCareerDto } from '../../models/Career';

const EditCareer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [career, setCareer] = useState<Career | null>(null);
  const [formData, setFormData] = useState<UpdateCareerDto>({
    name: '',
    code: '',
    description: '',
  });

  useEffect(() => {
    if (id) {
      loadCareer(id);
    }
  }, [id]);

  const loadCareer = async (careerId: string) => {
    try {
      setInitialLoading(true);
      const careers = await careerBusiness.getCareers();
      const found = careers.find((c) => c.id === careerId);
      if (found) {
        setCareer(found);
        setFormData({
          name: found.name,
          code: found.code,
          description: found.description || '',
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Carrera no encontrada',
          icon: 'error',
        });
        navigate('/carreras/list');
      }
    } catch (error: any) {
      Swal.fire({
        title: 'Error',
        text: error.message || 'No se pudo cargar la carrera',
        icon: 'error',
      });
      navigate('/carreras/list');
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
    if (!career) return;

    try {
      setLoading(true);
      await careerBusiness.updateCareer(career.id, formData);
      Swal.fire({
        title: 'Éxito',
        text: 'Carrera actualizada correctamente',
        icon: 'success',
      });
      navigate('/carreras/list');
    } catch (error: any) {
      Swal.fire({
        title: 'Error',
        text: error.message || 'No se pudo actualizar la carrera',
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

  if (!career) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-red-600">Carrera no encontrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => navigate('/carreras/list')}
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
        <h1 className="text-3xl font-bold text-gray-900">Editar Carrera</h1>
        <p className="mt-2 text-gray-600">
          Actualiza los datos de la carrera académica
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <CareerForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
          isEdit
        />
      </div>
    </div>
  );
};

export default EditCareer;
