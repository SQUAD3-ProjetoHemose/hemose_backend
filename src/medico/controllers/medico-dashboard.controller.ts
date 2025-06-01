import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/enums/user-role.enum';
import { MedicoDashboardService } from '../services/medico-dashboard.service';
import { FilaEsperaService } from '../services/fila-espera.service';

@Controller('medico')
@Roles(UserRole.MEDICO)
export class MedicoDashboardController {
  constructor(
    private readonly dashboardService: MedicoDashboardService,
    private readonly filaEsperaService: FilaEsperaService,
  ) {}

  @Get('dashboard')
  async getDashboard(@Request() req) {
    const medicoId = req.user.id;
    return this.dashboardService.getDashboardData(medicoId);
  }

  @Get('fila-espera')
  async getFilaEspera() {
    return this.filaEsperaService.getFilaEsperaOrdenada();
  }

  @Get('estatisticas')
  async getEstatisticas(@Request() req) {
    const medicoId = req.user.id;
    return this.dashboardService.getEstatisticasMedico(medicoId);
  }
}

/* 
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
