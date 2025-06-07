import {
  IsString,
  IsNumber,
  IsOptional,
  IsDate,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class MedicamentoDto {
  @IsString()
  nome: string;

  @IsString()
  dosagem: string;

  @IsString()
  via: string;

  @IsString()
  frequencia: string;

  @IsString()
  duracao: string;

  @IsOptional()
  @IsString()
  observacoes?: string;
}

export class CreatePrescricaoDto {
  @IsNumber()
  pacienteId: number;

  @Type(() => Date)
  @IsDate()
  dataEmissao: Date;

  @Type(() => Date)
  @IsDate()
  dataValidade: Date;

  @IsOptional()
  @IsString()
  orientacoes?: string;

  @IsOptional()
  @IsString()
  observacoes?: string;

  @IsOptional()
  @IsString()
  retorno?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MedicamentoDto)
  medicamentos: MedicamentoDto[];
}

/* 
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
