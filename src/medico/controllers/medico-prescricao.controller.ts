import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/enums/user-role.enum';
import { MedicoPrescricaoService } from '../services/medico-prescricao.service';
import { CreatePrescricaoDto } from '../dto/create-prescricao.dto';

@Controller('medico/prescricoes')
@Roles(UserRole.MEDICO)
export class MedicoPrescricaoController {
  constructor(private readonly prescricaoService: MedicoPrescricaoService) {}

  @Get()
  async getPrescricoes(
    @Query('pacienteId') pacienteId?: number,
    @Request() req?,
  ) {
    const medicoId = req.user.id;
    return this.prescricaoService.getPrescricoes(medicoId, pacienteId);
  }

  @Post()
  async criarPrescricao(
    @Body() createPrescricaoDto: CreatePrescricaoDto,
    @Request() req,
  ) {
    const medicoId = req.user.id;
    return this.prescricaoService.criarPrescricao(
      createPrescricaoDto,
      medicoId,
    );
  }

  @Get(':id')
  async getPrescricao(@Param('id', ParseIntPipe) id: number) {
    return this.prescricaoService.getPrescricaoById(id);
  }
}

/* 
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
