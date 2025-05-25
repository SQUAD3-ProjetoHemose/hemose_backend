import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Paciente } from '../../users/paciente/entities/paciente.entity';
import { User } from '../../users/entities/user.entity';

// Entidade para histórico clínico do paciente
@Entity('historico_clinico')
export class HistoricoClinico {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  descricao: string;

  @Column({ type: 'text', nullable: true })
  doencasPreexistentes: string;

  @Column({ type: 'text', nullable: true })
  alergias: string;

  @Column({ type: 'text', nullable: true })
  medicamentosUso: string;

  @Column({ type: 'text', nullable: true })
  historicoFamiliar: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  dataRegistro: Date;

  @ManyToOne(() => Paciente)
  @JoinColumn({ name: 'paciente_id' })
  paciente: Paciente;

  @Column()
  pacienteId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'medico_id' })
  medico: User;

  @Column()
  medicoId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

/* 
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
