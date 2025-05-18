import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Paciente } from '../paciente/entities/paciente.entity';
import { Medicamento } from './medicamento.entity';

@Entity('pacientes_medicamentos')
export class PacienteMedicamento {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Paciente)
  @JoinColumn({ name: 'paciente_id' })
  paciente: Paciente;

  @ManyToOne(() => Medicamento)
  @JoinColumn({ name: 'medicamento_id' })
  medicamento: Medicamento;

  @Column({ type: 'int' })
  quantidade: number;

  @Column({ type: 'datetime' })
  data_administracao: Date;
}
