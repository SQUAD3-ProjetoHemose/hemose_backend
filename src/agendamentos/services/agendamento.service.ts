/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agendamento, StatusAgendamento } from '../entities/agendamento.entity';
import { CreateAgendamentoDto } from '../dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from '../dto/update-agendamento.dto';

@Injectable()
export class AgendamentoService {
  constructor(
    @InjectRepository(Agendamento)
    private agendamentoRepository: Repository<Agendamento>,
  ) {}

  // Criar novo agendamento
  async create(
    createAgendamentoDto: CreateAgendamentoDto,
  ): Promise<Agendamento> {
    // Converter data para string no formato yyyy-MM-dd
    const agendamentoData = {
      ...createAgendamentoDto,
      data: createAgendamentoDto.data.toISOString().split('T')[0],
    };

    const agendamento = this.agendamentoRepository.create(agendamentoData);
    return await this.agendamentoRepository.save(agendamento);
  }

  // Buscar todos os agendamentos com opções de filtro
  async findAll(
    data?: Date,
    medico_id?: number,
    paciente_id?: number,
    status?: StatusAgendamento,
  ): Promise<Agendamento[]> {
    const query = this.agendamentoRepository
      .createQueryBuilder('agendamento')
      .leftJoinAndSelect('agendamento.paciente', 'paciente')
      .leftJoinAndSelect('agendamento.medico', 'medico');

    // Aplicar filtros quando fornecidos
    if (data) {
      // Converter data para string no formato yyyy-MM-dd para comparação
      const dataString = data.toISOString().split('T')[0];
      query.andWhere('agendamento.data = :data', { data: dataString });
    }

    if (medico_id) {
      query.andWhere('agendamento.medico_id = :medico_id', { medico_id });
    }

    if (paciente_id) {
      query.andWhere('agendamento.paciente_id = :paciente_id', { paciente_id });
    }

    if (status) {
      query.andWhere('agendamento.status = :status', { status });
    }

    return await query
      .orderBy('agendamento.data', 'ASC')
      .addOrderBy('agendamento.hora', 'ASC')
      .getMany();
  }

  // Buscar agendamentos de hoje
  async findToday(): Promise<Agendamento[]> {
    const today = new Date().toISOString().split('T')[0];

    return await this.agendamentoRepository
      .createQueryBuilder('agendamento')
      .leftJoinAndSelect('agendamento.paciente', 'paciente')
      .leftJoinAndSelect('agendamento.medico', 'medico')
      .where('agendamento.data = :today', { today })
      .orderBy('agendamento.hora', 'ASC')
      .getMany();
  }

  // Buscar agendamentos por data
  async findByDate(data: Date): Promise<Agendamento[]> {
    const dataString = data.toISOString().split('T')[0];

    return await this.agendamentoRepository
      .createQueryBuilder('agendamento')
      .leftJoinAndSelect('agendamento.paciente', 'paciente')
      .leftJoinAndSelect('agendamento.medico', 'medico')
      .where('agendamento.data = :data', { data: dataString })
      .orderBy('agendamento.hora', 'ASC')
      .getMany();
  }

  // Buscar um agendamento por ID
  async findOne(id: number): Promise<Agendamento> {
    const agendamento = await this.agendamentoRepository.findOne({
      where: { id },
      relations: ['paciente', 'medico'],
    });

    if (!agendamento) {
      throw new NotFoundException(`Agendamento #${id} não encontrado`);
    }

    return agendamento;
  }

  // Atualizar um agendamento
  async update(
    id: number,
    updateAgendamentoDto: UpdateAgendamentoDto,
  ): Promise<Agendamento> {
    const agendamento = await this.findOne(id);

    // Converter data para string se fornecida
    const updateData = { ...updateAgendamentoDto };
    if (updateData.data) {
      updateData.data = updateData.data.toISOString().split('T')[0] as any;
    }

    // Atualiza os campos do agendamento com os valores do DTO
    Object.assign(agendamento, updateData);

    return await this.agendamentoRepository.save(agendamento);
  }

  // Confirmar um agendamento
  async confirmar(id: number): Promise<Agendamento> {
    const agendamento = await this.findOne(id);
    agendamento.status = StatusAgendamento.CONFIRMADO;
    return await this.agendamentoRepository.save(agendamento);
  }

  // Cancelar um agendamento
  async cancelar(id: number): Promise<Agendamento> {
    const agendamento = await this.findOne(id);
    agendamento.status = StatusAgendamento.CANCELADO;
    return await this.agendamentoRepository.save(agendamento);
  }

  // Marcar como realizado
  async realizarAtendimento(id: number): Promise<Agendamento> {
    const agendamento = await this.findOne(id);
    agendamento.status = StatusAgendamento.REALIZADO;
    return await this.agendamentoRepository.save(agendamento);
  }

  // Marcar como faltou
  async registrarFalta(id: number): Promise<Agendamento> {
    const agendamento = await this.findOne(id);
    agendamento.status = StatusAgendamento.FALTOU;
    return await this.agendamentoRepository.save(agendamento);
  }

  // Remover um agendamento
  async remove(id: number): Promise<void> {
    const agendamento = await this.findOne(id);
    await this.agendamentoRepository.remove(agendamento);
  }
}

/*             
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
