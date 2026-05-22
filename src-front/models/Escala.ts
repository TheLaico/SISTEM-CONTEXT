export class Escala {
    constructor(
        public id: number | null = null,
        public nombre: string = '', // e.g., "Excelente", "Bueno"
        public descripcion: string = '',
        public valor: number = 0, // numérico, e.g., 5, 4
        public criterioId: number | null = null
    ) {}
}