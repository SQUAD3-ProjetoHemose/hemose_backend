import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateTemplateDto {
  @IsString()
  nome: string;

  @IsString()
  tipo: string;

  @IsString()
  conteudo: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsBoolean()
  padrao?: boolean;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}

/* 
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
