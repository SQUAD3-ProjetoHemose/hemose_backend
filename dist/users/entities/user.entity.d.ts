import { UserRole } from '../enums/user-role.enum';
export declare class User {
    id: number;
    nome: string;
    email: string;
    senha: string;
    tipo: UserRole;
    ativo: boolean;
    created_at: Date;
    updated_at: Date;
}
