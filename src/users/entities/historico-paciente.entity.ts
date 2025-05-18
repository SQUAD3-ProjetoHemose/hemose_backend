import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Paciente } from '../paciente/entities/paciente.entity';
import { Prontuario } from './prontuario.entity';

@Entity('historico_pacientes')
export class HistoricoPaciente {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Paciente)
  @JoinColumn({ name: 'paciente_id' })
  paciente: Paciente;

  @ManyToOne(() => Prontuario)
  @JoinColumn({ name: 'prontuario_id' })
  prontuario: Prontuario;

  @Column({ type: 'datetime' })
  data_registro: Date;

  @Column({ type: 'text', nullable: true })
  observacoes: string;
}
