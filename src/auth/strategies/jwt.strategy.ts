import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Interface para o payload do JWT
export interface JwtPayload {
  sub: number; // ID do usuário
  email: string;
  tipo: string; // Role do usuário (usando 'tipo' em vez de 'role')
  iat?: number; // Issued at
  exp?: number; // Expiration time
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'hemose-secret-key',
    });
  }

  // Método de validação do payload JWT
  async validate(payload: JwtPayload) {
    // Retornar os dados do usuário que serão anexados ao request
    return {
      id: payload.sub,
      email: payload.email,
      tipo: payload.tipo, // Usar 'tipo' em vez de 'role'
    };
  }
}

/* 
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
