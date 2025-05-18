import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default-secret',
    });
  }

  async validate(payload: any) {
    // O payload aqui é o que foi assinado no AuthService (sub, email, nome, tipo)
    // Podemos adicionar mais lógica aqui se necessário, como buscar o usuário no banco
    return { userId: payload.sub, email: payload.email, nome: payload.nome, tipo: payload.tipo };
  }
}
