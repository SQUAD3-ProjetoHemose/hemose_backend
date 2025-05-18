import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, senha: string): Promise<any> {
    console.log(`Validando usuário com email: ${email}`);
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      console.log('Usuário não encontrado.');
      return null;
    }

    // Comparação direta da senha sem criptografia
    const isPasswordValid = senha === user.senha;
    console.log(`Senha válida: ${isPasswordValid}`);

    if (isPasswordValid) {
      const { senha, ...result } = user;
      return result;
    }

    return null;
  }

  async login(loginDto: LoginDto) {
    console.log(`Tentativa de login para o email: ${loginDto.email}`);
    const user = await this.validateUser(loginDto.email, loginDto.senha);

    if (!user) {
      console.log('Falha no login: Credenciais inválidas.');
      return { success: false, message: 'Credenciais inválidas' };
    }

    console.log('Login bem-sucedido:', user);
    const payload = { 
      sub: user.id, 
      email: user.email,
      nome: user.nome,
      tipo: user.tipo 
    };

    return {
      success: true,
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo
      }
    };
  }
}
