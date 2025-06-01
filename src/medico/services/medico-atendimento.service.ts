import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agendamento } from '../../agendamentos/entities/agendamento.entity';
import { FilaEsperaService } from './fila-espera.service';
import { AnotacaoMedica } from '../../prontuario-eletronico/entities/anotacao-medica.entity';
import { SinaisVitais } from '../../prontuario-eletronico/entities/sinais-vitais.entity';

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
    let agendamento = await this.agendamentoRepository.findOne({
      where: {
        paciente_id: pacienteId,
        medico_id: medicoId,
        data: hoje.toISOString().split('T')[0] as any,
      },
    });

    if (!agendamento) {
      agendamento = this.agendamentoRepository.create({
        paciente_id: pacienteId,
        medico_id: medicoId,
        data: new Date(),
        horario: new Date().toTimeString().slice(0, 8),
        tipo: 'CONSULTA' as any,
        status: 'EM_ATENDIMENTO' as any,
        observacoes: 'Atendimento iniciado via fila de espera',
      });
    } else {
      agendamento.status = 'EM_ATENDIMENTO' as any;
    }

    return await this.agendamentoRepository.save(agendamento);
  }

  // Finalizar atendimento
  async finalizarAtendimento(atendimentoId: number, dados: any, medicoId: number) {
    const agendamento = await this.agendamentoRepository.findOne({
      where: { id: atendimentoId, medico_id: medicoId },
    });

    if (!agendamento) {
      throw new Error('Atendimento não encontrado');
    }

    // Atualizar status do agendamento
    agendamento.status = 'REALIZADO' as any;
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
        data: sinais.created_at,
        pressaoSistolica: sinais.pressaoSistolica,
        pressaoDiastolica: sinais.pressaoDiastolica,
        frequenciaCardiaca: sinais.frequenciaCardiaca,
        temperatura: sinais.temperatura,
        saturacaoOxigenio: sinais.saturacaoOxigenio,
      })),
    };
  }
}

/*
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
