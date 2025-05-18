import { Paciente } from '../paciente/entities/paciente.entity';
import { Prontuario } from './prontuario.entity';
export declare class HistoricoPaciente {
    id: number;
    paciente: Paciente;
    prontuario: Prontuario;
    data_registro: Date;
    observacoes: string;
}
