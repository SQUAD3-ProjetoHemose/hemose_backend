/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../../users/enums/user-role.enum';
import { CreateEvolucaoEnfermagemDto } from '../dto/create-evolucao-enfermagem.dto';
import { CreateTriagemDto } from '../dto/create-triagem.dto';
import { EvolucaoEnfermagem } from '../entities/evolucao-enfermagem.entity';
import { Triagem } from '../entities/triagem.entity';

@Injectable()
export class EnfermagemService {
  constructor(
    @InjectRepository(Triagem)
    private triagemRepository: Repository<Triagem>,
    @InjectRepository(EvolucaoEnfermagem)
    private evolucaoRepository: Repository<EvolucaoEnfermagem>,
  ) {}

  // Realizar triagem - obrigatória antes de qualquer procedimento
  async realizarTriagem(
    createTriagemDto: CreateTriagemDto,
    usuarioLogado: any,
  ): Promise<Triagem> {
    // Verificar permissões - apenas enfermeiras e técnicas podem fazer triagem
    if (
      ![UserRole.ENFERMEIRA, UserRole.TECNICA_ENFERMAGEM].includes(
        usuarioLogado.role,
      )
    ) {
      throw new BadRequestException(
        'Usuário não possui permissão para realizar triagem',
      );
    }

    // Criar nova triagem
    const triagem = this.triagemRepository.create({
      ...createTriagemDto,
      profissionalId: usuarioLogado.id,
      dataTriagem: new Date(),
    });

    return this.triagemRepository.save(triagem);
  }

  // Registrar evolução de enfermagem - inclui sinais vitais
  async registrarEvolucaoEnfermagem(
    createEvolucaoDto: CreateEvolucaoEnfermagemDto,
    usuarioLogado: any,
  ): Promise<EvolucaoEnfermagem> {
    // Verificar permissões
    if (
      ![UserRole.ENFERMEIRA, UserRole.TECNICA_ENFERMAGEM].includes(
        usuarioLogado.role,
      )
    ) {
      throw new BadRequestException(
        'Usuário não possui permissão para registrar evolução de enfermagem',
      );
    }

    // Verificar se triagem foi realizada (regra obrigatória)
    const triagemExistente = await this.triagemRepository.findOne({
      where: {
        pacienteId: createEvolucaoDto.pacienteId,
      },
      order: { dataTriagem: 'DESC' },
    });

    if (!triagemExistente) {
      throw new BadRequestException(
        'Triagem deve ser realizada antes de qualquer procedimento de enfermagem',
      );
    }

    // Criar evolução de enfermagem com sinais vitais
    const evolucao = this.evolucaoRepository.create({
      ...createEvolucaoDto,
      profissionalId: usuarioLogado.id,
      triagemId: triagemExistente.id,
      dataEvolucao: new Date(),
    });

    return await this.evolucaoRepository.save(evolucao);
  }

  // Buscar triagens de um paciente
  async buscarTriagensPaciente(
    pacienteId: string,
    usuarioLogado: any,
  ): Promise<Triagem[]> {
    // Médicos também podem ver triagens para apoio
    if (
      ![
        UserRole.ENFERMEIRA,
        UserRole.TECNICA_ENFERMAGEM,
        UserRole.MEDICO,
      ].includes(usuarioLogado.role)
    ) {
      throw new BadRequestException(
        'Usuário não possui permissão para visualizar triagens',
      );
    }

    const triagens = await this.triagemRepository.find({
      where: { pacienteId },
      order: { dataTriagem: 'DESC' },
    });

    return triagens;
  }

  // Buscar evoluções de enfermagem de um paciente
  async buscarEvolucoesPaciente(
    pacienteId: string,
    usuarioLogado: any,
  ): Promise<EvolucaoEnfermagem[]> {
    // Verificar permissões - técnicas NÃO têm acesso à evolução médica
    if (
      ![UserRole.ENFERMEIRA, UserRole.TECNICA_ENFERMAGEM].includes(
        usuarioLogado.role,
      )
    ) {
      throw new BadRequestException(
        'Usuário não possui permissão para visualizar evoluções de enfermagem',
      );
    }

    return await this.evolucaoRepository.find({
      where: { pacienteId },
      order: { dataEvolucao: 'DESC' },
      relations: ['triagem'],
    });
  }

