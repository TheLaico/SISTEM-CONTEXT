import { User } from './User';

export class Docente extends User {
    constructor(
        id: number | null = null,
        name: string = '',
        username: string = '',
        email: string = '',
        phone: string = '',
        password: string = '',
        role: string = 'docente',
        public cedula: string = '',
        public especialidad: string = ''
    ) {
        super(id, name, username, email, phone, password, role);
    }
}