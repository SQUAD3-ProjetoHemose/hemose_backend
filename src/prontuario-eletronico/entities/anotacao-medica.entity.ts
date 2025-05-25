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

// Entidade para anotações médicas no prontuário eletrônico
@Entity('anotacoes_medicas')
export class AnotacaoMedica {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  anotacao: string;

  @Column({ type: 'text', nullable: true })
  diagnostico: string;

  @Column({ type: 'text', nullable: true })
  prescricao: string;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  dataAnotacao: Date;

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
