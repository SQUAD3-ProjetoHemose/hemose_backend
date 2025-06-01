import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('templates')
export class Template {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nome: string;

  @Column({ type: 'varchar', length: 50 })
  tipo: string; // atestado, prescricao, liberacao

  @Column({ type: 'text' })
  conteudo: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ type: 'boolean', default: false })
  padrao: boolean; // template padrão do sistema

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'medico_id' })
  medico: User;

  @Column({ nullable: true })
  medicoId: number; // null = template global

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

/* 
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
