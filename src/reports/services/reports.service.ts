import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, IsNull } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Paciente } from '../../users/paciente/entities/paciente.entity';
import {
  Agendamento,
  StatusAgendamento,
} from '../../agendamentos/entities/agendamento.entity';
import { Prontuario } from '../../users/entities/prontuario.entity';
import { Prescricao } from '../../users/entities/prescricao.entity';
import { Internacao } from '../../users/entities/internacao.entity';

// Serviço responsável por gerar relatórios e estatísticas
@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Paciente)
    private pacienteRepository: Repository<Paciente>,
    @InjectRepository(Agendamento)
    private agendamentoRepository: Repository<Agendamento>,
    @InjectRepository(Prontuario)
    private prontuarioRepository: Repository<Prontuario>,
    @InjectRepository(Prescricao)
    private prescricaoRepository: Repository<Prescricao>,
    @InjectRepository(Internacao)
    private internacaoRepository: Repository<Internacao>,
  ) {}

  // Dashboard principal com estatísticas gerais
  async getDashboardStats() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay()),
    );

    // Contadores gerais
    const totalPacientes = await this.pacienteRepository.count();
    const totalUsuarios = await this.userRepository.count();
    const totalProntuarios = await this.prontuarioRepository.count();

    // Agendamentos de hoje
    const todayStart = new Date(today.setHours(0, 0, 0, 0));
    const todayEnd = new Date(today.setHours(23, 59, 59, 999));
    const agendamentosHoje = await this.agendamentoRepository.count({
      where: {
        data: Between(
          todayStart.toISOString().split('T')[0],
          todayEnd.toISOString().split('T')[0],
        ),
      },
    });

    // Agendamentos desta semana
    const agendamentosSemana = await this.agendamentoRepository.count({
      where: {
        data: Between(
          startOfWeek.toISOString().split('T')[0],
          today.toISOString().split('T')[0],
        ),
      },
    });

    // Pacientes internados atualmente
    // Importa o operador IsNull do TypeORM para buscar valores nulos
    const pacientesInternados = await this.internacaoRepository.count({
      where: {
        data_saida: IsNull(), // Ainda não teve alta
      },
    });

    // Novos pacientes este mês
    const novosPacientesMes = await this.pacienteRepository.count({
      where: {
        created_at: Between(startOfMonth, today),
      },
    });

    return {
      totalPacientes,
      totalUsuarios,
      totalProntuarios,
      agendamentosHoje,
      agendamentosSemana,
      pacientesInternados,
      novosPacientesMes,
    };
  }

  // Relatório de agendamentos por período
  async getAgendamentosReport(startDate: Date, endDate: Date) {
    const agendamentos = await this.agendamentoRepository
      .createQueryBuilder('agendamento')
      .leftJoinAndSelect('agendamento.paciente', 'paciente')
      .leftJoinAndSelect('agendamento.medico', 'medico')
      .where('agendamento.data BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .orderBy('agendamento.data', 'ASC')
      .getMany();

    // Estatísticas por status
    const statusStats = await this.agendamentoRepository
      .createQueryBuilder('agendamento')
      .select('agendamento.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('agendamento.data BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .groupBy('agendamento.status')
      .getRawMany();

    // Agendamentos por médico
    const medicoStats = await this.agendamentoRepository
      .createQueryBuilder('agendamento')
      .leftJoin('agendamento.medico', 'medico')
      .select('medico.nome', 'medicoNome')
      .addSelect('COUNT(*)', 'count')
      .where('agendamento.data BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .groupBy('agendamento.medico_id')
      .orderBy('count', 'DESC')
      .getRawMany();

    return {
      agendamentos,
      estatisticas: {
        total: agendamentos.length,
        porStatus: statusStats,
        porMedico: medicoStats,
      },
    };
  }

  // Relatório de pacientes por idade e sexo
  async getPacientesReport() {
    // Distribuição por sexo
    const sexoStats = await this.pacienteRepository
      .createQueryBuilder('paciente')
      .select('paciente.sexo', 'sexo')
      .addSelect('COUNT(*)', 'count')
      .groupBy('paciente.sexo')
      .getRawMany();

    // Distribuição por faixa etária
    const idadeStats = await this.pacienteRepository
      .createQueryBuilder('paciente')
      .select(
        `CASE 
          WHEN TIMESTAMPDIFF(YEAR, paciente.data_nascimento, CURDATE()) < 18 THEN 'Menor de 18'
          WHEN TIMESTAMPDIFF(YEAR, paciente.data_nascimento, CURDATE()) BETWEEN 18 AND 30 THEN '18-30'
          WHEN TIMESTAMPDIFF(YEAR, paciente.data_nascimento, CURDATE()) BETWEEN 31 AND 50 THEN '31-50'
          WHEN TIMESTAMPDIFF(YEAR, paciente.data_nascimento, CURDATE()) BETWEEN 51 AND 70 THEN '51-70'
          ELSE 'Acima de 70'
        END`,
        'faixaEtaria',
      )
      .addSelect('COUNT(*)', 'count')
      .groupBy('faixaEtaria')
      .getRawMany();

    // Novos pacientes por mês (últimos 12 meses)
    const novosPacientes = await this.pacienteRepository
      .createQueryBuilder('paciente')
      .select("DATE_FORMAT(paciente.created_at, '%Y-%m')", 'mes')
      .addSelect('COUNT(*)', 'count')
      .where('paciente.created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)')
      .groupBy('mes')
      .orderBy('mes', 'ASC')
      .getRawMany();

    return {
      porSexo: sexoStats,
      porIdade: idadeStats,
      novosPorMes: novosPacientes,
    };
  }

  // Relatório de produtividade médica
  async getProdutividadeMedicaReport(startDate: Date, endDate: Date) {
    // Consultas realizadas por médico
    const consultasPorMedico = await this.agendamentoRepository
      .createQueryBuilder('agendamento')
      .leftJoin('agendamento.medico', 'medico')
      .select('medico.nome', 'medicoNome')
      .addSelect('medico.especialidade', 'especialidade')
      .addSelect('COUNT(*)', 'totalConsultas')
      .addSelect(
        `SUM(CASE WHEN agendamento.status = '${StatusAgendamento.REALIZADO}' THEN 1 ELSE 0 END)`,
        'consultasRealizadas',
      )
      .addSelect(
        `SUM(CASE WHEN agendamento.status = '${StatusAgendamento.CANCELADO}' THEN 1 ELSE 0 END)`,
        'consultasCanceladas',
      )
      .where('agendamento.data BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .groupBy('agendamento.medico_id')
      .orderBy('totalConsultas', 'DESC')
      .getRawMany();

    // Prescrições por médico
    const prescricoesPorMedico = await this.prescricaoRepository
      .createQueryBuilder('prescricao')
      .leftJoin('prescricao.medico', 'medico')
      .select('medico.nome', 'medicoNome')
      .addSelect('COUNT(*)', 'totalPrescricoes')
      .where('prescricao.data_prescricao BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .groupBy('prescricao.medico_id')
      .orderBy('totalPrescricoes', 'DESC')
      .getRawMany();

    return {
      consultasPorMedico,
      prescricoesPorMedico,
    };
  }

  // Relatório financeiro básico
  async getRelatorioFinanceiro(startDate: Date, endDate: Date) {
    // Consultas realizadas (para cálculo de receita)
    const consultasRealizadas = await this.agendamentoRepository.count({
      where: {
        data: Between(
          startDate.toISOString().split('T')[0],
          endDate.toISOString().split('T')[0],
        ),
        status: StatusAgendamento.REALIZADO,
      },
    });

    // Internações ativas no período
    const internacoesAtivas = await this.internacaoRepository.count({
      where: [
        {
          data_entrada: Between(startDate, endDate),
        },
        {
          data_saida: Between(startDate, endDate),
        },
      ],
    });

    // Total de procedimentos (pode ser expandido futuramente)
    const totalProcedimentos = consultasRealizadas; // Simplificado

    return {
      consultasRealizadas,
      internacoesAtivas,
      totalProcedimentos,
    };
  }

  // Exportar dados para CSV (estrutura básica)
  exportToCSV(type: string, data: Record<string, unknown>[]) {
    // Implementação básica para exportação CSV
    // Pode ser expandida com bibliotecas específicas
    if (!data.length) return '';

    const csvHeaders = Object.keys(data[0]).join(',');
    const csvRows = data.map((row) => Object.values(row).join(','));
    return [csvHeaders, ...csvRows].join('\n');
  }
}

/* 
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
