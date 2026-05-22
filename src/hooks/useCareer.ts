import { useEffect, useState } from 'react';
import { Career } from '../models/Career';
import { careerService } from '../services/careerService';

const useCarreras = () => {
    const [careers, setCareers] = useState<Career[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refresh = async () => {
        setLoading(true);
        try {
            const result = await careerService.getCareers();
            setCareers(result);
            setError(null);
        } catch (err) {
            setError('No se pudieron cargar las carreras');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    return { careers, loading, error, refresh };
};

export default useCarreras;
