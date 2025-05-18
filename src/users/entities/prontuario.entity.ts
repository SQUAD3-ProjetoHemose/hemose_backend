import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Paciente } from '../paciente/entities/paciente.entity';
import { Medico } from './medico.entity';
import { HistoricoPaciente } from './historico-paciente.entity'; // Assuming this entity will be created

@Entity('prontuarios')
export class Prontuario {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Paciente)
  @JoinColumn({ name: 'paciente_id' })
  paciente: Paciente;

  @ManyToOne(() => Medico)
  @JoinColumn({ name: 'medico_id' })
  medico: Medico;

  @Column({ type: 'datetime' })
  data_atendimento: Date;

  @Column({ type: 'text' })
  descricao: string;

  @OneToMany(() => HistoricoPaciente, historico => historico.prontuario)
  historicos: HistoricoPaciente[];

  @CreateDateColumn()
  created_at: Date;
}
