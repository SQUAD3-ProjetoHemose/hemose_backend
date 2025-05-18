import { Funcionario } from './funcionario.entity';
import { Prescricao } from './prescricao.entity';
export declare class Medico {
    id: number;
    nome: string;
    crm: string;
    especialidade: string;
    telefone: string;
    funcionario: Funcionario;
    prescricoes: Prescricao[];
    created_at: Date;
    updated_at: Date;
}
