import { User } from './User';

export class Estudiante extends User {
    constructor(
        id: number | null = null,
        name: string = '',
        username: string = '',
        email: string = '',
        phone: string = '',
        password: string = '',
        role: string = 'estudiante',
        public cedula: string = ''
    ) {
        super(id, name, username, email, phone, password, role);
    }
}