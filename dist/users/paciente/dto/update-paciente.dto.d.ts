import { CreatePacienteDto } from './create-paciente.dto';
declare const UpdatePacienteDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreatePacienteDto>>;
export declare class UpdatePacienteDto extends UpdatePacienteDto_base {
    nome?: string;
    data_nascimento?: string;
    tipo_sanguineo?: string;
    alergias?: string;
    historico_medico?: string;
    telefone?: string;
}
export {};
