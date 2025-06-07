// filepath: c:/Users/alisson/OneDrive/Documentos/projetos/Projeto_Hemose/hemose_backend/src/enfermagem/dto/create-evolucao-enfermagem.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// DTO para Sinais Vitais, que será parte da Evolução de Enfermagem
export class SinaisVitaisDto {
  @ApiProperty({ description: 'Pressão arterial sistólica', example: 120 })
  @IsOptional()
  @IsNumber({}, { message: 'A pressão arterial sistólica deve ser um número.' })
  pressaoArterialSistolica?: number;

  @ApiProperty({ description: 'Pressão arterial diastólica', example: 80 })
  @IsOptional()
  @IsNumber(
    {},
    { message: 'A pressão arterial diastólica deve ser um número.' },
  )
  pressaoArterialDiastolica?: number;

  @ApiProperty({
    description: 'Temperatura corporal em Celsius',
    example: 36.5,
  })
  @IsOptional()
  @IsNumber({}, { message: 'A temperatura deve ser um número.' })
  temperatura?: number;

  @ApiProperty({ description: 'Frequência cardíaca em bpm', example: 75 })
  @IsOptional()
  @IsNumber({}, { message: 'A frequência cardíaca deve ser um número.' })
  frequenciaCardiaca?: number;

  @ApiProperty({ description: 'Frequência respiratória em rpm', example: 16 })
  @IsOptional()
  @IsNumber({}, { message: 'A frequência respiratória deve ser um número.' })
  frequenciaRespiratoria?: number;

  @ApiProperty({ description: 'Saturação de oxigênio em %', example: 98 })
  @IsOptional()
  @IsNumber({}, { message: 'A saturação de oxigênio deve ser um número.' })
  @Min(0, { message: 'A saturação de oxigênio não pode ser menor que 0.' })
  @Max(100, { message: 'A saturação de oxigênio não pode ser maior que 100.' })
  saturacaoOxigenio?: number;

  @ApiProperty({ description: 'Glicemia capilar em mg/dL', example: 90 })
  @IsOptional()
  @IsNumber({}, { message: 'A glicemia capilar deve ser um número.' })
  glicemiaCapilar?: number;

  @ApiProperty({ description: 'Nível de dor (0-10)', example: 1 })
  @IsOptional()
  @IsNumber({}, { message: 'O nível de dor deve ser um número.' })
  @Min(0, { message: 'O nível de dor não pode ser menor que 0.' })
  @Max(10, { message: 'O nível de dor não pode ser maior que 10.' })
  nivelDor?: number;

  @ApiProperty({
    description: 'Observações dos sinais vitais',
    example: 'Paciente calmo, eupneico.',
  })
  @IsOptional()
  @IsString({ message: 'As observações dos sinais vitais devem ser um texto.' })
  observacoesSinaisVitais?: string;
}

export class CreateEvolucaoEnfermagemDto {
  @ApiProperty({
    description: 'ID do paciente',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'O ID do paciente é obrigatório.' })
  @IsString({ message: 'O ID do paciente deve ser uma string.' })
  pacienteId: string;

  @ApiProperty({
    description: 'ID da triagem associada (se houver)',
    example: 'abcdef12-e89b-12d3-a456-426614174001',
  })
  @IsOptional() // Triagem é obrigatória antes de qualquer procedimento, mas o ID pode vir de outro local
  @IsString({ message: 'O ID da triagem deve ser uma string.' })
  triagemId?: string;

  @ApiProperty({
    description: 'Descrição da evolução de enfermagem',
    example: 'Paciente refere melhora da dor após medicação.',
  })
  @IsNotEmpty({ message: 'A descrição da evolução é obrigatória.' })
  @IsString({ message: 'A descrição da evolução deve ser um texto.' })
  descricao: string;

  @ApiProperty({ type: SinaisVitaisDto, description: 'Sinais vitais aferidos' })
  @IsOptional()
  @ValidateNested()
  @Type(() => SinaisVitaisDto)
  sinaisVitais?: SinaisVitaisDto;

  @ApiProperty({
    description: 'Procedimentos realizados',
    example: 'Curativo em MID, Administração de dipirona IV.',
  })
  @IsOptional()
  @IsString({ message: 'Os procedimentos realizados devem ser um texto.' })
  procedimentosRealizados?: string;

  @ApiProperty({
    description: 'Observações adicionais da evolução',
    example: 'Orientado sobre cuidados com ferida.',
  })
  @IsOptional()
  @IsString({ message: 'As observações devem ser um texto.' })
  observacoes?: string;

  @ApiProperty({
    description: 'Data e hora da evolução',
    example: '2024-07-27T11:00:00.000Z',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'A data da evolução deve estar no formato ISO 8601.' },
  )
  dataEvolucao?: Date;

  // Adicionar assinatura ASCII
  /*
   __  ____ ____ _  _
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
  */
}
