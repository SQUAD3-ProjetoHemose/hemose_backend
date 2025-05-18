import { Medico } from './medico.entity';
export declare class Funcionario {
    id: number;
    nome: string;
    cargo: string;
    telefone: string;
    medicos: Medico[];
    created_at: Date;
    updated_at: Date;
}
