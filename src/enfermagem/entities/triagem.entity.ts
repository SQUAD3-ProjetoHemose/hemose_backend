/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { EvolucaoEnfermagem } from './evolucao-enfermagem.entity';

@Entity('triagens')
export class Triagem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'paciente_id' })
  pacienteId: string;

  @Column({ name: 'profissional_id' })
  profissionalId: string;

  // Dados vitais da triagem
  @Column({ name: 'pressao_arterial', nullable: true })
  pressaoArterial: string;

  @Column({ name: 'frequencia_cardiaca', type: 'int', nullable: true })
  frequenciaCardiaca: number;

  @Column({ name: 'frequencia_respiratoria', type: 'int', nullable: true })
  frequenciaRespiratoria: number;

  @Column({
    name: 'temperatura',
    type: 'decimal',
    precision: 4,
    scale: 1,
    nullable: true,
  })
  temperatura: number;

  @Column({ name: 'saturacao_oxigenio', type: 'int', nullable: true })
  saturacaoOxigenio: number;

  @Column({
    name: 'peso',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  peso: number;

  @Column({
    name: 'altura',
    type: 'decimal',
    precision: 3,
    scale: 2,
    nullable: true,
  })
  altura: number;

  // Classificação de risco
  @Column({ name: 'nivel_dor', type: 'int', nullable: true })
  nivelDor: number;

  @Column({ name: 'classificacao_risco' })
  classificacaoRisco: string; // 'baixo', 'medio', 'alto', 'critico'

  @Column({ name: 'prioridade_atendimento', type: 'int' })
  prioridadeAtendimento: number; // 1 (mais urgente) a 5 (menos urgente)

  // Queixa principal e observações
  @Column({ name: 'queixa_principal', type: 'text' })
  queixaPrincipal: string;

  @Column({ name: 'historico_atual', type: 'text', nullable: true })
  historicoAtual: string;

  @Column({ name: 'observacoes', type: 'text', nullable: true })
  observacoes: string;

  // Informações médicas de apoio (adicionadas por médicos)
  @Column({ name: 'observacoes_medicas', type: 'text', nullable: true })
  observacoesMedicas: string;

  // Status da triagem
  @Column({ name: 'status', default: 'aguardando' })
  status: string; // 'aguardando', 'em_atendimento', 'finalizada'

  @CreateDateColumn({ name: 'data_triagem' })
  dataTriagem: Date;

  @UpdateDateColumn({ name: 'data_atualizacao' })
  dataAtualizacao: Date;

  // Relacionamentos
  @OneToMany(() => EvolucaoEnfermagem, (evolucao) => evolucao.triagem)
  evolucoes: EvolucaoEnfermagem[];
}

/*
   __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
