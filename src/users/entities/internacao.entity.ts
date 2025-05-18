import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Paciente } from '../paciente/entities/paciente.entity';
import { Leito } from './leito.entity';
import { Medico } from './medico.entity';

@Entity('internacoes')
export class Internacao {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Paciente, paciente => paciente.internacoes)
  @JoinColumn({ name: 'paciente_id' })
  paciente: Paciente;

  @ManyToOne(() => Leito)
  @JoinColumn({ name: 'leito_id' })
  leito: Leito;

  @ManyToOne(() => Medico)
  @JoinColumn({ name: 'medico_responsavel' })
  medico_responsavel: Medico;

  @Column({ type: 'datetime' })
  data_entrada: Date;

  @Column({ type: 'datetime', nullable: true })
  data_saida: Date;

  @Column({ type: 'text', nullable: true })
  diagnostico: string;
}
