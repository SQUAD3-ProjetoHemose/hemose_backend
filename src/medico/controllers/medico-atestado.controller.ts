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
import { MedicoAtestadoService } from '../services/medico-atestado.service';
import { CreateAtestadoDto } from '../dto/create-atestado.dto';

@Controller('medico/atestados')
@Roles(UserRole.MEDICO)
export class MedicoAtestadoController {
  constructor(private readonly atestadoService: MedicoAtestadoService) {}

  @Get()
  async getAtestados(
    @Query('pacienteId') pacienteId?: number,
    @Request() req?,
  ) {
    const medicoId = req.user.id;
    return this.atestadoService.getAtestados(medicoId, pacienteId);
  }

  @Post()
  async criarAtestado(
    @Body() createAtestadoDto: CreateAtestadoDto,
    @Request() req,
  ) {
    const medicoId = req.user.id;
    return this.atestadoService.criarAtestado(createAtestadoDto, medicoId);
  }

  @Get(':id')
  async getAtestado(@Param('id', ParseIntPipe) id: number) {
    return this.atestadoService.getAtestadoById(id);
  }
}

/* 
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
