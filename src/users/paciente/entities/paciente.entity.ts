import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Prescricao } from '../../entities/prescricao.entity';
import { Internacao } from '../../entities/internacao.entity';

@Entity('pacientes')
export class Paciente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nome: string;

  @Column({ type: 'date' })
  data_nascimento: Date;

  @Column({ length: 14, unique: true })
  cpf: string;

  @Column({ length: 20, nullable: true })
  telefone: string;

  @Column({ type: 'text', nullable: true })
  endereco: string;

  @Column({ length: 5, nullable: true })
  tipo_sanguineo: string;

  @Column({ type: 'text', nullable: true })
  alergias: string;

  @Column({ type: 'text', nullable: true })
  historico_medico: string;

  @OneToMany(() => Prescricao, prescricao => prescricao.paciente)
  prescricoes: Prescricao[];

  @OneToMany(() => Internacao, internacao => internacao.paciente)
  internacoes: Internacao[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}