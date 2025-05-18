import { IsString, IsOptional, IsDateString, Length, IsNotEmpty } from 'class-validator';

export class CreatePacienteDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  nome: string;

  @IsDateString()
  data_nascimento: string;

  @IsString()
  @IsNotEmpty()
  @Length(11, 14)
  cpf: string;

  @IsOptional()
  @IsString()
  @Length(0, 20)
  telefone?: string;

  @IsOptional()
  @IsString()
  endereco?: string;

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
}
