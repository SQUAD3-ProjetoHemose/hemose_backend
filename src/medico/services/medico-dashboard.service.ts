/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, MoreThanOrEqual, Repository } from 'typeorm';
import {
  Agendamento,
  StatusAgendamento,
} from '../../agendamentos/entities/agendamento.entity';
import { Atestado } from '../entities/atestado.entity';
import { FilaEspera } from '../entities/fila-espera.entity';
import { Prescricao } from '../entities/prescricao.entity';

@Injectable()
export class MedicoDashboardService {
  constructor(
    @InjectRepository(Agendamento)
    private readonly agendamentoRepository: Repository<Agendamento>,

    @InjectRepository(FilaEspera)
    private readonly filaEsperaRepository: Repository<FilaEspera>,

    @InjectRepository(Atestado)
    private readonly atestadoRepository: Repository<Atestado>,

    @InjectRepository(Prescricao)
    private readonly prescricaoRepository: Repository<Prescricao>,
  ) {}

  // Obter dados do dashboard médico
  async getDashboardData(medicoId: number) {
    const hoje = new Date();
    const dataHojeString = hoje.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    const horaAtual = hoje.toTimeString().split(' ')[0].substring(0, 5); // Formato HH:MM

    // Criar hora limite para próximas 3 horas
    const proximasHoras = new Date(Date.now() + 3 * 60 * 60 * 1000);
    const horaLimite = proximasHoras
      .toTimeString()
      .split(' ')[0]
      .substring(0, 5);

    // Buscar dados do dashboard
    const [
      consultasHoje,
      consultasRealizadas,
      filaEspera,
      proximosAgendamentos,
      atestadosEmitidos,
      prescricoesEmitidas,
    ] = await Promise.all([
      // Total de consultas agendadas para hoje
      this.agendamentoRepository.count({
        where: {
          medico_id: medicoId,
          data: dataHojeString,
        },
      }),

      // Consultas já realizadas hoje
      this.agendamentoRepository.count({
        where: {
          medico_id: medicoId,
          data: dataHojeString,
          status: StatusAgendamento.REALIZADO,
        },
      }),

      // Fila de espera - verificar se existe
      this.filaEsperaRepository
        .count({
          where: { status: 'aguardando' },
        })
        .catch(() => 0), // Se não existir a tabela, retorna 0

      // Próximos agendamentos (próximas 3 horas)
      this.agendamentoRepository.find({
        where: {
          medico_id: medicoId,
          data: dataHojeString,
          status: StatusAgendamento.CONFIRMADO,
          hora: Between(horaAtual, horaLimite),
        },
        relations: ['paciente'],
        order: { hora: 'ASC' },
        take: 5,
      }),

      // Atestados emitidos este mês - verificar se existe
      this.atestadoRepository
        .count({
          where: {
            medicoId,
            dataEmissao: MoreThanOrEqual(
              new Date(hoje.getFullYear(), hoje.getMonth(), 1),
            ),
          },
        })
        .catch(() => 0), // Se não existir a tabela, retorna 0

      // Prescrições emitidas este mês - verificar se existe
      this.prescricaoRepository
        .count({
          where: {
            medicoId,
            dataEmissao: MoreThanOrEqual(
              new Date(hoje.getFullYear(), hoje.getMonth(), 1),
            ),
          },
        })
        .catch(() => 0), // Se não existir a tabela, retorna 0
    ]);

    return {
      estatisticas: {
        consultasHoje,
        consultasRealizadas,
        filaEspera,
        atestadosEmitidos,
        prescricoesEmitidas,
        proximosAgendamentos: proximosAgendamentos.length,
      },
      proximosAgendamentos: proximosAgendamentos.map((agendamento) => ({
        id: agendamento.id,
        pacienteNome: agendamento.paciente?.nome || 'Paciente não encontrado',
        horario: `${agendamento.data} ${agendamento.hora}`,
        tipo: agendamento.tipo || 'Consulta',
        status: agendamento.status,
      })),
    };
  }

  // Obter estatísticas detalhadas do médico
  async getEstatisticasMedico(medicoId: number, periodo?: string) {
    let dataInicio: Date;
    const hoje = new Date();

    // Definir período baseado no parâmetro
    switch (periodo) {
      case 'semana':
        dataInicio = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'mes':
        dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        break;
      case 'ano':
        dataInicio = new Date(hoje.getFullYear(), 0, 1);
        break;
      default:
        dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    }

    const dataInicioString = dataInicio.toISOString().split('T')[0];

    // Buscar dados estatísticos
    const [
      totalConsultas,
      consultasRealizadas,
      consultasCanceladas,
      atestadosEmitidos,
      prescricoesEmitidas,
      pacientesAtendidos,
    ] = await Promise.all([
      this.agendamentoRepository.count({
        where: {
          medico_id: medicoId,
          data: MoreThanOrEqual(dataInicioString),
        },
      }),

      this.agendamentoRepository.count({
        where: {
          medico_id: medicoId,
          data: MoreThanOrEqual(dataInicioString),
          status: StatusAgendamento.REALIZADO,
        },
      }),

      this.agendamentoRepository.count({
        where: {
          medico_id: medicoId,
          data: MoreThanOrEqual(dataInicioString),
          status: StatusAgendamento.CANCELADO,
        },
      }),

      // Atestados emitidos - com fallback
      this.atestadoRepository
        .count({
          where: {
            medicoId,
            dataEmissao: MoreThanOrEqual(dataInicio),
          },
        })
        .catch(() => 0),

      // Prescrições emitidas - com fallback
      this.prescricaoRepository
        .count({
          where: {
            medicoId,
            dataEmissao: MoreThanOrEqual(dataInicio),
          },
        })
        .catch(() => 0),

      // Pacientes únicos atendidos
      this.agendamentoRepository
        .createQueryBuilder('agendamento')
        .select('COUNT(DISTINCT agendamento.paciente_id)', 'count')
        .where('agendamento.medico_id = :medicoId', { medicoId })
        .andWhere('agendamento.data >= :dataInicio', {
          dataInicio: dataInicioString,
        })
        .andWhere('agendamento.status = :status', {
          status: StatusAgendamento.REALIZADO,
        })
        .getRawOne(),
    ]);

    return {
      periodo,
      dataInicio,
      dataFim: hoje,
      estatisticas: {
        totalConsultas,
        consultasRealizadas,
        consultasCanceladas,
        atestadosEmitidos,
        prescricoesEmitidas,
        pacientesAtendidos: parseInt(
          (pacientesAtendidos as { count: string })?.count || '0',
        ),
        taxaSucesso:
          totalConsultas > 0 ? (consultasRealizadas / totalConsultas) * 100 : 0,
      },
    };
  }

  // Obter agendamentos do dia para o médico
  async getAgendamentosDia(medicoId: number, data?: string) {
    const dataConsulta = data || new Date().toISOString().split('T')[0];

    return await this.agendamentoRepository.find({
      where: {
        medico_id: medicoId,
        data: dataConsulta,
      },
      relations: ['paciente'],
      order: { hora: 'ASC' },
    });
  }

  // Atualizar status de um agendamento
  async atualizarStatusAgendamento(
    agendamentoId: number,
    novoStatus: StatusAgendamento,
  ) {
    const agendamento = await this.agendamentoRepository.findOne({
      where: { id: agendamentoId },
    });

    if (!agendamento) {
      throw new Error('Agendamento não encontrado');
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
