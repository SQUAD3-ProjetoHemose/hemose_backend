/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Agendamento,
  StatusAgendamento,
} from '../agendamentos/entities/agendamento.entity';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/enums/user-role.enum';
import { Paciente } from '../users/paciente/entities/paciente.entity';

// Interface para definir o tipo dos dados do agendamento
interface AgendamentoSeedData {
  data: string;
  hora: string;
  status: StatusAgendamento;
  observacoes: string;
  medico: User;
  paciente: Paciente;
}

@Injectable()
export class AgendamentosSeedService {
  private readonly logger = new Logger(AgendamentosSeedService.name);

  constructor(
    @InjectRepository(Agendamento)
    private agendamentosRepository: Repository<Agendamento>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Paciente)
    private pacientesRepository: Repository<Paciente>,
  ) {}

  async seed() {
    this.logger.log('🔄 Verificando e criando agendamentos de exemplo...');

    const medicos = await this.usersRepository.find({
      where: { tipo: UserRole.MEDICO },
    });

    const pacientes = await this.pacientesRepository.find();

    if (medicos.length === 0) {
      this.logger.warn('⚠️  Nenhum médico encontrado para criar agendamentos');
      return;
    }

    if (pacientes.length === 0) {
      this.logger.warn(
        '⚠️  Nenhum paciente encontrado para criar agendamentos',
      );
      return;
    }

    this.logger.log(
      `📊 Médicos disponíveis: ${medicos.length}, Pacientes disponíveis: ${pacientes.length}`,
    );

    // Criar agendamentos variados - passado, presente e futuro
    const hoje = new Date();

    // Definir agendamentos baseados na quantidade disponível de médicos e pacientes
    const agendamentosExemplo = this.criarAgendamentosExemplo(
      hoje,
      medicos,
      pacientes,
    );

    let created = 0;
    for (const agendamentoData of agendamentosExemplo) {
      try {
        const exists = await this.agendamentosRepository.findOne({
          where: {
            data: agendamentoData.data,
            hora: agendamentoData.hora,
            medico: { id: agendamentoData.medico.id },
            paciente: { id: agendamentoData.paciente.id },
          },
        });

        if (!exists) {
          const agendamento = this.agendamentosRepository.create({
            data: agendamentoData.data,
            hora: agendamentoData.hora,
            status: agendamentoData.status,
            observacoes: agendamentoData.observacoes,
            medico_id: agendamentoData.medico.id,
            paciente_id: agendamentoData.paciente.id,
          });
          await this.agendamentosRepository.save(agendamento);
          created++;
        }
      } catch (error) {
        this.logger.error(
          `❌ Erro ao criar agendamento: ${
            error instanceof Error ? error.message : 'Erro desconhecido'
          }`,
        );
      }
    }

    this.logger.log(`✅ Criados ${created} agendamentos de exemplo!`);
  }

  /**
   * Criar lista de agendamentos baseada nos médicos e pacientes disponíveis
   */
  private criarAgendamentosExemplo(
    hoje: Date,
    medicos: User[],
    pacientes: Paciente[],
  ): AgendamentoSeedData[] {
    const agendamentos: AgendamentoSeedData[] = [];

    // Garantir que temos pelo menos 1 médico e 1 paciente
    const numMedicos = medicos.length;
    const numPacientes = pacientes.length;

    if (numMedicos === 0 || numPacientes === 0) {
      return agendamentos;
    }

    // Função auxiliar para obter médico e paciente de forma segura
    const getMedico = (index: number) => medicos[index % numMedicos];
    const getPaciente = (index: number) => pacientes[index % numPacientes];

    // Agendamentos passados
    agendamentos.push({
      data: this.formatarData(
        new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000),
      ), // 7 dias atrás
      hora: '09:00',
      status: StatusAgendamento.REALIZADO,
      observacoes: 'Consulta de rotina realizada com sucesso',
      medico: getMedico(0),
      paciente: getPaciente(0),
    });

    agendamentos.push({
      data: this.formatarData(
        new Date(hoje.getTime() - 5 * 24 * 60 * 60 * 1000),
      ), // 5 dias atrás
      hora: '14:30',
      status: StatusAgendamento.REALIZADO,
      observacoes: 'Acompanhamento hemoterapia',
      medico: getMedico(1),
      paciente: getPaciente(1),
    });

    agendamentos.push({
      data: this.formatarData(
        new Date(hoje.getTime() - 3 * 24 * 60 * 60 * 1000),
      ), // 3 dias atrás
      hora: '10:15',
      status: StatusAgendamento.CANCELADO,
      observacoes: 'Paciente cancelou por motivos pessoais',
      medico: getMedico(0),
      paciente: getPaciente(2),
    });

    // Agendamentos de hoje
    agendamentos.push({
      data: this.formatarData(hoje),
      hora: '08:00',
      status: StatusAgendamento.CONFIRMADO,
      observacoes: 'Primeira consulta',
      medico: getMedico(2),
      paciente: getPaciente(3),
    });

    agendamentos.push({
      data: this.formatarData(hoje),
      hora: '15:00',
      status: StatusAgendamento.AGUARDANDO,
      observacoes: 'Retorno para avaliação de exames',
      medico: getMedico(1),
      paciente: getPaciente(0),
    });

    // Agendamentos futuros
    agendamentos.push({
      data: this.formatarData(
        new Date(hoje.getTime() + 1 * 24 * 60 * 60 * 1000),
      ), // Amanhã
      hora: '09:30',
      status: StatusAgendamento.AGENDADO,
      observacoes: 'Consulta de acompanhamento',
      medico: getMedico(0),
      paciente: getPaciente(4),
    });

    agendamentos.push({
      data: this.formatarData(
        new Date(hoje.getTime() + 3 * 24 * 60 * 60 * 1000),
      ), // Em 3 dias
      hora: '11:00',
      status: StatusAgendamento.AGENDADO,
      observacoes: 'Avaliação pré-operatória',
      medico: getMedico(3),
      paciente: getPaciente(5),
    });

    agendamentos.push({
      data: this.formatarData(
        new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000),
      ), // Em 1 semana
      hora: '16:30',
      status: StatusAgendamento.AGENDADO,
      observacoes: 'Consulta especializada em oncologia',
      medico: getMedico(1),
      paciente: getPaciente(2),
    });

    return agendamentos;
  }

  /**
   * Corrigir agendamentos existentes que não possuem campo hora
   */
  private async corrigirAgendamentosExistentes() {
    try {
      const agendamentosSemHora = await this.agendamentosRepository.find({
        where: { hora: null as any },
      });

      for (const agendamento of agendamentosSemHora) {
        // Definir hora padrão baseada no horário de criação ou hora fixa
        const horaDefault = agendamento.created_at
          ? agendamento.created_at.toTimeString().split(' ')[0].substring(0, 5)
          : '08:00';

        agendamento.hora = horaDefault;
        await this.agendamentosRepository.save(agendamento);
      }

      if (agendamentosSemHora.length > 0) {
        this.logger.log(
          `🔧 Corrigidos ${agendamentosSemHora.length} agendamentos sem hora`,
        );
      }
    } catch (error) {
      this.logger.warn(
        '⚠️  Não foi possível corrigir agendamentos existentes:',
        error,
      );
    }
  }

  /**
   * Formatar data para string no formato YYYY-MM-DD
   */
  private formatarData(data: Date): string {
    return data.toISOString().split('T')[0];
  }
}

/*             
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
