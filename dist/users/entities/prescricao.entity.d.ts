import { Paciente } from '../paciente/entities/paciente.entity';
import { Medico } from './medico.entity';
import { Medicamento } from './medicamento.entity';
export declare class Prescricao {
    id: number;
    paciente: Paciente;
    medico: Medico;
    medicamento: Medicamento;
    dosagem: string;
    frequencia: string;
    data_prescricao: Date;
}
