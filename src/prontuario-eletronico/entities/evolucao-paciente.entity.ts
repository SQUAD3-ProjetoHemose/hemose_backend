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

// Entidade para evolução do paciente
@Entity('evolucao_paciente')
export class EvolucaoPaciente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  evolucao: string;

  @Column({ type: 'text', nullable: true })
  procedimentosRealizados: string;

  @Column({ type: 'text', nullable: true })
  medicamentosAdministrados: string;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  dataEvolucao: Date;

  @ManyToOne(() => Paciente)
  @JoinColumn({ name: 'paciente_id' })
  paciente: Paciente;

  @Column()
  pacienteId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'profissional_id' })
  profissional: User;

  @Column()
  profissionalId: number;

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
