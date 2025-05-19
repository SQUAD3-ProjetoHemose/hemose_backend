import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Paciente } from '../../users/paciente/entities/paciente.entity';
import { User } from '../../users/entities/user.entity';

export enum StatusAgendamento {
  AGENDADO = 'agendado',
  CONFIRMADO = 'confirmado',
  CANCELADO = 'cancelado',
  REALIZADO = 'realizado',
  FALTOU = 'faltou',
}

export enum TipoAgendamento {
  CONSULTA = 'consulta',
  EXAME = 'exame',
  RETORNO = 'retorno',
  PROCEDIMENTO = 'procedimento',
}

@Entity('agendamentos')
export class Agendamento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  data: Date;

  @Column({ type: 'time' })
  horario: string;

  @Column({
    type: 'enum',
    enum: StatusAgendamento,
    default: StatusAgendamento.AGENDADO,
  })
  status: StatusAgendamento;

  @Column({
    type: 'enum',
    enum: TipoAgendamento,
    default: TipoAgendamento.CONSULTA,
  })
  tipo: TipoAgendamento;

  @Column({ nullable: true })
  observacoes: string;

  @ManyToOne(() => Paciente)
  @JoinColumn({ name: 'paciente_id' })
  paciente: Paciente;

  @Column()
  paciente_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'medico_id' })
  medico: User;

  @Column()
  medico_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
            
/*             
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
