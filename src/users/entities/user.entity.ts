import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserRole } from '../enums/user-role.enum';

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nome: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  senha: string;

  // Usar VARCHAR em vez de enum para compatibilidade com SQLite
  @Column({ 
    type: 'varchar', 
    length: 50,
    default: UserRole.MEDICO 
  })
  tipo: UserRole;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  // Campos específicos para médicos
  @Column({ type: 'varchar', length: 255, nullable: true })
  especialidade?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  crm?: string;

  // Campo específico para enfermeiras
  @Column({ type: 'varchar', length: 50, nullable: true })
  coren?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

/* 
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
