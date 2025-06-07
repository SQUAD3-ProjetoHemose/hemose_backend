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

@Entity('atestados')
export class Atestado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  tipo: string; // liberacao_trabalho, restricao_atividade, saude_geral

  @Column({ type: 'text' })
  conteudo: string;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @Column({ type: 'datetime' })
  dataEmissao: Date;

  @Column({ type: 'datetime', nullable: true })
  dataValidade: Date;

  @Column({ type: 'int', default: 1 })
  diasAfastamento: number;

  @Column({ type: 'varchar', length: 50, default: 'ativo' })
  status: string; // ativo, cancelado, expirado

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
