import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, Logger } from '@nestjs/common';
import { AgendamentoService } from '../services/agendamento.service';
import { CreateAgendamentoDto } from '../dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from '../dto/update-agendamento.dto';
import { StatusAgendamento } from '../entities/agendamento.entity';

@Controller('agendamentos')
export class AgendamentoController {
  private readonly logger = new Logger(AgendamentoController.name);

  constructor(private readonly agendamentoService: AgendamentoService) {}

  @Post()
  create(@Body() createAgendamentoDto: CreateAgendamentoDto) {
    this.logger.log('Criando novo agendamento:', createAgendamentoDto);
    return this.agendamentoService.create(createAgendamentoDto);
  }

  @Get()
  findAll(
    @Query('data') data?: string,
    @Query('medico_id') medico_id?: string,
    @Query('paciente_id') paciente_id?: string,
    @Query('status') status?: StatusAgendamento,
  ) {
    this.logger.log(`Buscando agendamentos com filtros: data=${data}, medico_id=${medico_id}, paciente_id=${paciente_id}, status=${status}`);
    
    // Converter string de data para objeto Date se fornecida
    const dataObj = data ? new Date(data) : undefined;
    const medicoIdNum = medico_id ? parseInt(medico_id, 10) : undefined;
    const pacienteIdNum = paciente_id ? parseInt(paciente_id, 10) : undefined;
    
    return this.agendamentoService.findAll(dataObj, medicoIdNum, pacienteIdNum, status);
  }

  @Get('today')
  findToday() {
    this.logger.log('Buscando agendamentos de hoje');
    return this.agendamentoService.findToday();
  }

  @Get('by-date/:data')
  findByDate(@Param('data') data: string) {
    this.logger.log(`Buscando agendamentos por data: ${data}`);
    const dataObj = new Date(data);
    return this.agendamentoService.findByDate(dataObj);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`Buscando agendamento ID: ${id}`);
    return this.agendamentoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAgendamentoDto: UpdateAgendamentoDto,
  ) {
    this.logger.log(`Atualizando agendamento ID: ${id}`, updateAgendamentoDto);
    return this.agendamentoService.update(id, updateAgendamentoDto);
  }

  @Patch(':id/confirmar')
  confirmar(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`Confirmando agendamento ID: ${id}`);
    return this.agendamentoService.confirmar(id);
  }

  @Patch(':id/cancelar')
  cancelar(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`Cancelando agendamento ID: ${id}`);
    return this.agendamentoService.cancelar(id);
  }

  @Patch(':id/realizar')
  realizarAtendimento(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`Realizando atendimento para agendamento ID: ${id}`);
    return this.agendamentoService.realizarAtendimento(id);
  }

  @Patch(':id/falta')
  registrarFalta(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`Registrando falta para agendamento ID: ${id}`);
    return this.agendamentoService.registrarFalta(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`Removendo agendamento ID: ${id}`);
    return this.agendamentoService.remove(id);
  }
}
            
/*             
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
