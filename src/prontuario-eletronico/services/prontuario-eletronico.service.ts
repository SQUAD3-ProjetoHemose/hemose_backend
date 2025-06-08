/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prontuario } from '../../users/entities/prontuario.entity';
import { HistoricoClinico } from '../entities/historico-clinico.entity';
import { AnotacaoMedica } from '../entities/anotacao-medica.entity';
import { Exame } from '../entities/exame.entity';
import { EvolucaoPaciente } from '../entities/evolucao-paciente.entity';
import { SinaisVitais } from '../entities/sinais-vitais.entity';

// Serviço responsável por toda a lógica do prontuário eletrônico
@Injectable()
export class ProntuarioEletronicoService {
  constructor(
    @InjectRepository(Prontuario)
    private prontuarioRepository: Repository<Prontuario>,
    @InjectRepository(HistoricoClinico)
    private historicoRepository: Repository<HistoricoClinico>,
    @InjectRepository(AnotacaoMedica)
    private anotacaoRepository: Repository<AnotacaoMedica>,
    @InjectRepository(Exame)
    private exameRepository: Repository<Exame>,
    @InjectRepository(EvolucaoPaciente)
    private evolucaoRepository: Repository<EvolucaoPaciente>,
    @InjectRepository(SinaisVitais)
    private sinaisVitaisRepository: Repository<SinaisVitais>,
  ) {}

  // Buscar prontuário completo do paciente
  async getProntuarioCompleto(pacienteId: number) {
    const prontuario = await this.prontuarioRepository.findOne({
      where: { paciente: { id: pacienteId } },
      relations: ['paciente', 'medico'],
    });

    if (!prontuario) {
      throw new NotFoundException(
        `Prontuário do paciente #${pacienteId} não encontrado`,
      );
    }

    // Buscar dados relacionados
    const [historico, anotacoes, exames, evolucoes, sinaisVitais] =
      await Promise.all([
        this.getHistoricoClinico(pacienteId),
        this.getAnotacoesMedicas(pacienteId),
        this.getExamesPaciente(pacienteId),
        this.getEvolucaoPaciente(pacienteId),
        this.getSinaisVitais(pacienteId),
      ]);

    return {
      prontuario,
      historicoClinico: historico,
      anotacoesMedicas: anotacoes,
      exames,
      evolucoes,
      sinaisVitais,
    };
  }

  // Criar nova anotação médica
  async criarAnotacaoMedica(createAnotacaoDto: any, medicoId: number) {
    const anotacao = this.anotacaoRepository.create({
      ...createAnotacaoDto,
      medicoId: medicoId,
    });

    return await this.anotacaoRepository.save(anotacao);
  }

  // Buscar anotações médicas do paciente
  async getAnotacoesMedicas(pacienteId: number) {
    return await this.anotacaoRepository.find({
      where: { pacienteId: pacienteId },
      relations: ['medico', 'paciente'],
      order: { dataAnotacao: 'DESC' },
    });
  }

  // Atualizar anotação médica
  async atualizarAnotacao(
    id: number,
    updateAnotacaoDto: any,
    medicoId: number,
  ) {
    const anotacao = await this.anotacaoRepository.findOne({
      where: { id },
      relations: ['medico'],
    });

    if (!anotacao) {
      throw new NotFoundException(`Anotação #${id} não encontrada`);
    }

    // Verificar se o médico é o autor da anotação
    if (anotacao.medicoId !== medicoId) {
      throw new ForbiddenException(
        'Você só pode editar suas próprias anotações',
      );
    }

    Object.assign(anotacao, updateAnotacaoDto);
    return await this.anotacaoRepository.save(anotacao);
  }

  // Registrar histórico clínico
  async registrarHistoricoClinico(createHistoricoDto: any, medicoId: number) {
    const historico = this.historicoRepository.create({
      ...createHistoricoDto,
      medicoId: medicoId,
    });

    return await this.historicoRepository.save(historico);
  }

  // Buscar histórico clínico do paciente
  async getHistoricoClinico(pacienteId: number) {
    return await this.historicoRepository.find({
      where: { pacienteId: pacienteId },
      relations: ['medico', 'paciente'],
      order: { dataRegistro: 'DESC' },
    });
  }

  // Registrar sinais vitais
  async registrarSinaisVitais(createSinaisDto: any, profissionalId: number) {
    const sinais = this.sinaisVitaisRepository.create({
      ...createSinaisDto,
      profissionalId: profissionalId,
    });

    return await this.sinaisVitaisRepository.save(sinais);
  }

  // Buscar sinais vitais do paciente
  async getSinaisVitais(pacienteId: number, dataInicio?: Date, dataFim?: Date) {
    const query = this.sinaisVitaisRepository
      .createQueryBuilder('sinais')
      .leftJoinAndSelect('sinais.profissional', 'profissional')
      .leftJoinAndSelect('sinais.paciente', 'paciente')
      .where('sinais.pacienteId = :pacienteId', { pacienteId });

    if (dataInicio && dataFim) {
      query.andWhere('sinais.dataRegistro BETWEEN :dataInicio AND :dataFim', {
        dataInicio,
        dataFim,
      });
    }

    return await query.orderBy('sinais.dataRegistro', 'DESC').getMany();
  }

  // Registrar evolução do paciente
  async registrarEvolucao(createEvolucaoDto: any, profissionalId: number) {
    const evolucao = this.evolucaoRepository.create({
      ...createEvolucaoDto,
      profissionalId: profissionalId,
    });

    return await this.evolucaoRepository.save(evolucao);
  }

