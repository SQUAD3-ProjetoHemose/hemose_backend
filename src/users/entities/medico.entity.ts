import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Funcionario } from './funcionario.entity';
import { Prescricao } from './prescricao.entity';

@Entity('medicos')
export class Medico {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nome: string;

  @Column({ length: 20, unique: true })
  registroProfissional: string;

  @Column({ length: 100 })
  especialidade: string;

  @Column({ length: 20, nullable: true })
  telefone: string;

  @ManyToOne(() => Funcionario, (funcionario) => funcionario.medicos)
  @JoinColumn({ name: 'funcionario_id' })
  funcionario: Funcionario;

  @OneToMany(() => Prescricao, (prescricao) => prescricao.medico)
  prescricoes: Prescricao[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
