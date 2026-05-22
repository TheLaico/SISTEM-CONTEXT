export class Nota {
    constructor(
        public id: number | null = null,
        public estudianteId: number | null = null,
        public evaluacionId: number | null = null,
        public notaFinal: number = 0,
        public rubricaId: number | null = null,
        public createdAt: string = '',
        public updatedAt: string = ''
    ) {}
}