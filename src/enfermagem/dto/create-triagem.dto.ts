import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateTriagemDto {
  @ApiProperty({
    description: 'ID do paciente',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsString({ message: 'O ID do paciente deve ser uma string.' })
  @IsNotEmpty({ message: 'O ID do paciente é obrigatório.' })
  pacienteId: string;

  @ApiProperty({
    description: 'Pressão arterial (sistólica/diastólica)',
    example: '120/80',
  })
  @IsString({ message: 'A pressão arterial deve ser uma string.' })
  @IsNotEmpty({ message: 'A pressão arterial é obrigatória.' })
  pressaoArterial: string;

  @ApiProperty({
    description: 'Frequência cardíaca (bpm)',
    example: 72,
  })
  @IsNumber({}, { message: 'A frequência cardíaca deve ser um número.' })
  @IsNotEmpty({ message: 'A frequência cardíaca é obrigatória.' })
  frequenciaCardiaca: number;

  @ApiProperty({
    description: 'Frequência respiratória (irpm)',
    example: 16,
  })
  @IsNumber({}, { message: 'A frequência respiratória deve ser um número.' })
  @IsNotEmpty({ message: 'A frequência respiratória é obrigatória.' })
  frequenciaRespiratoria: number;

  @ApiProperty({
    description: 'Temperatura corporal (°C)',
    example: 36.5,
  })
  @IsNumber({}, { message: 'A temperatura deve ser um número.' })
  @IsNotEmpty({ message: 'A temperatura é obrigatória.' })
  temperatura: number;

  @ApiProperty({
    description: 'Saturação de oxigênio (%)',
    example: 98,
  })
  @IsNumber({}, { message: 'A saturação de oxigênio deve ser um número.' })
  @Min(0, { message: 'A saturação de oxigênio não pode ser menor que 0.' })
  @Max(100, { message: 'A saturação de oxigênio não pode ser maior que 100.' })
  saturacaoOxigenio: number;

  @ApiProperty({
    description: 'Peso do paciente (kg)',
    example: 70,
    required: false,
  })
  @IsNumber({}, { message: 'O peso deve ser um número.' })
  @IsOptional()
  peso?: number;

  @ApiProperty({
    description: 'Altura do paciente (cm)',
    example: 175,
    required: false,
  })
  @IsNumber({}, { message: 'A altura deve ser um número.' })
  @IsOptional()
  altura?: number;

  @ApiProperty({
    description: 'Queixa principal do paciente',
    example: 'Dor no peito há 2 horas',
  })
  @IsString({ message: 'A queixa principal deve ser um texto.' })
  @IsNotEmpty({ message: 'A queixa principal é obrigatória.' })
  queixaPrincipal: string;

  @ApiProperty({
    description: 'Histórico da doença atual',
    example: 'Paciente refere dor torácica de início súbito...',
    required: false,
  })
  @IsString({ message: 'O histórico da doença atual deve ser um texto.' })
  @IsOptional()
  historicoDoencaAtual?: string;

  @ApiProperty({
    description: 'Classificação de risco',
    enum: ['azul', 'verde', 'amarelo', 'laranja', 'vermelho'],
    example: 'amarelo',
  })
  @IsString({ message: 'A classificação de risco deve ser uma string.' })
  @IsIn(['azul', 'verde', 'amarelo', 'laranja', 'vermelho'], {
    message:
      'Classificação de risco deve ser: azul, verde, amarelo, laranja ou vermelho.',
  })
  @IsNotEmpty({ message: 'A classificação de risco é obrigatória.' })
  classificacaoRisco: string;

  @ApiProperty({
    description: 'Observações gerais da triagem',
    example: 'Paciente ansioso, acompanhado pela esposa',
    required: false,
  })
  @IsString({ message: 'As observações devem ser um texto.' })
  @IsOptional()
  observacoes?: string;

  @ApiProperty({
    description: 'Observações médicas de apoio',
    example: 'Solicitar ECG de urgência',
    required: false,
  })
  @IsString({ message: 'As observações médicas devem ser um texto.' })
  @IsOptional()
  observacoesMedicas?: string;
}

/*
   __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
