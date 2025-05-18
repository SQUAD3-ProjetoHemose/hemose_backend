import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Funcionario } from './funcionario.entity';
import { Internacao } from './internacao.entity';

@Entity('funcionarios_internacoes')
export class FuncionarioInternacao {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Funcionario)
  @JoinColumn({ name: 'funcionario_id' })
  funcionario: Funcionario;

  @ManyToOne(() => Internacao)
  @JoinColumn({ name: 'internacao_id' })
  internacao: Internacao;

  @Column({ length: 50 })
  funcao: string; // Ex: 'enfermeiro_responsavel', 'auxiliar', etc.
}
