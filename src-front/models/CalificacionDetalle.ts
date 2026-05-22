export class CalificacionDetalle {
    constructor(
        public id: number | null = null,
        public notaId: number | null = null,
        public criterioId: number | null = null,
        public escalaId: number | null = null,
        public puntaje: number = 0, // calculado
        public comentario: string = ''
    ) {}
}