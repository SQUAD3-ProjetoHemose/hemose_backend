import {
  Controller,
  Get,
  Query,
  UseGuards,
  ParseDatePipe,
  Header,
} from '@nestjs/common';
import { ReportsService } from '../services/reports.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/enums/user-role.enum';
// Controller responsável pelos endpoints de relatórios
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  // Dashboard principal - acessível por admin e medicos
  @Get('dashboard')
  @Roles(UserRole.ADMIN, UserRole.MEDICO)
  async getDashboard() {
    return await this.reportsService.getDashboardStats();
  }

  // Relatório de agendamentos
  @Get('agendamentos')
  @Roles(UserRole.ADMIN, UserRole.MEDICO, UserRole.RECEPCIONISTA)
  async getAgendamentosReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return await this.reportsService.getAgendamentosReport(start, end);
  }

  // Relatório de pacientes
  @Get('pacientes')
  @Roles(UserRole.ADMIN, UserRole.MEDICO, UserRole.ENFERMEIRA)
  async getPacientesReport() {
    return await this.reportsService.getPacientesReport();
  }

  // Relatório de produtividade médica
  @Get('produtividade-medica')
  @Roles(UserRole.ADMIN, UserRole.MEDICO)
  async getProdutividadeMedica(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return await this.reportsService.getProdutividadeMedicaReport(start, end);
  }

  // Relatório financeiro básico
  @Get('financeiro')
  @Roles(UserRole.ADMIN)
  async getRelatorioFinanceiro(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return await this.reportsService.getRelatorioFinanceiro(start, end);
  }

  // Exportar relatório em CSV
  @Get('export/csv')
  @Roles(UserRole.ADMIN)
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="relatorio.csv"')
  async exportCSV(
    @Query('type') type: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    let data: any[] = []; 
    
    switch (type) {
      case 'agendamentos':
        if (startDate && endDate) {
          const result = await this.reportsService.getAgendamentosReport(
            new Date(startDate),
            new Date(endDate),
          );
          data = result.agendamentos;
        }
        break;
      case 'pacientes':
        const pacientesReport = await this.reportsService.getPacientesReport();
        data = pacientesReport.porSexo; // Simplificado
        break;
      default:
        data = [];
    }

    return await this.reportsService.exportToCSV(type, data);
  }
}

/* 
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/

   */
