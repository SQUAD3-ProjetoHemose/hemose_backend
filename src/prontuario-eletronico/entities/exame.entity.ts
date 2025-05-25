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

export enum StatusExame {
  SOLICITADO = 'solicitado',
  EM_ANDAMENTO = 'em_andamento',
  CONCLUIDO = 'concluido',
  CANCELADO = 'cancelado',
}

export enum TipoExame {
  LABORATORIAL = 'laboratorial',
  IMAGEM = 'imagem',
  CARDIOLOGICO = 'cardiologico',
  OUTROS = 'outros',
}

// Entidade para exames médicos
@Entity('exames')
export class Exame {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  nomeExame: string;

  @Column({
    type: 'enum',
    enum: TipoExame,
    default: TipoExame.LABORATORIAL,
  })
  tipo: TipoExame;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({
    type: 'enum',
    enum: StatusExame,
    default: StatusExame.SOLICITADO,
  })
  status: StatusExame;

  @Column({ type: 'text', nullable: true })
  resultado: string;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  dataSolicitacao: Date;

  @Column({ type: 'datetime', nullable: true })
  dataResultado: Date;

  @ManyToOne(() => Paciente)
  @JoinColumn({ name: 'paciente_id' })
  paciente: Paciente;

  @Column()
  pacienteId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'medico_solicitante_id' })
  medicoSolicitante: User;

  @Column()
  medicoSolicitanteId: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'profissional_resultado_id' })
  profissionalResultado: User;

  @Column({ nullable: true })
  profissionalResultadoId: number;

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
