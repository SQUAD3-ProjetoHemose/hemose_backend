import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Medicamento } from './medicamento.entity';

@Entity('estoque_medicamentos')
export class EstoqueMedicamentos {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Medicamento)
  @JoinColumn({ name: 'medicamento_id' })
  medicamento: Medicamento;

  @Column({ length: 100, nullable: true })
  fornecedor: string;

  @Column({ type: 'int' })
  quantidade: number;

  @Column({ type: 'date' })
  data_recebimento: Date;
}
