import { Prescricao } from '../../entities/prescricao.entity';
import { Internacao } from '../../entities/internacao.entity';
export declare class Paciente {
    id: number;
    nome: string;
    data_nascimento: Date;
    cpf: string;
    telefone: string;
    endereco: string;
    tipo_sanguineo: string;
    alergias: string;
    historico_medico: string;
    prescricoes: Prescricao[];
    internacoes: Internacao[];
    created_at: Date;
    updated_at: Date;
}
