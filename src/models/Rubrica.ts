export class Rubrica {
    constructor(
        public id: number | null = null,
        public titulo: string = '',
        public descripcion: string = '',
        public asignaturaId: number | null = null,
        public docenteId: number | null = null,
        public esPublica: boolean = false,
        public createdAt: string = '',
        public updatedAt: string = ''
    ) {}
}