export class Criterio {
    constructor(
        public id: number | null = null,
        public nombre: string = '',
        public descripcion: string = '',
        public peso: number = 0, // porcentaje, e.g., 25 para 25%
        public rubricaId: number | null = null
    ) {}
}