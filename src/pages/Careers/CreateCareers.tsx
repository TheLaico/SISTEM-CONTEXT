// src/pages/Career/CreateCareer.tsx

import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';

import CareerForm from '../../components/Career/CareerForm';

import { CreateCareerDto } from '../../models/Career';

import { careerBusiness } from '../../business/CareerBusiness';

const CreateCareer = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<CreateCareerDto>({
    name: '',
    code: '',
    description: '',
    is_active: true,
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await careerBusiness.createCareer(formData);

      await Swal.fire('Created', 'Career created successfully', 'success');

      navigate('/carreras/list');
    } catch (error: any) {
      Swal.fire('Error', error.message || 'Could not create career', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Create Career</h1>

      <CareerForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
};

export default CreateCareer;
