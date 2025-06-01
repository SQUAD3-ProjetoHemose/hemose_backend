import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilaEspera } from '../entities/fila-espera.entity';
import { Paciente } from '../../users/paciente/entities/paciente.entity';

@Injectable()
export class FilaEsperaService {
  constructor(
    @InjectRepository(FilaEspera)
    private readonly filaEsperaRepository: Repository<FilaEspera>,
  ) {}

  // Buscar fila de espera ordenada por prioridade
  async getFilaEsperaOrdenada() {
    const fila = await this.filaEsperaRepository.find({
      where: { status: 'aguardando' },
      relations: ['paciente'],
      order: { horarioChegada: 'ASC' },
    });

    // Ordenar por prioridade (vermelho > laranja > amarelo > azul > verde)
    const ordemPrioridade = {
      'vermelho': 1,
      'laranja': 2,
      'amarelo': 3,
      'azul': 4,
      'verde': 5,
    };

    return fila
      .sort((a, b) => ordemPrioridade[a.prioridade] - ordemPrioridade[b.prioridade])
      .map(item => ({
        id: item.paciente.id,
        nome: item.paciente.nome,
        prioridade: item.prioridade,
        descricaoPrioridade: item.descricaoPrioridade,
        horarioChegada: item.horarioChegada,
        queixaPrincipal: item.queixaPrincipal,
        idade: this.calcularIdade(item.paciente.data_nascimento.toISOString()),
        tipoAtendimento: item.tipoAtendimento,
      }));
  }

  // Adicionar paciente à fila de espera
  async adicionarPacienteFila(pacienteId: number, dadosTriagem: any) {
    const novoItem = this.filaEsperaRepository.create({
      pacienteId,
      prioridade: dadosTriagem.prioridade,
      descricaoPrioridade: dadosTriagem.descricaoPrioridade,
      queixaPrincipal: dadosTriagem.queixaPrincipal,
      tipoAtendimento: dadosTriagem.tipoAtendimento,
      horarioChegada: new Date(),
      status: 'aguardando',
    });

    return await this.filaEsperaRepository.save(novoItem);
  }

  // Iniciar atendimento (remover da fila)
  async iniciarAtendimento(pacienteId: number, medicoId: number) {
    const item = await this.filaEsperaRepository.findOne({
      where: { pacienteId, status: 'aguardando' },
    });

    if (item) {
      item.status = 'em_atendimento';
      item.medicoId = medicoId;
      item.horaInicioAtendimento = new Date();
      
      return await this.filaEsperaRepository.save(item);
    }

    return null;
  }

  // Finalizar atendimento
  async finalizarAtendimento(pacienteId: number) {
    const item = await this.filaEsperaRepository.findOne({
      where: { pacienteId, status: 'em_atendimento' },
    });

    if (item) {
      item.status = 'atendido';
      item.horaFimAtendimento = new Date();
      
      return await this.filaEsperaRepository.save(item);
    }

    return null;
  }

  // Função auxiliar para calcular idade
  private calcularIdade(dataNascimento: string): number {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    
    const mesAtual = hoje.getMonth();
    const mesNascimento = nascimento.getMonth();
    
    if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    
    return idade;
  }
}

/* 
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
