import { Injectable, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './enums/user-role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Verifica se já existe um usuário com o mesmo email
    const existingUser = await this.usersRepository.findOne({ 
      where: { email: createUserDto.email } 
    });
    
    if (existingUser) {
      throw new ConflictException('Já existe um usuário com este email');
    }

    // Hash da senha antes de salvar
    const hashedPassword = await bcrypt.hash(createUserDto.senha, 10);
    
    // Cria e salva o novo usuário
    const user = this.usersRepository.create({
      ...createUserDto,
      senha: hashedPassword
    });
    
    return this.usersRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findAllByRole(role: UserRole): Promise<User[]> {
    return this.usersRepository.find({ where: { tipo: role } });
  }

  async findOne(id: number): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        this.logger.warn(`Usuário não encontrado com ID: ${id}`);
        throw new NotFoundException('Usuário não encontrado');
      }
      return user;
    } catch (error) {
      this.logger.error(`Erro ao buscar usuário por ID: ${error.message}`);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ where: { email } });
      if (!user) {
        this.logger.warn(`Usuário não encontrado com email: ${email}`);
        throw new NotFoundException('Usuário não encontrado');
      }
      return user;
    } catch (error) {
      this.logger.error(`Erro ao buscar usuário por email: ${error.message}`);
      throw error;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    
    // Se a senha estiver sendo atualizada, faz o hash
    if (updateUserDto.senha) {
      updateUserDto.senha = await bcrypt.hash(updateUserDto.senha, 10);
    }
    
    const updatedUser = { ...user, ...updateUserDto };
    return this.usersRepository.save(updatedUser);
  }

  async remove(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Usuário não encontrado');
    }
  }
  
  // Método para validar a senha (útil para autenticação)
  async validatePassword(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.findByEmail(email);
      
      if (!user) {
        return null;
      }
      
      const isPasswordValid = await bcrypt.compare(password, user.senha);
      
      if (isPasswordValid) {
        return user;
      }
      
      return null;
    } catch (error) {
      this.logger.error(`Erro na validação de senha: ${error.message}`);
      return null;
    }
  }
}
            
/*             
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
