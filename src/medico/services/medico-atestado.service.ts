import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Atestado } from '../entities/atestado.entity';
import { CreateAtestadoDto } from '../dto/create-atestado.dto';

@Injectable()
export class MedicoAtestadoService {
  constructor(
    @InjectRepository(Atestado)
    private readonly atestadoRepository: Repository<Atestado>,
  ) {}

  // Buscar atestados do médico
  async getAtestados(medicoId: number, pacienteId?: number) {
    const whereConditions: any = { medicoId };
    
    if (pacienteId) {
      whereConditions.pacienteId = pacienteId;
    }

    return await this.atestadoRepository.find({
      where: whereConditions,
      relations: ['paciente', 'medico'],
      order: { dataEmissao: 'DESC' },
    });
  }

  // Criar novo atestado
  async criarAtestado(createAtestadoDto: CreateAtestadoDto, medicoId: number) {
    const atestado = this.atestadoRepository.create({
      ...createAtestadoDto,
      medicoId,
      status: 'ativo',
    });

    // Calcular data de validade se não fornecida
    if (!atestado.dataValidade && atestado.diasAfastamento) {
      const dataValidade = new Date(atestado.dataEmissao);
      dataValidade.setDate(dataValidade.getDate() + atestado.diasAfastamento);
      atestado.dataValidade = dataValidade;
    }

    return await this.atestadoRepository.save(atestado);
  }

  // Buscar atestado por ID
  async getAtestadoById(id: number) {
    return await this.atestadoRepository.findOne({
      where: { id },
      relations: ['paciente', 'medico'],
    });
  }

  // Cancelar atestado
  async cancelarAtestado(id: number, medicoId: number) {
    const atestado = await this.atestadoRepository.findOne({
      where: { id, medicoId },
    });

    if (!atestado) {
      throw new Error('Atestado não encontrado');
    }

    atestado.status = 'cancelado';
    return await this.atestadoRepository.save(atestado);
  }

  // Buscar estatísticas de atestados
  async getEstatisticasAtestados(medicoId: number) {
    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

    const [
      totalMes,
      ativosMes,
      canceladosMes,
      totalGeral
    ] = await Promise.all([
      this.atestadoRepository.count({
        where: {
          medicoId,
          dataEmissao: { $gte: inicioMes } as any,
        },
      }),

      this.atestadoRepository.count({
        where: {
          medicoId,
          dataEmissao: { $gte: inicioMes } as any,
          status: 'ativo',
        },
      }),

      this.atestadoRepository.count({
        where: {
          medicoId,
          dataEmissao: { $gte: inicioMes } as any,
          status: 'cancelado',
        },
      }),

      this.atestadoRepository.count({
        where: { medicoId },
      }),
    ]);

    return {
      totalMes,
      ativosMes,
      canceladosMes,
      totalGeral,
    };
  }
}

/* 
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
