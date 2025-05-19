import { Controller, Post, Body, HttpException, HttpStatus, Logger, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { RolesGuard } from './guards/roles.guard';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    this.logger.log(`Tentativa de login recebida para: ${loginDto.email}`);

    try {
      const result = await this.authService.login(loginDto);

      if (!result.success) {
        this.logger.warn(`Falha no login para ${loginDto.email}: ${result.message}`);
        throw new HttpException(result.message || 'Acesso não autorizado', HttpStatus.UNAUTHORIZED); // Garante que sempre será uma string
      }

      this.logger.log(`Login bem-sucedido para: ${loginDto.email}`);
      return result;
    } catch (error) {
      this.logger.error(`Erro no login: ${error.message}`);
      throw new HttpException(
        error.message || 'Ocorreu um erro no processo de login',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
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
