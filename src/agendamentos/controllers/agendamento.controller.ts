import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { AgendamentoService } from '../services/agendamento.service';
import { CreateAgendamentoDto } from '../dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from '../dto/update-agendamento.dto';
import { StatusAgendamento } from '../entities/agendamento.entity';

@Controller('agendamentos')
export class AgendamentoController {
  constructor(private readonly agendamentoService: AgendamentoService) {}

  @Post()
  create(@Body() createAgendamentoDto: CreateAgendamentoDto) {
    return this.agendamentoService.create(createAgendamentoDto);
  }

  @Get()
  findAll(
    @Query('data') data?: string,
    @Query('medico_id') medico_id?: number,
    @Query('paciente_id') paciente_id?: number,
    @Query('status') status?: StatusAgendamento,
  ) {
    // Converter string de data para objeto Date se fornecida
    const dataObj = data ? new Date(data) : undefined;
    
    return this.agendamentoService.findAll(dataObj, medico_id, paciente_id, status);
  }

  @Get('today')
  findToday() {
    return this.agendamentoService.findToday();
  }

  @Get('by-date/:data')
  findByDate(@Param('data') data: string) {
    const dataObj = new Date(data);
    return this.agendamentoService.findByDate(dataObj);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.agendamentoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAgendamentoDto: UpdateAgendamentoDto,
  ) {
    return this.agendamentoService.update(id, updateAgendamentoDto);
  }

  @Patch(':id/confirmar')
  confirmar(@Param('id', ParseIntPipe) id: number) {
    return this.agendamentoService.confirmar(id);
  }

  @Patch(':id/cancelar')
  cancelar(@Param('id', ParseIntPipe) id: number) {
    return this.agendamentoService.cancelar(id);
  }

  @Patch(':id/realizar')
  realizarAtendimento(@Param('id', ParseIntPipe) id: number) {
    return this.agendamentoService.realizarAtendimento(id);
  }

  @Patch(':id/falta')
  registrarFalta(@Param('id', ParseIntPipe) id: number) {
    return this.agendamentoService.registrarFalta(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.agendamentoService.remove(id);
  }
}
            
/*             
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
