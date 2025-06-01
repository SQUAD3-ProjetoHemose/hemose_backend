import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Paciente } from '../../users/paciente/entities/paciente.entity';
import { User } from '../../users/entities/user.entity';
import { PrescricaoMedicamento } from './prescricao-medicamento.entity';

@Entity('prescricoes')
export class Prescricao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'datetime' })
  dataEmissao: Date;

  @Column({ type: 'datetime' })
  dataValidade: Date;

  @Column({ type: 'text', nullable: true })
  orientacoes: string;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  retorno: string;

  @Column({ type: 'varchar', length: 50, default: 'ativa' })
  status: string; // ativa, dispensada, cancelada, expirada

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

  @OneToMany(() => PrescricaoMedicamento, medicamento => medicamento.prescricao, {
    cascade: true,
    eager: true,
  })
  medicamentos: PrescricaoMedicamento[];

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
