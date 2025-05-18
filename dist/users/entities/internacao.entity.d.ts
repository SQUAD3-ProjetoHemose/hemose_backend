import { Paciente } from '../paciente/entities/paciente.entity';
import { Leito } from './leito.entity';
import { Medico } from './medico.entity';
export declare class Internacao {
    id: number;
    paciente: Paciente;
    leito: Leito;
    medico_responsavel: Medico;
    data_entrada: Date;
    data_saida: Date;
    diagnostico: string;
}
