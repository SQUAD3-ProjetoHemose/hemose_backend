import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Internacao } from './internacao.entity';

@Entity('leitos')
export class Leito {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  numero: number;

  @Column({ length: 50 })
  tipo: string;

  @Column({ length: 20 })
  status: string; // Ex: 'ocupado', 'livre', 'manutencao'

  @OneToMany(() => Internacao, internacao => internacao.leito)
  internacoes: Internacao[];
}
