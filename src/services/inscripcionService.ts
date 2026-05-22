import axios from 'axios';
import { Inscripcion } from '../models/Inscripcion';

const API_URL = import.meta.env.VITE_API_URL + '/inscripciones' || '/api/inscripciones';

class InscripcionService {
    async getInscripciones(): Promise<Inscripcion[]> {
        try {
            const response = await axios.get<Inscripcion[]>(API_URL);
            return response.data;
        } catch (error) {
            console.error('Error al obtener inscripciones:', error);
            return [];
        }
    }

    async getInscripcionById(id: number): Promise<Inscripcion | null> {
        try {
            const response = await axios.get<Inscripcion>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener inscripción:', error);
            return null;
        }
    }

    async createInscripcion(inscripcion: Omit<Inscripcion, 'id'>): Promise<Inscripcion | null> {
        try {
            const response = await axios.post<Inscripcion>(API_URL, inscripcion);
            return response.data;
        } catch (error) {
            console.error('Error al crear inscripción:', error);
            return null;
        }
    }

    async updateInscripcion(id: number, inscripcion: Partial<Inscripcion>): Promise<Inscripcion | null> {
        try {
            const response = await axios.put<Inscripcion>(`${API_URL}/${id}`, inscripcion);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar inscripción:', error);
            return null;
        }
    }

    async deleteInscripcion(id: number): Promise<boolean> {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return true;
        } catch (error) {
            console.error('Error al eliminar inscripción:', error);
            return false;
        }
    }
}

export const inscripcionService = new InscripcionService();
