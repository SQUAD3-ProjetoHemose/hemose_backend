import { IsDate, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsIn } from 'class-validator';
import { StatusAgendamento, TipoAgendamento } from '../entities/agendamento.entity';
import { Type } from 'class-transformer';

export class CreateAgendamentoDto {
  @IsNotEmpty({ message: 'A data é obrigatória' })
  @Type(() => Date)
  @IsDate({ message: 'Data inválida' })
  data: Date;

  @IsNotEmpty({ message: 'O horário é obrigatório' })
  @IsString({ message: 'Horário inválido' })
  horario: string;

  @IsOptional()
  @IsIn(Object.values(StatusAgendamento), { message: 'Status inválido' })
  status?: StatusAgendamento;

  @IsNotEmpty({ message: 'O tipo de agendamento é obrigatório' })
  @IsIn(Object.values(TipoAgendamento), { message: 'Tipo de agendamento inválido' })
  tipo: TipoAgendamento;

  @IsOptional()
  @IsString({ message: 'Observações inválidas' })
  observacoes?: string;

  @IsNotEmpty({ message: 'O ID do paciente é obrigatório' })
  @IsInt({ message: 'ID do paciente inválido' })
  paciente_id: number;

  @IsNotEmpty({ message: 'O ID do médico é obrigatório' })
  @IsInt({ message: 'ID do médico inválido' })
  medico_id: number;
}
            
/*             
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
