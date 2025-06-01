import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Agendamento, StatusAgendamento } from '../../agendamentos/entities/agendamento.entity';
import { FilaEspera } from '../entities/fila-espera.entity';
import { Atestado } from '../entities/atestado.entity';
import { Prescricao } from '../entities/prescricao.entity';

@Injectable()
export class MedicoDashboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    
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
    const dataHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()); // Converte para Date
    const horaAtual = hoje.toTimeString().split(' ')[0].substring(0, 5); // Formato HH:MM
    
    // Criar data limite para próximas 3 horas
    const proximasHoras = new Date(Date.now() + 3 * 60 * 60 * 1000);
    const horaLimite = proximasHoras.toTimeString().split(' ')[0].substring(0, 5);

    // Buscar estatísticas do médico
    const [
      consultasHoje,
      consultasRealizadas,
      filaEspera,
      proximosAgendamentos,
      atestadosEmitidos,
      prescricoesEmitidas
    ] = await Promise.all([
      // Total de consultas agendadas para hoje
      this.agendamentoRepository.count({
        where: {
          medico_id: medicoId,
          data: dataHoje,
        },
      }),

      // Consultas já realizadas hoje
      this.agendamentoRepository.count({
        where: {
          medico_id: medicoId,
          data: dataHoje,
          status: StatusAgendamento.REALIZADO,
        },
      }),

      // Pacientes na fila de espera
      this.filaEsperaRepository.count({
        where: { status: 'aguardando' },
      }),

      // Próximos agendamentos (próximas 3 horas)
      this.agendamentoRepository.find({
        where: {
          medico_id: medicoId,
          data: dataHoje,
          status: StatusAgendamento.CONFIRMADO,
          horario: Between(horaAtual, horaLimite),
        },
        relations: ['paciente'],
        order: { horario: 'ASC' },
        take: 5,
      }),

      // Atestados emitidos este mês
      this.atestadoRepository.count({
        where: {
          medicoId,
          dataEmissao: MoreThanOrEqual(new Date(hoje.getFullYear(), hoje.getMonth(), 1)),
        },
      }),

      // Prescrições emitidas este mês
      this.prescricaoRepository.count({
        where: {
          medicoId,
          dataEmissao: MoreThanOrEqual(new Date(hoje.getFullYear(), hoje.getMonth(), 1)),
        },
      }),
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
      proximosAgendamentos: proximosAgendamentos.map(agendamento => ({
        id: agendamento.id,
        pacienteNome: agendamento.paciente?.nome,
        horario: `${agendamento.data} ${agendamento.horario}`,
        tipo: agendamento.tipo || 'Consulta',
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

    // Buscar dados estatísticos
    const [
      totalConsultas,
      consultasRealizadas,
      consultasCanceladas,
      atestadosEmitidos,
      prescricoesEmitidas,
      pacientesAtendidos
    ] = await Promise.all([
      this.agendamentoRepository.count({
        where: {
          medico_id: medicoId,
          data: MoreThanOrEqual(dataInicio),
        },
      }),

      this.agendamentoRepository.count({
        where: {
          medico_id: medicoId,
          data: MoreThanOrEqual(dataInicio),
          status: StatusAgendamento.REALIZADO,
        },
      }),

      this.agendamentoRepository.count({
        where: {
          medico_id: medicoId,
          data: MoreThanOrEqual(dataInicio),
          status: StatusAgendamento.CANCELADO,
        },
      }),

      this.atestadoRepository.count({
        where: {
          medicoId,
          dataEmissao: MoreThanOrEqual(dataInicio),
        },
      }),

      this.prescricaoRepository.count({
        where: {
          medicoId,
          dataEmissao: MoreThanOrEqual(dataInicio),
        },
      }),

      // Pacientes únicos atendidos
      this.agendamentoRepository
        .createQueryBuilder('agendamento')
        .select('COUNT(DISTINCT agendamento.paciente_id)', 'count')
        .where('agendamento.medico_id = :medicoId', { medicoId })
        .andWhere('agendamento.data >= :dataInicio', { dataInicio })
        .andWhere('agendamento.status = :status', { status: StatusAgendamento.REALIZADO })
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
        pacientesAtendidos: parseInt(pacientesAtendidos?.count || '0'),
        taxaRealizacao: totalConsultas > 0 ? (consultasRealizadas / totalConsultas) * 100 : 0,
      },
    };
  }
}

/* 
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
