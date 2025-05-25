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

// Entidade para registro de sinais vitais
@Entity('sinais_vitais')
export class SinaisVitais {
  @PrimaryGeneratedColumn()
  id: number;

  // Pressão arterial sistólica
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  pressaoSistolica: number;

  // Pressão arterial diastólica
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  pressaoDiastolica: number;

  // Frequência cardíaca (bpm)
  @Column({ type: 'int', nullable: true })
  frequenciaCardiaca: number;

  // Frequência respiratória (rpm)
  @Column({ type: 'int', nullable: true })
  frequenciaRespiratoria: number;

  // Temperatura corporal (°C)
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  temperatura: number;

  // Saturação de oxigênio (%)
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  saturacaoOxigenio: number;

  // Peso (kg)
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  peso: number;

  // Altura (cm)
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  altura: number;

  // Observações
  @Column({ type: 'text', nullable: true })
  observacoes: string;

  // Data e hora do registro
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  dataRegistro: Date;

  // Paciente relacionado
  @ManyToOne(() => Paciente)
  @JoinColumn({ name: 'paciente_id' })
  paciente: Paciente;

  @Column()
  pacienteId: number;

  // Profissional que registrou
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
