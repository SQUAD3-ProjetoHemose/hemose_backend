// filepath: c:/Users/alisson/OneDrive/Documentos/projetos/Projeto_Hemose/hemose_backend/src/enfermagem/entities/evolucao-enfermagem.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Triagem } from './triagem.entity';
// TODO: Importar a entidade Paciente quando ela for criada/definida
// import { Paciente } from '../../pacientes/entities/paciente.entity';
// TODO: Importar a entidade User para referenciar o profissional que realizou a evolução
// import { User } from '../../users/entities/user.entity';

@Entity('evolucoes_enfermagem')
export class EvolucaoEnfermagem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // TODO: Descomentar e ajustar quando a entidade Paciente estiver disponível
  // @ManyToOne(() => Paciente, { nullable: false, eager: true })
  // @JoinColumn({ name: 'paciente_id' })
  // paciente: Paciente;

  @Column({ name: 'paciente_id', type: 'uuid' }) // Temporário até Paciente ser definido
  pacienteId: string;

  @ManyToOne(() => Triagem, { nullable: true, eager: false }) // Pode não haver uma triagem formal em alguns fluxos, ou ser referenciada de outra forma
  @JoinColumn({ name: 'triagem_id' })
  triagem?: Triagem;

  @Column({ name: 'triagem_id', type: 'uuid', nullable: true })
  triagemId?: string;

  @Column({ type: 'text' })
  descricao: string;

  // Sinais Vitais incorporados
  @Column({
    name: 'pressao_arterial_sistolica',
    type: 'integer',
    nullable: true,
  })
  pressaoArterialSistolica?: number;

  @Column({
    name: 'pressao_arterial_diastolica',
    type: 'integer',
    nullable: true,
  })
  pressaoArterialDiastolica?: number;

  @Column({ type: 'float', nullable: true })
  temperatura?: number;

  @Column({ name: 'frequencia_cardiaca', type: 'integer', nullable: true })
  frequenciaCardiaca?: number;

  @Column({ name: 'frequencia_respiratoria', type: 'integer', nullable: true })
  frequenciaRespiratoria?: number;

  @Column({ name: 'saturacao_oxigenio', type: 'integer', nullable: true })
  saturacaoOxigenio?: number;

  @Column({ name: 'glicemia_capilar', type: 'integer', nullable: true })
  glicemiaCapilar?: number;

  @Column({ name: 'nivel_dor', type: 'integer', nullable: true })
  nivelDor?: number;

  @Column({ name: 'observacoes_sinais_vitais', type: 'text', nullable: true })
  observacoesSinaisVitais?: string;
  // Fim dos Sinais Vitais

  @Column({ name: 'procedimentos_realizados', type: 'text', nullable: true })
  procedimentosRealizados?: string;

  @Column({ type: 'text', nullable: true })
  observacoes?: string;

  // TODO: Descomentar e ajustar quando a entidade User estiver disponível
  // @ManyToOne(() => User, { nullable: false, eager: true })
  // @JoinColumn({ name: 'profissional_id' })
  // profissional: User;

  @Column({ name: 'profissional_id', type: 'uuid' }) // Temporário até User ser definido
  profissionalId: string;

  @Column({ name: 'data_evolucao', type: 'datetime' }) // Alterado de CreateDateColumn e tipo para datetime
  dataEvolucao: Date;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' }) // Adicionado createdAt
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' }) // Alterado tipo para datetime
  updatedAt: Date;

  // Adicionar assinatura ASCII
  /*
   __  ____ ____ _  _
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
  */
}
