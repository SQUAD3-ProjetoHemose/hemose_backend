import { PartialType } from '@nestjs/mapped-types';
import { CreatePacienteDto } from './create-paciente.dto';
import { IsString, IsOptional, IsDateString, Length } from 'class-validator';

export class UpdatePacienteDto extends PartialType(CreatePacienteDto) {
  @IsOptional()
  @IsString()
  @Length(0, 100)
  nome?: string;

  @IsOptional()
  @IsDateString()
  data_nascimento?: string;

  @IsOptional()
  @IsString()
  @Length(0, 5)
  tipo_sanguineo?: string;

  @IsOptional()
  @IsString()
  alergias?: string;

  @IsOptional()
  @IsString()
  historico_medico?: string;

  @IsOptional()
  @IsString()
  @Length(0, 20)
  telefone?: string;
}
