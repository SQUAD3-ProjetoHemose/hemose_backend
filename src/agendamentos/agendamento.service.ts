import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../src/users/entities/user.entity';
import { Paciente } from '../users/paciente/entities/paciente.entity';

export enum StatusAgendamento {
  AGENDADO = 'agendado',
  CONFIRMADO = 'confirmado',
  AGUARDANDO = 'aguardando',
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

  // Usar string para melhor compatibilidade com SQLite e facilitar queries
  @Column({ type: 'varchar', length: 10 })
  data: string; // Formato YYYY-MM-DD

  @Column({
    type: 'varchar',
    length: 8,
    name: 'hora',
    nullable: true,
    default: '08:00',
  })
  hora: string; // Formato HH:MM

  // Manter compatibilidade com código existente que usa 'horario'
  get horario(): string {
    return this.hora || '08:00'; // Valor padrão se não existir
  }

  set horario(value: string) {
    this.hora = value;
  }

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
