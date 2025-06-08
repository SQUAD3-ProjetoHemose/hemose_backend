import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Logger,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { RolesGuard } from './guards/roles.guard';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Public() // Marcar como rota pública para não ser interceptada pelo JwtAuthGuard
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    this.logger.log(`Tentativa de login recebida para: ${loginDto.email}`);

    try {
      const result = await this.authService.login(loginDto);

      // Se o login falhou, retornar erro HTTP 401
      if (!result.success) {
        this.logger.warn(
          `Falha no login para ${loginDto.email}: ${result.message}`,
        );
        throw new HttpException(
          'Credenciais inválidas',
          HttpStatus.UNAUTHORIZED,
        );
      }

      this.logger.log(`Login bem-sucedido para: ${loginDto.email}`);
      return result;
    } catch (error) {
      this.logger.error(`Erro no login: ${error.message}`);

      // Se já é uma HttpException, re-lançar
      if (error instanceof HttpException) {
        throw error;
      }

      // Caso contrário, lançar erro interno do servidor
      throw new HttpException(
        'Erro interno do servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return { user: req.user };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin')
  adminRoute() {
    return { message: 'Esta rota é apenas para administradores' };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MEDICO)
  @Get('medico')
  medicoRoute() {
    return { message: 'Esta rota é apenas para médicos' };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ENFERMEIRA)
  @Get('enfermeira')
  enfermeiraRoute() {
    return { message: 'Esta rota é apenas para enfermeiras' };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RECEPCIONISTA)
  @Get('recepcionista')
  recepcionistaRoute() {
    return { message: 'Esta rota é apenas para recepcionistas' };
  }
}

/*
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
