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

@Entity('fila_espera')
export class FilaEspera {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20 })
  prioridade: string; // verde, azul, amarelo, laranja, vermelho

  @Column({ type: 'text' })
  descricaoPrioridade: string;

  @Column({ type: 'text' })
  queixaPrincipal: string;

  @Column({ type: 'datetime' })
  horarioChegada: Date;

  @Column({ type: 'varchar', length: 50 })
  tipoAtendimento: string; // consulta, retorno, urgencia

  @Column({ type: 'varchar', length: 50, default: 'aguardando' })
  status: string; // aguardando, em_atendimento, atendido, cancelado

  @Column({ type: 'datetime', nullable: true })
  horaInicioAtendimento: Date;

  @Column({ type: 'datetime', nullable: true })
  horaFimAtendimento: Date;

  @ManyToOne(() => Paciente)
  @JoinColumn({ name: 'paciente_id' })
  paciente: Paciente;

  @Column()
  pacienteId: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'medico_id' })
  medico: User;

  @Column({ nullable: true })
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
