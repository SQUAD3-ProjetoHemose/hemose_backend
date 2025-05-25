import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { AuditService } from '../services/audit.service';
import { CreateAuditLogDto } from '../dto/create-audit-log.dto';
import { AuditQueryDto } from '../dto/audit-query.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/enums/user-role.enum';

// Controller responsável pelos endpoints de auditoria
@Controller('audit')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  // Criar um novo log de auditoria (uso interno do sistema)
  @Post()
  @Roles(UserRole.ADMIN) // Apenas admins podem criar logs manualmente
  async createLog(@Body() createAuditLogDto: CreateAuditLogDto) {
    return await this.auditService.createLog(createAuditLogDto);
  }

  // Buscar logs de auditoria com filtros
  @Get()
  @Roles(UserRole.ADMIN) // Apenas admins podem visualizar logs
  async getLogs(@Query() query: AuditQueryDto) {
    return await this.auditService.findLogs(query);
  }

  // Obter estatísticas de auditoria
  @Get('stats')
  @Roles(UserRole.ADMIN)
  async getStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return await this.auditService.getAuditStats(start, end);
  }

  // Buscar logs de um usuário específico
  @Get('user/:userId')
  @Roles(UserRole.ADMIN)
  async getUserLogs(
    @Query('userId') userId: number,
    @Query('limit') limit?: number,
  ) {
    return await this.auditService.getUserAuditLogs(userId, limit);
  }

  // Limpar logs antigos (manutenção)
  @Delete('cleanup')
  @Roles(UserRole.ADMIN)
  async cleanupOldLogs(@Query('daysToKeep') daysToKeep?: number) {
    return await this.auditService.cleanOldLogs(daysToKeep);
  }
}

/* 
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/

    */
