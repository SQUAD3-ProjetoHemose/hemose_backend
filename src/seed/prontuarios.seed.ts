import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnotacaoMedica } from '../prontuario-eletronico/entities/anotacao-medica.entity';
import { EvolucaoPaciente } from '../prontuario-eletronico/entities/evolucao-paciente.entity';
import {
  Exame,
  StatusExame,
  TipoExame,
} from '../prontuario-eletronico/entities/exame.entity';
import { HistoricoClinico } from '../prontuario-eletronico/entities/historico-clinico.entity';
import { SinaisVitais } from '../prontuario-eletronico/entities/sinais-vitais.entity';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/enums/user-role.enum';
import { Paciente } from '../users/paciente/entities/paciente.entity';

@Injectable()
export class ProntuariosSeedService {
  private readonly logger = new Logger(ProntuariosSeedService.name);

  constructor(
    @InjectRepository(AnotacaoMedica)
    private anotacoesRepository: Repository<AnotacaoMedica>,
    @InjectRepository(HistoricoClinico)
    private historicoRepository: Repository<HistoricoClinico>,
    @InjectRepository(SinaisVitais)
    private sinaisVitaisRepository: Repository<SinaisVitais>,
    @InjectRepository(EvolucaoPaciente)
    private evolucaoRepository: Repository<EvolucaoPaciente>,
    @InjectRepository(Exame)
    private examesRepository: Repository<Exame>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Paciente)
    private pacientesRepository: Repository<Paciente>,
  ) {}

  async seed() {
    this.logger.log(
      '🔄 Verificando e criando dados de prontuários eletrônicos...',
    );

    const medicos = await this.usersRepository.find({
      where: { tipo: UserRole.MEDICO },
    });

    const enfermeiras = await this.usersRepository.find({
      where: { tipo: UserRole.ENFERMEIRA },
    });

    const pacientes = await this.pacientesRepository.find();

    if (medicos.length === 0 || pacientes.length === 0) {
      this.logger.warn('⚠️  Sem médicos ou pacientes para criar prontuários');
      return;
    }

    await this.seedHistoricoClinico(medicos, pacientes.slice(0, 3));
    await this.seedAnotacoesMedicas(medicos, pacientes.slice(0, 4));
    await this.seedSinaisVitais(
      [...medicos, ...enfermeiras],
      pacientes.slice(0, 3),
    );
    await this.seedEvolucaoPaciente(
      [...medicos, ...enfermeiras],
      pacientes.slice(0, 2),
    );
    await this.seedExames(medicos, pacientes.slice(0, 3));

    this.logger.log('✅ Dados de prontuários eletrônicos criados!');
  }

  private async seedHistoricoClinico(medicos: User[], pacientes: Paciente[]) {
    const historicos = [
      {
        descricao:
          'Paciente com histórico de hipertensão arterial controlada com medicação.',
        doencasPreexistentes: 'Hipertensão arterial sistêmica, Diabetes tipo 2',
        alergias: 'Penicilina, Dipirona',
        medicamentosUso:
          'Losartana 50mg - 1x ao dia, Metformina 850mg - 2x ao dia',
        historicoFamiliar: 'Pai com histórico de infarto, mãe diabética',
        pacienteId: pacientes[0].id,
        medicoId: medicos[0].id,
      },
      {
        descricao:
          'Paciente com quadro de anemia ferropriva em acompanhamento.',
        doencasPreexistentes: 'Anemia ferropriva, Gastrite crônica',
        alergias: 'Não relatadas',
        medicamentosUso:
          'Sulfato ferroso 40mg - 3x ao dia, Omeprazol 20mg - 1x ao dia',
        historicoFamiliar: 'Mãe com anemia, avó materna com câncer de estômago',
        pacienteId: pacientes[1].id,
        medicoId: medicos[1].id,
      },
      {
        descricao: 'Paciente jovem, saudável, sem comorbidades significativas.',
        doencasPreexistentes: 'Nenhuma',
        alergias: 'Não conhecidas',
        medicamentosUso: 'Nenhum em uso contínuo',
        historicoFamiliar: 'Família hígida, sem antecedentes relevantes',
        pacienteId: pacientes[2].id,
        medicoId: medicos[0].id,
      },
    ];

    for (const historicoData of historicos) {
      const exists = await this.historicoRepository.findOne({
        where: { pacienteId: historicoData.pacienteId },
      });

      if (!exists) {
        const historico = this.historicoRepository.create(historicoData);
        await this.historicoRepository.save(historico);
      }
    }
  }

  private async seedAnotacoesMedicas(medicos: User[], pacientes: Paciente[]) {
    const today = new Date();
    const anotacoes = [
      {
        anotacao:
          'Paciente comparece para consulta de rotina. Refere estar se sentindo bem, sem queixas específicas. Pressão arterial controlada.',
        diagnostico: 'Hipertensão arterial controlada',
        prescricao: 'Manter medicação atual. Retorno em 3 meses.',
        observacoes:
          'Orientado sobre dieta hipossódica e atividade física regular.',
        dataAnotacao: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
        pacienteId: pacientes[0].id,
        medicoId: medicos[0].id,
      },
      {
        anotacao:
          'Paciente retorna com resultados de exames. Hemoglobina ainda baixa, mas com melhora em relação ao exame anterior.',
        diagnostico: 'Anemia ferropriva em tratamento',
        prescricao:
          'Continuar sulfato ferroso. Solicitado novo hemograma em 30 dias.',
        observacoes:
          'Orientada sobre alimentação rica em ferro. Boa aderência ao tratamento.',
        dataAnotacao: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000),
        pacienteId: pacientes[1].id,
        medicoId: medicos[1].id,
      },
      {
        anotacao:
          'Primeira consulta. Paciente jovem busca avaliação de saúde geral para início de atividade física.',
        diagnostico: 'Paciente hígido',
        prescricao:
          'Liberado para atividade física. Solicitados exames de rotina.',
        observacoes:
          'Orientações sobre atividade física progressiva e hidratação adequada.',
        dataAnotacao: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000),
        pacienteId: pacientes[2].id,
        medicoId: medicos[2].id,
      },
      {
        anotacao:
          'Consulta de acompanhamento. Paciente apresenta melhora do quadro anêmico após 2 meses de tratamento.',
        diagnostico: 'Anemia ferropriva - melhora clínica',
        prescricao: 'Reduzir dose do sulfato ferroso para 2x ao dia.',
        observacoes: 'Paciente relata menos cansaço e melhora da disposição.',
        dataAnotacao: today,
        pacienteId: pacientes[1].id,
        medicoId: medicos[1].id,
      },
    ];

    for (const anotacaoData of anotacoes) {
      const exists = await this.anotacoesRepository.findOne({
        where: {
          pacienteId: anotacaoData.pacienteId,
          dataAnotacao: anotacaoData.dataAnotacao,
        },
      });

      if (!exists) {
        const anotacao = this.anotacoesRepository.create(anotacaoData);
        await this.anotacoesRepository.save(anotacao);
      }
    }
  }

  private async seedSinaisVitais(profissionais: User[], pacientes: Paciente[]) {
    const today = new Date();
    const sinaisVitais = [
      {
        pressaoArterial: '130/80',
        frequenciaCardiaca: 72,
        frequenciaRespiratoria: 16,
        temperatura: 36.5,
        saturacaoOxigenio: 98,
        peso: 75.5,
        altura: 1.75,
        observacoes: 'Sinais vitais dentro da normalidade',
        dataRegistro: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
        pacienteId: pacientes[0].id,
        profissionalId: profissionais[0].id,
      },
      {
        pressaoArterial: '110/70',
        frequenciaCardiaca: 88,
        frequenciaRespiratoria: 18,
        temperatura: 36.2,
        saturacaoOxigenio: 99,
        peso: 58.0,
        altura: 1.65,
        observacoes: 'Paciente com leve taquicardia, provavelmente ansiedade',
        dataRegistro: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000),
        pacienteId: pacientes[1].id,
        profissionalId: profissionais[1].id,
      },
      {
        pressaoArterial: '120/75',
        frequenciaCardiaca: 65,
        frequenciaRespiratoria: 15,
        temperatura: 36.8,
        saturacaoOxigenio: 99,
        peso: 82.0,
        altura: 1.8,
        observacoes: 'Excelente condição física',
        dataRegistro: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000),
        pacienteId: pacientes[2].id,
        profissionalId: profissionais[2].id,
      },
    ];

    for (const sinaisData of sinaisVitais) {
      const exists = await this.sinaisVitaisRepository.findOne({
        where: {
          pacienteId: sinaisData.pacienteId,
          dataRegistro: sinaisData.dataRegistro,
        },
      });

      if (!exists) {
        const sinais = this.sinaisVitaisRepository.create(sinaisData);
        await this.sinaisVitaisRepository.save(sinais);
      }
    }
  }

  private async seedEvolucaoPaciente(
    profissionais: User[],
    pacientes: Paciente[],
  ) {
    const today = new Date();
    const evolucoes = [
      {
        evolucao:
          'Paciente evoluindo bem após início do tratamento anti-hipertensivo. Pressão arterial mais controlada.',
        procedimentosRealizados: 'Aferição de PA, orientação nutricional',
        medicamentosAdministrados: 'Nenhum durante a consulta',
        observacoes:
          'Paciente aderente ao tratamento, demonstrando boa compreensão das orientações.',
        dataEvolucao: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
        pacienteId: pacientes[0].id,
        profissionalId: profissionais[0].id,
      },
      {
        evolucao:
          'Melhora significativa do quadro anêmico. Paciente refere maior disposição e redução da fadiga.',
        procedimentosRealizados: 'Avaliação clínica, revisão de exames',
        medicamentosAdministrados: 'Nenhum',
        observacoes:
          'Hemoglobina subiu de 8,5 para 10,2 g/dL. Manter tratamento.',
        dataEvolucao: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
        pacienteId: pacientes[1].id,
        profissionalId: profissionais[1].id,
      },
    ];

    for (const evolucaoData of evolucoes) {
      const exists = await this.evolucaoRepository.findOne({
        where: {
          pacienteId: evolucaoData.pacienteId,
          dataEvolucao: evolucaoData.dataEvolucao,
        },
      });

      if (!exists) {
        const evolucao = this.evolucaoRepository.create(evolucaoData);
        await this.evolucaoRepository.save(evolucao);
      }
    }
  }

  private async seedExames(medicos: User[], pacientes: Paciente[]) {
    const today = new Date();
    const exames = [
      {
        nomeExame: 'Hemograma Completo',
        tipo: TipoExame.LABORATORIAL,
        descricao: 'Avaliação completa das células sanguíneas',
        status: StatusExame.CONCLUIDO,
        resultado:
          'Hemoglobina: 10,2 g/dL, Hematócrito: 32%, Leucócitos: 7.500/mm³, Plaquetas: 280.000/mm³',
        observacoes: 'Melhora em relação ao exame anterior',
        dataSolicitacao: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
        dataResultado: new Date(today.getTime() - 28 * 24 * 60 * 60 * 1000),
        pacienteId: pacientes[1].id,
        medicoSolicitanteId: medicos[1].id,
        profissionalResultadoId: medicos[1].id,
      },
      {
        nomeExame: 'Radiografia de Tórax',
        tipo: TipoExame.IMAGEM,
        descricao: 'Avaliação radiológica do tórax',
        status: StatusExame.CONCLUIDO,
        resultado:
          'Campos pulmonares livres, coração de tamanho normal, sem alterações significativas',
        observacoes: 'Exame dentro da normalidade',
        dataSolicitacao: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000),
        dataResultado: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000),
        pacienteId: pacientes[2].id,
        medicoSolicitanteId: medicos[2].id,
        profissionalResultadoId: medicos[2].id,
      },
      {
        nomeExame: 'Eletrocardiograma',
        tipo: TipoExame.CARDIOLOGICO,
        descricao: 'Avaliação da atividade elétrica cardíaca',
        status: StatusExame.SOLICITADO,
        resultado: undefined,
        observacoes: 'Solicitado para avaliação pré-operatória',
        dataSolicitacao: today,
        dataResultado: undefined,
        pacienteId: pacientes[0].id,
        medicoSolicitanteId: medicos[0].id,
        profissionalResultadoId: undefined,
      },
    ];

    for (const exameData of exames) {
      const exists = await this.examesRepository.findOne({
        where: {
          nomeExame: exameData.nomeExame,
          pacienteId: exameData.pacienteId,
          dataSolicitacao: exameData.dataSolicitacao,
        },
      });

      if (!exists) {
        const exame = this.examesRepository.create(exameData);
        await this.examesRepository.save(exame);
      }
    }
  }
}

/*             
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
