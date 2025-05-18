import { Paciente } from '../paciente/entities/paciente.entity';
import { Medico } from './medico.entity';
import { HistoricoPaciente } from './historico-paciente.entity';
export declare class Prontuario {
    id: number;
    paciente: Paciente;
    medico: Medico;
    data_atendimento: Date;
    descricao: string;
    historicos: HistoricoPaciente[];
    created_at: Date;
}
