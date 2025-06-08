import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ProntuarioEletronicoService } from '../services/prontuario-eletronico.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/enums/user-role.enum';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';

// Controller responsável pelo gerenciamento do prontuário eletrônico
@Controller('prontuario-eletronico')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProntuarioEletronicoController {
  constructor(
    private readonly prontuarioService: ProntuarioEletronicoService,
  ) {}

  // Buscar prontuário completo do paciente
  @Get('paciente/:pacienteId')
  @Roles(UserRole.ADMIN, UserRole.MEDICO, UserRole.ENFERMEIRA)
  async getProntuarioCompleto(
    @Param('pacienteId', ParseIntPipe) pacienteId: number,
  ) {
    return await this.prontuarioService.getProntuarioCompleto(pacienteId);
  }

  // Criar nova anotação médica
  @Post('anotacao-medica')
  @Roles(UserRole.MEDICO)
  async criarAnotacaoMedica(
    @Body() createAnotacaoDto: any,
    @CurrentUser() user: User,
  ) {
    return await this.prontuarioService.criarAnotacaoMedica(
      createAnotacaoDto,
      user.id,
    );
  }

  // Buscar anotações médicas do paciente
  @Get('anotacoes/:pacienteId')
  @Roles(UserRole.ADMIN, UserRole.MEDICO, UserRole.ENFERMEIRA)
  async getAnotacoesMedicas(
    @Param('pacienteId', ParseIntPipe) pacienteId: number,
  ) {
    return await this.prontuarioService.getAnotacoesMedicas(pacienteId);
  }

  // Atualizar anotação médica
  @Patch('anotacao/:id')
  @Roles(UserRole.MEDICO)
  async atualizarAnotacao(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAnotacaoDto: any,
    @CurrentUser() user: User,
  ) {
    return await this.prontuarioService.atualizarAnotacao(
      id,
      updateAnotacaoDto,
      user.id,
    );
  }

  // Registrar histórico clínico
  @Post('historico-clinico')
  @Roles(UserRole.MEDICO)
  async registrarHistoricoClinico(
    @Body() createHistoricoDto: any,
    @CurrentUser() user: User,
  ) {
    return await this.prontuarioService.registrarHistoricoClinico(
      createHistoricoDto,
      user.id,
    );
  }

  // Buscar histórico clínico do paciente
  @Get('historico/:pacienteId')
  @Roles(UserRole.ADMIN, UserRole.MEDICO, UserRole.ENFERMEIRA)
  async getHistoricoClinico(
    @Param('pacienteId', ParseIntPipe) pacienteId: number,
  ) {
    return await this.prontuarioService.getHistoricoClinico(pacienteId);
  }

  // Registrar sinais vitais
  @Post('sinais-vitais')
  @Roles(UserRole.MEDICO, UserRole.ENFERMEIRA)
  async registrarSinaisVitais(
    @Body() createSinaisDto: any,
    @CurrentUser() user: User,
  ) {
    return await this.prontuarioService.registrarSinaisVitais(
      createSinaisDto,
      user.id,
    );
  }

  // Buscar sinais vitais do paciente
  @Get('sinais-vitais/:pacienteId')
  @Roles(UserRole.ADMIN, UserRole.MEDICO, UserRole.ENFERMEIRA)
  async getSinaisVitais(
    @Param('pacienteId', ParseIntPipe) pacienteId: number,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
  ) {
    return await this.prontuarioService.getSinaisVitais(
      pacienteId,
      dataInicio ? new Date(dataInicio) : undefined,
      dataFim ? new Date(dataFim) : undefined,
    );
  }

  // Registrar evolução do paciente
  @Post('evolucao')
  @Roles(UserRole.MEDICO, UserRole.ENFERMEIRA)
  async registrarEvolucao(
    @Body() createEvolucaoDto: any,
    @CurrentUser() user: User,
  ) {
    return await this.prontuarioService.registrarEvolucao(
      createEvolucaoDto,
      user.id,
    );
  }

  // Buscar evolução do paciente
  @Get('evolucao/:pacienteId')
  @Roles(UserRole.ADMIN, UserRole.MEDICO, UserRole.ENFERMEIRA)
  async getEvolucaoPaciente(
    @Param('pacienteId', ParseIntPipe) pacienteId: number,
  ) {
    return await this.prontuarioService.getEvolucaoPaciente(pacienteId);
  }

  // Registrar novo exame
  @Post('exame')
  @Roles(UserRole.MEDICO)
  async registrarExame(@Body() createExameDto: any, @CurrentUser() user: User) {
    return await this.prontuarioService.registrarExame(createExameDto, user.id);
  }

  // Buscar exames do paciente
  @Get('exames/:pacienteId')
  @Roles(UserRole.ADMIN, UserRole.MEDICO, UserRole.ENFERMEIRA)
  async getExamesPaciente(
    @Param('pacienteId', ParseIntPipe) pacienteId: number,
  ) {
    return await this.prontuarioService.getExamesPaciente(pacienteId);
  }

  // Atualizar resultado do exame
  @Patch('exame/:id/resultado')
  @Roles(UserRole.MEDICO, UserRole.ENFERMEIRA)
  async atualizarResultadoExame(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateResultadoDto: any,
    @CurrentUser() user: User,
  ) {
    return await this.prontuarioService.atualizarResultadoExame(
      id,
      updateResultadoDto,
      user.id,
    );
  }

  // Buscar timeline completa do paciente
  @Get('timeline/:pacienteId')
  @Roles(UserRole.ADMIN, UserRole.MEDICO, UserRole.ENFERMEIRA)
  async getTimelinePaciente(
    @Param('pacienteId', ParseIntPipe) pacienteId: number,
  ) {
    return await this.prontuarioService.getTimelinePaciente(pacienteId);
  }

  // Gerar relatório do prontuário
  @Get('relatorio/:pacienteId')
  @Roles(UserRole.ADMIN, UserRole.MEDICO)
  async gerarRelatorioProntuario(
    @Param('pacienteId', ParseIntPipe) pacienteId: number,
  ) {
    return await this.prontuarioService.gerarRelatorioProntuario(pacienteId);
  }

  // Buscar atendimentos recentes
  @Get('atendimentos-recentes')
  @Roles(UserRole.ADMIN, UserRole.MEDICO, UserRole.ENFERMEIRA)
  async getAtendimentosRecentes(@CurrentUser() user: User) {
    return await this.prontuarioService.getAtendimentosRecentes(user.id);
  }

  // Deletar anotação médica
  @Delete('anotacao/:id')
  @Roles(UserRole.MEDICO, UserRole.ADMIN)
  async deletarAnotacao(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return await this.prontuarioService.deletarAnotacao(id, user.id);
  }
}

/* 
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
