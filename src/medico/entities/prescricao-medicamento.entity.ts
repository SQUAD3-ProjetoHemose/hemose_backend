import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Prescricao } from './prescricao.entity';

@Entity('prescricao_medicamentos')
export class PrescricaoMedicamento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200 })
  nome: string;

  @Column({ type: 'varchar', length: 100 })
  dosagem: string;

  @Column({ type: 'varchar', length: 100 })
  via: string;

  @Column({ type: 'varchar', length: 100 })
  frequencia: string;

  @Column({ type: 'varchar', length: 100 })
  duracao: string;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @ManyToOne(() => Prescricao, (prescricao) => prescricao.medicamentos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'prescricao_id' })
  prescricao: Prescricao;

  @Column()
  prescricaoId: number;
}

/* 
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