  // Buscar evolução do paciente
  async getEvolucaoPaciente(pacienteId: number) {
    return await this.evolucaoRepository.find({
      where: { pacienteId: pacienteId },
      relations: ['profissional', 'paciente'],
      order: { dataEvolucao: 'DESC' },
    });
  }

  // Registrar novo exame
  async registrarExame(createExameDto: any, medicoId: number) {
    const exame = this.exameRepository.create({
      ...createExameDto,
      medicoSolicitanteId: medicoId,
    });

    return await this.exameRepository.save(exame);
  }

  // Buscar exames do paciente
  async getExamesPaciente(pacienteId: number) {
    return await this.exameRepository.find({
      where: { pacienteId: pacienteId },
      relations: ['medicoSolicitante', 'paciente'],
      order: { dataSolicitacao: 'DESC' },
    });
  }

  // Atualizar resultado do exame
  async atualizarResultadoExame(
    id: number,
    updateResultadoDto: any,
    profissionalId: number,
  ) {
    const exame = await this.exameRepository.findOne({
      where: { id },
    });

    if (!exame) {
      throw new NotFoundException(`Exame #${id} não encontrado`);
    }

    Object.assign(exame, {
      ...updateResultadoDto,
      dataResultado: new Date(),
      profissionalResultadoId: profissionalId,
    });

    return await this.exameRepository.save(exame);
  }

  // Buscar timeline completa do paciente
  async getTimelinePaciente(pacienteId: number) {
    // Combinar todos os eventos do paciente em uma timeline cronológica
    const [anotacoes, evolucoes, exames, sinaisVitais] = await Promise.all([
      this.getAnotacoesMedicas(pacienteId),
      this.getEvolucaoPaciente(pacienteId),
      this.getExamesPaciente(pacienteId),
      this.getSinaisVitais(pacienteId),
    ]);

    const timeline = [
      ...anotacoes.map((item) => ({
        ...item,
        tipo: 'anotacao',
        data: item.dataAnotacao,
      })),
      ...evolucoes.map((item) => ({
        ...item,
        tipo: 'evolucao',
        data: item.dataEvolucao,
      })),
      ...exames.map((item) => ({
        ...item,
        tipo: 'exame',
        data: item.dataSolicitacao,
      })),
      ...sinaisVitais.map((item) => ({
        ...item,
        tipo: 'sinais_vitais',
        data: item.dataRegistro,
      })),
    ];

    // Ordenar por data decrescente
    return timeline.sort(
      (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime(),
    );
  }

  // Gerar relatório do prontuário
  async gerarRelatorioProntuario(pacienteId: number) {
    const prontuarioCompleto = await this.getProntuarioCompleto(pacienteId);

    return {
      paciente: prontuarioCompleto.prontuario.paciente,
      resumo: {
        totalAnotacoes: prontuarioCompleto.anotacoesMedicas.length,
        totalEvolucoes: prontuarioCompleto.evolucoes.length,
        totalExames: prontuarioCompleto.exames.length,
        ultimaConsulta: prontuarioCompleto.anotacoesMedicas[0]?.dataAnotacao,
        ultimaEvolucao: prontuarioCompleto.evolucoes[0]?.dataEvolucao,
      },
      dados: prontuarioCompleto,
      dataGeracao: new Date(),
    };
  }

  // Buscar atendimentos recentes do profissional
  async getAtendimentosRecentes(profissionalId: number) {
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - 7); // Últimos 7 dias

    const anotacoesRecentes = await this.anotacaoRepository
      .createQueryBuilder('anotacao')
      .leftJoinAndSelect('anotacao.paciente', 'paciente')
      .where('anotacao.medicoId = :profissionalId', { profissionalId })
      .andWhere('anotacao.dataAnotacao >= :dataLimite', { dataLimite })
      .orderBy('anotacao.dataAnotacao', 'DESC')
      .take(10)
      .getMany();

    return anotacoesRecentes.map((anotacao) => ({
      paciente: anotacao.paciente,
      ultimoAtendimento: anotacao.dataAnotacao,
      tipo: 'consulta',
    }));
  }

  // Deletar anotação médica
  async deletarAnotacao(id: number, medicoId: number) {
    const anotacao = await this.anotacaoRepository.findOne({
      where: { id },
    });

    if (!anotacao) {
      throw new NotFoundException(`Anotação #${id} não encontrada`);
    }

    // Verificar se o médico é o autor da anotação
    if (anotacao.medicoId !== medicoId) {
      throw new ForbiddenException(
        'Você só pode deletar suas próprias anotações',
      );
    }

    await this.anotacaoRepository.remove(anotacao);
    return { message: 'Anotação deletada com sucesso' };
  }

  // Buscar estatísticas do prontuário
  async getEstatisticasProntuario(pacienteId: number) {
    const [totalAnotacoes, totalEvolucoes, totalExames, totalSinaisVitais] =
      await Promise.all([
        this.anotacaoRepository.count({ where: { pacienteId: pacienteId } }),
        this.evolucaoRepository.count({ where: { pacienteId: pacienteId } }),
        this.exameRepository.count({ where: { pacienteId: pacienteId } }),
        this.sinaisVitaisRepository.count({
          where: { pacienteId: pacienteId },
        }),
      ]);

    return {
      totalAnotacoes,
      totalEvolucoes,
      totalExames,
      totalSinaisVitais,
      totalRegistros:
        totalAnotacoes + totalEvolucoes + totalExames + totalSinaisVitais,
    };
  }
}

/* 
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
