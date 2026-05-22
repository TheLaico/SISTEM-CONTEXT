export class Evaluacion {
    constructor(
        public id: number | null = null,
        public nombre: string = '',
        public descripcion: string = '',
        public fecha: string = '', // o Date
        public asignaturaId: number | null = null,
        public rubricaId: number | null = null,
        public grupoId: number | null = null,
        public createdAt: string = '',
        public updatedAt: string = ''
    ) {}
}