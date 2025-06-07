import { 
  Controller, 
  Post, 
  Patch, 
  Get, 
  Param, 
  Body, 
  UseGuards, 
  Request,
  ParseIntPipe 
} from '@nestjs/common';
import { Roles } from '../../auth/decorators/roles.decorator';

import { UserRole } from '../../users/enums/user-role.enum';
import { MedicoAtendimentoService } from '../services/medico-atendimento.service';

@Controller('medico/atendimento')
@Roles(UserRole.MEDICO)
export class MedicoAtendimentoController {
  constructor(
    private readonly atendimentoService: MedicoAtendimentoService,
  ) {}

  @Post('iniciar/:pacienteId')
  async iniciarAtendimento(
    @Param('pacienteId', ParseIntPipe) pacienteId: number,
    @Request() req,
  ) {
    const medicoId = req.user.id;
    return this.atendimentoService.iniciarAtendimento(pacienteId, medicoId);
  }

  @Patch('finalizar/:atendimentoId')
  async finalizarAtendimento(
    @Param('atendimentoId', ParseIntPipe) atendimentoId: number,
    @Body() dados: any,
    @Request() req,
  ) {
    const medicoId = req.user.id;
    return this.atendimentoService.finalizarAtendimento(atendimentoId, dados, medicoId);
  }

  @Get('historico/:pacienteId')
  async getHistoricoPaciente(
    @Param('pacienteId', ParseIntPipe) pacienteId: number,
  ) {
    return this.atendimentoService.getHistoricoAtendimentos(pacienteId);
  }
}

/* 
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
