export class Inscripcion {
    constructor(
        public id: number | null = null,
        public alumnoNombre: string = '',
        public asignaturaId: number | null = null,
        public grupoId: number | null = null,
        public fechaInscripcion: string = new Date().toISOString().substring(0, 10),
        public estado: 'solicitada' | 'confirmada' | 'cancelada' = 'solicitada'
    ) {}
}
