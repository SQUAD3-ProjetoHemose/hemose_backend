import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Prescricao } from './prescricao.entity';

@Entity('medicamentos')
export class Medicamento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nome: string;

  @Column({ length: 100, nullable: true })
  fabricante: string;

  @Column({ length: 50, nullable: true })
  lote: string;

  @Column({ type: 'date', nullable: true })
  validade: Date;

  @Column({ type: 'int', default: 0 })
  estoque: number;

  @OneToMany(() => Prescricao, prescricao => prescricao.medicamento)
  prescricoes: Prescricao[];
}
