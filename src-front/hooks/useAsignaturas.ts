import { useEffect, useState } from 'react';
import { Asignatura } from '../models/Asignatura';
import { asignaturaService } from '../services/subjectService';

const useAsignaturas = () => {
    const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refresh = async () => {
        setLoading(true);
        try {
            const result = await asignaturaService.getAsignaturas();
            setAsignaturas(result);
            setError(null);
        } catch (err) {
            setError('No se pudieron cargar las asignaturas');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    return { asignaturas, loading, error, refresh };
};

export default useAsignaturas;
