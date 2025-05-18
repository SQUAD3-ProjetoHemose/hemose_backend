import { UserRole } from '../enums/user-role.enum';
export declare class CreateUserDto {
    nome: string;
    email: string;
    senha: string;
    tipo: UserRole;
    ativo?: boolean;
}
