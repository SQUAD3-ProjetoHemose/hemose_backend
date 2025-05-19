import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/enums/user-role.enum';
import * as bcrypt from 'bcrypt';

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
    this.logger.log('Verificando usuários padrão...');

    // Verifica e cria cada tipo de usuário padrão
    await this.createUserIfNotExists({
      nome: 'Administrador',
      email: 'admin@hemose.com',
      senha: 'admin123',
      tipo: UserRole.ADMIN,
    });

    await this.createUserIfNotExists({
      nome: 'Dr. João Silva',
      email: 'medico@hemose.com',
      senha: 'medico123',
      tipo: UserRole.MEDICO,
    });

    await this.createUserIfNotExists({
      nome: 'Maria Enfermeira',
      email: 'enfermeira@hemose.com',
      senha: 'enfermeira123',
      tipo: UserRole.ENFERMEIRA,
    });

    await this.createUserIfNotExists({
      nome: 'Ana Recepcionista',
      email: 'recepcionista@hemose.com',
      senha: 'recepcionista123',
      tipo: UserRole.RECEPCIONISTA,
    });

    this.logger.log('Verificação de usuários padrão concluída!');
  }

  /**
   * Cria um usuário se ele não existir
   */
  private async createUserIfNotExists(userData: {
    nome: string;
    email: string;
    senha: string;
    tipo: UserRole;
  }): Promise<void> {
    try {
      // Verifica se o usuário já existe
      const existingUser = await this.usersRepository.findOne({
        where: { email: userData.email },
      });

      if (!existingUser) {
        // Hash da senha antes de salvar
        const hashedPassword = await bcrypt.hash(userData.senha, 10);
        
        // Cria o usuário
        const newUser = this.usersRepository.create({
          nome: userData.nome,
          email: userData.email,
          senha: hashedPassword, // Senha já com hash
          tipo: userData.tipo,
          ativo: true,
        });

        await this.usersRepository.save(newUser);
        this.logger.log(`Usuário padrão criado: ${userData.email} (${userData.tipo})`);
      } else {
        this.logger.log(`Usuário já existe: ${userData.email} (${userData.tipo})`);
      }
    } catch (error) {
      this.logger.error(`Erro ao criar usuário padrão ${userData.email}: ${error.message}`);
    }
  }
}
            
/*             
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
