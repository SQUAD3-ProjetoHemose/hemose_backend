/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Prescricao } from '../entities/prescricao.entity';
import { PrescricaoMedicamento } from '../entities/prescricao-medicamento.entity';
import { CreatePrescricaoDto } from '../dto/create-prescricao.dto';

@Injectable()
export class MedicoPrescricaoService {
  constructor(
    @InjectRepository(Prescricao)
    private readonly prescricaoRepository: Repository<Prescricao>,

    @InjectRepository(PrescricaoMedicamento)
    private readonly medicamentoRepository: Repository<PrescricaoMedicamento>,
  ) {}

  // Buscar prescrições do médico
  async getPrescricoes(medicoId: number, pacienteId?: number) {
    const whereConditions: any = { medicoId };

    if (pacienteId) {
      whereConditions.pacienteId = pacienteId;
    }

    return await this.prescricaoRepository.find({
      where: whereConditions,
      relations: ['paciente', 'medico', 'medicamentos'],
      order: { dataEmissao: 'DESC' },
    });
  }

  // Criar nova prescrição
  async criarPrescricao(
    createPrescricaoDto: CreatePrescricaoDto,
    medicoId: number,
  ) {
    const prescricao = this.prescricaoRepository.create({
      ...createPrescricaoDto,
      medicoId,
      status: 'ativa',
    });

    // Salvar prescrição primeiro
    const prescricaoSalva = await this.prescricaoRepository.save(prescricao);

    // Salvar medicamentos associados
    for (const medicamentoDto of createPrescricaoDto.medicamentos) {
      const medicamento = this.medicamentoRepository.create({
        ...medicamentoDto,
        prescricaoId: prescricaoSalva.id,
      });

      await this.medicamentoRepository.save(medicamento);
    }

    // Retornar prescrição completa com medicamentos
    return await this.prescricaoRepository.findOne({
      where: { id: prescricaoSalva.id },
      relations: ['paciente', 'medico', 'medicamentos'],
    });
  }

  // Buscar prescrição por ID
  async getPrescricaoById(id: number) {
    return await this.prescricaoRepository.findOne({
      where: { id },
      relations: ['paciente', 'medico', 'medicamentos'],
    });
  }

  // Cancelar prescrição
  async cancelarPrescricao(id: number, medicoId: number) {
    const prescricao = await this.prescricaoRepository.findOne({
      where: { id, medicoId },
    });

    if (!prescricao) {
      throw new Error('Prescrição não encontrada');
    }

    prescricao.status = 'cancelada';
    return await this.prescricaoRepository.save(prescricao);
  }

  // Marcar prescrição como dispensada
  async marcarDispensada(id: number) {
    const prescricao = await this.prescricaoRepository.findOne({
      where: { id },
    });

    if (!prescricao) {
      throw new Error('Prescrição não encontrada');
    }

    prescricao.status = 'dispensada';
    return await this.prescricaoRepository.save(prescricao);
  }

  // Buscar estatísticas de prescrições
  async getEstatisticasPrescricoes(medicoId: number) {
    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

    const [totalMes, ativasMes, dispensadasMes, canceladasMes, totalGeral] =
      await Promise.all([
        this.prescricaoRepository.count({
          where: {
            medicoId,
            dataEmissao: { $gte: inicioMes } as any,
          },
        }),

        this.prescricaoRepository.count({
          where: {
            medicoId,
            dataEmissao: { $gte: inicioMes } as any,
            status: 'ativa',
          },
        }),

        this.prescricaoRepository.count({
          where: {
            medicoId,
            dataEmissao: { $gte: inicioMes } as any,
            status: 'dispensada',
          },
        }),

        this.prescricaoRepository.count({
          where: {
            medicoId,
            dataEmissao: { $gte: inicioMes } as any,
            status: 'cancelada',
          },
        }),

        this.prescricaoRepository.count({
          where: { medicoId },
        }),
      ]);

    return {
      totalMes,
      ativasMes,
      dispensadasMes,
      canceladasMes,
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
