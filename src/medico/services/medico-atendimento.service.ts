/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Agendamento,
  StatusAgendamento,
  TipoAgendamento,
} from '../../agendamentos/entities/agendamento.entity';
import { AnotacaoMedica } from '../../prontuario-eletronico/entities/anotacao-medica.entity';
import { SinaisVitais } from '../../prontuario-eletronico/entities/sinais-vitais.entity';
import { FilaEsperaService } from './fila-espera.service';

@Injectable()
export class MedicoAtendimentoService {
  constructor(
    @InjectRepository(Agendamento)
    private readonly agendamentoRepository: Repository<Agendamento>,

    @InjectRepository(AnotacaoMedica)
    private readonly anotacaoRepository: Repository<AnotacaoMedica>,

    @InjectRepository(SinaisVitais)
    private readonly sinaisVitaisRepository: Repository<SinaisVitais>,

    private readonly filaEsperaService: FilaEsperaService,
  ) {}

  // Iniciar atendimento de um paciente
  async iniciarAtendimento(pacienteId: number, medicoId: number) {
    // Remover paciente da fila de espera
    await this.filaEsperaService.iniciarAtendimento(pacienteId, medicoId);

    // Criar ou atualizar agendamento para hoje
    const hoje = new Date();
    const dataHojeString = hoje.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    const horaAtualString = hoje.toTimeString().split(' ')[0].substring(0, 5); // Formato HH:MM

    let agendamento = await this.agendamentoRepository.findOne({
      where: {
        paciente_id: pacienteId,
        medico_id: medicoId,
        data: dataHojeString,
      },
    });

    if (!agendamento) {
      agendamento = this.agendamentoRepository.create({
        paciente_id: pacienteId,
        medico_id: medicoId,
        data: dataHojeString, // String no formato YYYY-MM-DD
        hora: horaAtualString, // String no formato HH:MM
        tipo: TipoAgendamento.CONSULTA,
        status: StatusAgendamento.CONFIRMADO, // Usar status válido
        observacoes: 'Atendimento iniciado via fila de espera',
      });
    } else {
      agendamento.status = StatusAgendamento.CONFIRMADO;
    }

    return await this.agendamentoRepository.save(agendamento);
  }

  // Finalizar atendimento
  async finalizarAtendimento(
    atendimentoId: number,
    dados: any,
    medicoId: number,
  ) {
    const agendamento = await this.agendamentoRepository.findOne({
      where: { id: atendimentoId, medico_id: medicoId },
    });

    if (!agendamento) {
      throw new Error('Atendimento não encontrado');
    }

    // Atualizar status do agendamento
    agendamento.status = StatusAgendamento.REALIZADO;
    agendamento.observacoes = dados.observacoes || agendamento.observacoes;

    await this.agendamentoRepository.save(agendamento);

    // Finalizar na fila de espera
    await this.filaEsperaService.finalizarAtendimento(agendamento.paciente_id);

    // Criar anotação médica se fornecida
    if (dados.anotacao) {
      const anotacao = this.anotacaoRepository.create({
        pacienteId: agendamento.paciente_id,
        medicoId,
        anotacao: dados.anotacao,
        diagnostico: dados.diagnostico,
        prescricao: dados.prescricao,
        observacoes: dados.observacoes,
        dataAnotacao: new Date(),
      });

      await this.anotacaoRepository.save(anotacao);
    }

    return {
      agendamento,
      message: 'Atendimento finalizado com sucesso',
    };
  }

  // Buscar histórico de atendimentos do paciente
  async getHistoricoAtendimentos(pacienteId: number) {
    const atendimentos = await this.agendamentoRepository.find({
      where: { paciente_id: pacienteId },
      relations: ['medico', 'paciente'],
      order: { created_at: 'DESC' },
      take: 20, // Últimos 20 atendimentos
    });

    const anotacoes = await this.anotacaoRepository.find({
      where: { pacienteId },
      relations: ['medico'],
      order: { dataAnotacao: 'DESC' },
      take: 10, // Últimas 10 anotações
    });

    const sinaisVitais = await this.sinaisVitaisRepository.find({
      where: { pacienteId },
      order: { createdAt: 'DESC' },
      take: 10, // Últimos 10 registros
    });

    return {
      atendimentos: atendimentos.map((atendimento: any) => ({
        id: atendimento.id,
        data: atendimento.data,
        hora: atendimento.hora,
        tipo: atendimento.tipo,
        status: atendimento.status,
        medico: atendimento.medico?.nome,
        observacoes: atendimento.observacoes,
      })),
      anotacoes: anotacoes.map((anotacao: any) => ({
        id: anotacao.id,
        data: anotacao.dataAnotacao,
        anotacao: anotacao.anotacao,
        diagnostico: anotacao.diagnostico,
        medico: anotacao.medico?.nome,
      })),
      sinaisVitais: sinaisVitais.map((sinais: any) => ({
        id: sinais.id,
        data: sinais.createdAt,
        pressaoArterial: sinais.pressaoArterial,
        frequenciaCardiaca: sinais.frequenciaCardiaca,
        temperatura: sinais.temperatura,
        saturacaoOxigenio: sinais.saturacaoOxigenio,
      })),
    };
  }

  // Buscar agendamentos pendentes para atendimento
  async getAgendamentosPendentes(medicoId: number) {
    const dataHoje = new Date().toISOString().split('T')[0];

    return await this.agendamentoRepository.find({
      where: {
        medico_id: medicoId,
        data: dataHoje,
        status: StatusAgendamento.CONFIRMADO,
      },
      relations: ['paciente'],
      order: { hora: 'ASC' },
    });
  }

  // Atualizar status de agendamento
  async atualizarStatusAtendimento(
    agendamentoId: number,
    novoStatus: StatusAgendamento,
    medicoId: number,
  ) {
    const agendamento = await this.agendamentoRepository.findOne({
      where: { id: agendamentoId, medico_id: medicoId },
    });

    if (!agendamento) {
      throw new Error('Agendamento não encontrado ou não pertence ao médico');
    }

    agendamento.status = novoStatus;
    return await this.agendamentoRepository.save(agendamento);
  }
}

/*
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
