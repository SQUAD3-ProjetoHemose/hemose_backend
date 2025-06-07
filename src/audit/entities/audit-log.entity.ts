import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

// Entidade para registro de auditoria das ações no sistema
@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  // Usuário que executou a ação
  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Ação executada (CREATE, UPDATE, DELETE, LOGIN, etc.)
  @Column({ length: 50 })
  action: string;

  // Recurso/entidade afetada (User, Paciente, Agendamento, etc.)
  @Column({ length: 100 })
  resource: string;

  // ID do recurso afetado
  @Column({ name: 'resource_id', nullable: true })
  resourceId: number;

  // Detalhes da ação em JSON
  @Column({ type: 'json', nullable: true })
  details: object;

  // IP do usuário
  @Column({ name: 'ip_address', length: 45, nullable: true })
  ipAddress: string;

  // User Agent do navegador
  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent: string;

  // Timestamp da ação
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Status da operação (SUCCESS, ERROR)
  @Column({ length: 20, default: 'SUCCESS' })
  status: string;

  // Mensagem de erro, se houver
  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage: string;
}

/* 
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/

   */