  // Buscar triagem específica
  async buscarTriagem(triagemId: string, usuarioLogado: any): Promise<Triagem> {
    // Verificar permissões
    if (
      ![
        UserRole.ENFERMEIRA,
        UserRole.TECNICA_ENFERMAGEM,
        UserRole.MEDICO,
      ].includes(usuarioLogado.role)
    ) {
      throw new BadRequestException(
        'Usuário não possui permissão para visualizar triagem',
      );
    }

    const triagem = await this.triagemRepository.findOne({
      where: { id: triagemId },
    });

    if (!triagem) {
      throw new NotFoundException('Triagem não encontrada');
    }

    return triagem;
  }

  // Atualizar triagem existente
  async atualizarTriagem(
    triagemId: string,
    updateTriagemDto: Partial<CreateTriagemDto>,
    usuarioLogado: any,
  ): Promise<Triagem> {
    // Verificar permissões
    if (
      ![UserRole.ENFERMEIRA, UserRole.TECNICA_ENFERMAGEM].includes(
        usuarioLogado.role,
      )
    ) {
      throw new BadRequestException(
        'Usuário não possui permissão para atualizar triagem',
      );
    }

    const triagem = await this.buscarTriagem(triagemId, usuarioLogado);

    // Verificar se pode atualizar (próprio responsável ou enfermeira)
    if (
      triagem.profissionalId !== usuarioLogado.id &&
      usuarioLogado.role !== UserRole.ENFERMEIRA
    ) {
      throw new BadRequestException(
        'Apenas o responsável pela triagem ou uma enfermeira pode atualizá-la',
      );
    }

    // Atualizar dados
    Object.assign(triagem, {
      ...updateTriagemDto,
      dataAtualizacao: new Date(),
    });

    return await this.triagemRepository.save(triagem);
  }

  // Médicos podem adicionar informações de apoio à triagem
  async adicionarSuporteMedicoTriagem(
    triagemId: string,
    suporteMedicoDto: { observacoesMedicas: string },
    usuarioLogado: any,
  ): Promise<Triagem> {
    // Verificar se é médico
    if (usuarioLogado.role !== UserRole.MEDICO) {
      throw new BadRequestException(
        'Apenas médicos podem adicionar informações de suporte à triagem',
      );
    }

    const triagem = await this.triagemRepository.findOne({
      where: { id: triagemId },
    });

    if (!triagem) {
      throw new NotFoundException('Triagem não encontrada');
    }

    // Adicionar observações médicas de apoio
    triagem.observacoesMedicas = suporteMedicoDto.observacoesMedicas;
    triagem.dataAtualizacao = new Date();

    return await this.triagemRepository.save(triagem);
  }

  // Verificar se paciente possui triagem válida
  async verificarTriagemObrigatoria(pacienteId: string): Promise<boolean> {
    const triagem = await this.triagemRepository.findOne({
      where: { pacienteId },
      order: { dataTriagem: 'DESC' },
    });

    return !!triagem;
  }

  // Buscar estatísticas de enfermagem para dashboard
  async buscarEstatisticasEnfermagem(usuarioLogado: any): Promise<any> {
    if (
      ![UserRole.ENFERMEIRA, UserRole.TECNICA_ENFERMAGEM].includes(
        usuarioLogado.role,
      )
    ) {
      throw new BadRequestException(
        'Usuário não possui permissão para visualizar estatísticas',
      );
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const triagensHoje = await this.triagemRepository.count({
      where: {
        dataTriagem: new Date(hoje),
      },
    });

    const evolucoesHoje = await this.evolucaoRepository.count({
      where: {
        dataEvolucao: new Date(hoje),
      },
    });

    return {
      triagensHoje,
      evolucoesHoje,
      dataConsulta: hoje,
    };
  }
}

/*
   __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
