import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '../../users/enums/user-role.enum';
import { CreateEvolucaoEnfermagemDto } from '../dto/create-evolucao-enfermagem.dto';
import { CreateTriagemDto } from '../dto/create-triagem.dto';
import { EnfermagemService } from '../services/enfermagem.service';

@ApiTags('Enfermagem')
@ApiBearerAuth()
@Controller('enfermagem')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EnfermagemController {
  constructor(private readonly enfermagemService: EnfermagemService) {}

  @Post('triagem')
  @Roles(UserRole.ENFERMEIRA, UserRole.TECNICA_ENFERMAGEM)
  @ApiOperation({ summary: 'Realizar triagem do paciente' })
  @ApiResponse({ status: 201, description: 'Triagem realizada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  async realizarTriagem(
    @Body() createTriagemDto: CreateTriagemDto,
    @CurrentUser() usuarioLogado: any,
  ) {
    return this.enfermagemService.realizarTriagem(
      createTriagemDto,
      usuarioLogado,
    );
  }

  @Post('evolucao')
  @Roles(UserRole.ENFERMEIRA, UserRole.TECNICA_ENFERMAGEM)
  @ApiOperation({
    summary: 'Registrar evolução de enfermagem (incluindo sinais vitais)',
  })
  @ApiResponse({ status: 201, description: 'Evolução registrada com sucesso.' })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou triagem não realizada.',
  })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  async registrarEvolucaoEnfermagem(
    @Body() createEvolucaoDto: CreateEvolucaoEnfermagemDto,
    @CurrentUser() usuarioLogado: any,
  ) {
    return this.enfermagemService.registrarEvolucaoEnfermagem(
      createEvolucaoDto,
      usuarioLogado,
    );
  }

  @Get('paciente/:pacienteId/triagens')
  @Roles(UserRole.ENFERMEIRA, UserRole.TECNICA_ENFERMAGEM, UserRole.MEDICO)
  @ApiOperation({ summary: 'Buscar triagens de um paciente' })
  @ApiResponse({
    status: 200,
    description: 'Lista de triagens retornada com sucesso.',
  })
  async buscarTriagensPaciente(
    @Param('pacienteId') pacienteId: string,
    @CurrentUser() usuarioLogado: any,
  ) {
    return this.enfermagemService.buscarTriagensPaciente(
      pacienteId,
      usuarioLogado,
    );
  }

  @Get('paciente/:pacienteId/evolucoes')
  @Roles(UserRole.ENFERMEIRA, UserRole.TECNICA_ENFERMAGEM)
  @ApiOperation({ summary: 'Buscar evoluções de enfermagem de um paciente' })
  @ApiResponse({
    status: 200,
    description: 'Lista de evoluções retornada com sucesso.',
  })
  async buscarEvolucoesPaciente(
    @Param('pacienteId') pacienteId: string,
    @CurrentUser() usuarioLogado: any,
  ) {
    return this.enfermagemService.buscarEvolucoesPaciente(
      pacienteId,
      usuarioLogado,
    );
  }

  @Get('triagem/:triagemId')
  @Roles(UserRole.ENFERMEIRA, UserRole.TECNICA_ENFERMAGEM, UserRole.MEDICO)
  @ApiOperation({ summary: 'Buscar detalhes de uma triagem específica' })
  @ApiResponse({
    status: 200,
    description: 'Detalhes da triagem retornados com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Triagem não encontrada.' })
  async buscarTriagem(
    @Param('triagemId') triagemId: string,
    @CurrentUser() usuarioLogado: any,
  ) {
    return this.enfermagemService.buscarTriagem(triagemId, usuarioLogado);
  }

  @Patch('triagem/:triagemId')
  @Roles(UserRole.ENFERMEIRA, UserRole.TECNICA_ENFERMAGEM)
  @ApiOperation({ summary: 'Atualizar dados de uma triagem' })
  @ApiResponse({ status: 200, description: 'Triagem atualizada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Triagem não encontrada.' })
  async atualizarTriagem(
    @Param('triagemId') triagemId: string,
    @Body() updateTriagemDto: Partial<CreateTriagemDto>,
    @CurrentUser() usuarioLogado: any,
  ) {
    return this.enfermagemService.atualizarTriagem(
      triagemId,
      updateTriagemDto,
      usuarioLogado,
    );
  }

  // Endpoint para médicos adicionarem informações de apoio à triagem
  @Post('triagem/:triagemId/suporte-medico')
  @Roles(UserRole.MEDICO)
  @ApiOperation({ summary: 'Adicionar informações médicas de apoio à triagem' })
  @ApiResponse({
    status: 201,
    description: 'Informações adicionadas com sucesso.',
  })
  async adicionarSuporteMedicoTriagem(
    @Param('triagemId') triagemId: string,
    @Body() suporteMedicoDto: { observacoesMedicas: string },
    @CurrentUser() usuarioLogado: any,
  ) {
    return this.enfermagemService.adicionarSuporteMedicoTriagem(
      triagemId,
      suporteMedicoDto,
      usuarioLogado,
    );
  }
}

/*
   __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
