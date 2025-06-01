import { IsString, IsNumber, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAtestadoDto {
  @IsNumber()
  pacienteId: number;

  @IsString()
  tipo: string;

  @IsString()
  conteudo: string;

  @IsOptional()
  @IsString()
  observacoes?: string;

  @Type(() => Date)
  @IsDate()
  dataEmissao: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dataValidade?: Date;

  @IsOptional()
  @IsNumber()
  diasAfastamento?: number;
}

/* 
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
