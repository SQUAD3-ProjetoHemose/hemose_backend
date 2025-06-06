import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/enums/user-role.enum';

@Injectable()
export class UsersSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(UsersSeedService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Método executado automaticamente quando a aplicação inicializa
   */
  async onApplicationBootstrap() {
    await this.seed();
  }

  /**
   * Cria os usuários padrão se eles não existirem
   */
  async seed() {
    this.logger.log('🔄 Verificando e criando usuários padrão...');

    // Administradores do sistema
    await this.createUserIfNotExists({
      nome: 'Administrador do Sistema',
      email: 'admin@hemose.com',
      senha: 'admin123',
      tipo: UserRole.ADMIN,
    });

    // Médicos com especialidades variadas
    await this.createUserIfNotExists({
      nome: 'Dr. João Silva',
      email: 'joao.silva@hemose.com',
      senha: 'medico123',
      tipo: UserRole.MEDICO,
      especialidade: 'Hematologia',
      crm: '12345-SP',
    });

    await this.createUserIfNotExists({
      nome: 'Dra. Maria Santos',
      email: 'maria.santos@hemose.com',
      senha: 'medico123',
      tipo: UserRole.MEDICO,
      especialidade: 'Oncologia',
      crm: '67890-SP',
    });

    await this.createUserIfNotExists({
      nome: 'Dr. Carlos Oliveira',
      email: 'carlos.oliveira@hemose.com',
      senha: 'medico123',
      tipo: UserRole.MEDICO,
      especialidade: 'Clínica Geral',
      crm: '11111-RJ',
    });

    await this.createUserIfNotExists({
      nome: 'Dra. Ana Rodrigues',
      email: 'ana.rodrigues@hemose.com',
      senha: 'medico123',
      tipo: UserRole.MEDICO,
      especialidade: 'Hemoterapia',
      crm: '22222-MG',
    });

    // Enfermeiras com COREN
    await this.createUserIfNotExists({
      nome: 'Maria Enfermeira',
      email: 'maria.enfermeira@hemose.com',
      senha: 'enfermeira123',
      tipo: UserRole.ENFERMEIRA,
      coren: '123456-SP',
    });

    await this.createUserIfNotExists({
      nome: 'Fernanda Costa',
      email: 'fernanda.costa@hemose.com',
      senha: 'enfermeira123',
      tipo: UserRole.ENFERMEIRA,
      coren: '789012-SP',
    });

    await this.createUserIfNotExists({
      nome: 'Juliana Lima',
      email: 'juliana.lima@hemose.com',
      senha: 'enfermeira123',
      tipo: UserRole.ENFERMEIRA,
      coren: '345678-RJ',
    });

    // Recepcionistas
    await this.createUserIfNotExists({
      nome: 'Ana Recepcionista',
      email: 'ana.recepcao@hemose.com',
      senha: 'recepcionista123',
      tipo: UserRole.RECEPCIONISTA,
    });

    await this.createUserIfNotExists({
      nome: 'Carlos Atendimento',
      email: 'carlos.atendimento@hemose.com',
      senha: 'recepcionista123',
      tipo: UserRole.RECEPCIONISTA,
    });

    this.logger.log('✅ Verificação de usuários padrão concluída!');
  }

  /**
   * Cria um usuário se ele não existir
   */
  private async createUserIfNotExists(userData: {
    nome: string;
    email: string;
    senha: string;
    tipo: UserRole;
    especialidade?: string;
    crm?: string;
    coren?: string;
  }): Promise<void> {
    try {
      // Verificar se o usuário já existe
      const existingUser = await this.usersRepository.findOne({
        where: { email: userData.email },
      });

      if (!existingUser) {
        // Hash da senha antes de salvar
        const hashedPassword = await bcrypt.hash(userData.senha, 10);

        // Criar o usuário com dados específicos
        const newUser = this.usersRepository.create({
          nome: userData.nome,
          email: userData.email,
          senha: hashedPassword,
          tipo: userData.tipo,
          ativo: true,
          especialidade: userData.especialidade,
          crm: userData.crm,
          coren: userData.coren,
        });

        await this.usersRepository.save(newUser);
        this.logger.log(
          `✨ Usuário padrão criado: ${userData.email} (${userData.tipo})`,
        );
      } else {
        this.logger.log(
          `ℹ️  Usuário já existe: ${userData.email} (${userData.tipo})`,
        );
      }
    } catch (error) {
      this.logger.error(
        `❌ Erro ao criar usuário padrão ${userData.email}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      );
    }
  }

  /**
   * Retorna todos os usuários criados para uso em outros seeds
   */
  async getUsers(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  /**
   * Retorna usuários por tipo
   */
  async getUsersByRole(role: UserRole): Promise<User[]> {
    return await this.usersRepository.find({
      where: { tipo: role },
    });
  }
}

/*             
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
