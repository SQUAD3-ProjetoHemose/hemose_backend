import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePacienteDto } from '../dto/create-paciente.dto';
import { UpdatePacienteDto } from '../dto/update-paciente.dto';
import { Paciente } from '../entities/paciente.entity';
import { Agendamento } from '../../../agendamentos/entities/agendamento.entity'; // Importa a entidade de agendamento

@Injectable()
export class PacienteService {
  constructor(
    @InjectRepository(Paciente)
    private pacienteRepository: Repository<Paciente>,
    @InjectRepository(Agendamento) // Injete o repositório de agendamentos
    private agendamentoRepository: Repository<Agendamento>,
  ) {}

  async create(createPacienteDto: CreatePacienteDto): Promise<Paciente> {
    const novoPaciente = this.pacienteRepository.create(createPacienteDto);
    return this.pacienteRepository.save(novoPaciente);
  }

  async findAll(): Promise<Paciente[]> {
    return this.pacienteRepository.find({ where: { deletado: false } });
  }
  async findAllDeleted(): Promise<Paciente[]> {
    return this.pacienteRepository.find({ where: { deletado: true } });
  }

  async findById(id: number): Promise<Paciente> {
    const paciente = await this.pacienteRepository.findOne({
      where: { id: id },
    });

    if (!paciente) {
      throw new NotFoundException(`Paciente com o ID ${id} não encontrado.`);
    }

    return paciente;
  }

  async update(
    id: number,
    updatePacienteDto: UpdatePacienteDto,
  ): Promise<Paciente> {
    const paciente = await this.findById(id);
    const pacienteAtualizado = this.pacienteRepository.merge(
      paciente,
      updatePacienteDto,
    );
    return this.pacienteRepository.save(pacienteAtualizado);
  }

  async remove(id: number): Promise<Paciente> {
    const paciente = await this.findById(id);
    paciente.deletado = true;
    return this.pacienteRepository.save(paciente);
  }
}
