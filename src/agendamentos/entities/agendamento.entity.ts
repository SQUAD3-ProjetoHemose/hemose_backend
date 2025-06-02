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

  // Usar string para data para compatibilidade com SQLite
  @Column({ type: 'varchar', length: 10 })
  data: string;

  @Column({ type: 'varchar', length: 8 })
  horario: string;

  // Usar varchar ao invés de enum para compatibilidade com SQLite
  @Column({
    type: 'varchar',
    length: 20,
    default: StatusAgendamento.AGENDADO,
  })
  status: StatusAgendamento;

  // Usar varchar ao invés de enum para compatibilidade com SQLite
  @Column({
    type: 'varchar',
    length: 20,
    default: TipoAgendamento.CONSULTA,
  })
  tipo: TipoAgendamento;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @ManyToOne(() => Paciente, { eager: true })
  @JoinColumn({ name: 'paciente_id' })
  paciente: Paciente;

  @Column()
  paciente_id: number;

  @ManyToOne(() => User, { eager: true })
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
