import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Paciente } from '../paciente/entities/paciente.entity';
import { Medico } from './medico.entity';
import { Medicamento } from './medicamento.entity';

@Entity('prescricoes')
export class Prescricao {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Paciente, paciente => paciente.prescricoes)
  @JoinColumn({ name: 'paciente_id' })
  paciente: Paciente;

  @ManyToOne(() => Medico, medico => medico.prescricoes)
  @JoinColumn({ name: 'medico_id' })
  medico: Medico;

  @ManyToOne(() => Medicamento)
  @JoinColumn({ name: 'medicamento_id' })
  medicamento: Medicamento;

  @Column({ length: 50, nullable: true })
  dosagem: string;

  @Column({ length: 50, nullable: true })
  frequencia: string;

  @Column({ type: 'datetime' })
  data_prescricao: Date;
}
