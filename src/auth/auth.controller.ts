import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { RolesGuard } from './guards/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
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
