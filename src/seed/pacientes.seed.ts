import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paciente } from '../users/paciente/entities/paciente.entity';

// Interface para os dados de exemplo dos pacientes
interface PacienteExemplo {
  nome: string;
  cpf: string;
  rg: string;
  data_nascimento: Date;
  sexo: string;
  telefone: string;
  email: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  nome_mae: string;
  estado_civil: string;
  profissao: string;
  convenio: string;
  numero_carteirinha: string | null;
}

@Injectable()
export class PacientesSeedService {
  private readonly logger = new Logger(PacientesSeedService.name);

  constructor(
    @InjectRepository(Paciente)
    private pacientesRepository: Repository<Paciente>,
  ) {}

  async seed() {
    this.logger.log('🔄 Verificando e criando pacientes de exemplo...');

    const pacientesExemplo = [
      {
        nome: 'João da Silva Santos',
        cpf: '12345678901',
        rg: '123456789',
        data_nascimento: new Date('1985-03-15'),
        sexo: 'M',
        telefone: '(11) 99999-1234',
        email: 'joao.santos@email.com',
        endereco: 'Rua das Flores, 123',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234-567',
        nome_mae: 'Maria da Silva',
        estado_civil: 'solteiro',
        profissao: 'Engenheiro',
        convenio: 'SUS',
        numero_carteirinha: null,
      },
      {
        nome: 'Maria Oliveira Costa',
        cpf: '98765432109',
        rg: '987654321',
        data_nascimento: new Date('1978-07-22'),
        sexo: 'F',
        telefone: '(11) 88888-5678',
        email: 'maria.costa@email.com',
        endereco: 'Av. Brasil, 456',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '04567-890',
        nome_mae: 'Ana Oliveira',
        estado_civil: 'casada',
        profissao: 'Professora',
        convenio: 'Unimed',
        numero_carteirinha: 'UNI123456789',
      },
      {
        nome: 'Carlos Roberto Lima',
        cpf: '11122233344',
        rg: '111222333',
        data_nascimento: new Date('1992-11-08'),
        sexo: 'M',
        telefone: '(11) 77777-9012',
        email: 'carlos.lima@email.com',
        endereco: 'Rua São José, 789',
        cidade: 'Guarulhos',
        estado: 'SP',
        cep: '07123-456',
        nome_mae: 'Rosa Lima',
        estado_civil: 'solteiro',
        profissao: 'Programador',
        convenio: 'SUS',
        numero_carteirinha: null,
      },
      {
        nome: 'Ana Paula Ferreira',
        cpf: '55566677788',
        rg: '555666777',
        data_nascimento: new Date('1987-05-30'),
        sexo: 'F',
        telefone: '(11) 66666-3456',
        email: 'ana.ferreira@email.com',
        endereco: 'Rua das Palmeiras, 321',
        cidade: 'Osasco',
        estado: 'SP',
        cep: '06234-789',
        nome_mae: 'Lucia Ferreira',
        estado_civil: 'divorciada',
        profissao: 'Advogada',
        convenio: 'Bradesco Saúde',
        numero_carteirinha: 'BRA987654321',
      },
      {
        nome: 'Pedro Henrique Souza',
        cpf: '33344455566',
        rg: '333444555',
        data_nascimento: new Date('1995-12-03'),
        sexo: 'M',
        telefone: '(11) 55555-7890',
        email: 'pedro.souza@email.com',
        endereco: 'Av. Paulista, 1000',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01310-100',
        nome_mae: 'Isabel Souza',
        estado_civil: 'solteiro',
        profissao: 'Designer',
        convenio: 'SUS',
        numero_carteirinha: null,
      },
      {
        nome: 'Fernanda Alves Rodrigues',
        cpf: '77788899900',
        rg: '777888999',
        data_nascimento: new Date('1983-09-17'),
        sexo: 'F',
        telefone: '(11) 44444-2468',
        email: 'fernanda.rodrigues@email.com',
        endereco: 'Rua dos Lírios, 654',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '05432-109',
        nome_mae: 'Carmen Alves',
        estado_civil: 'casada',
        profissao: 'Médica',
        convenio: 'Amil',
        numero_carteirinha: 'AMI456789012',
      },
    ];

    // Criar todos os pacientes de exemplo
    for (const pacienteData of pacientesExemplo) {
      await this.createPacienteIfNotExists(pacienteData);
    }

    this.logger.log('✅ Seed de pacientes concluído!');
  }

  private async createPacienteIfNotExists(
    pacienteData: PacienteExemplo,
  ): Promise<void> {
    try {
      // Verificar se o paciente já existe pelo CPF
      const existingPaciente = await this.pacientesRepository.findOne({
        where: { cpf: pacienteData.cpf },
      });

      if (!existingPaciente) {
        const newPaciente = this.pacientesRepository.create(pacienteData);
        await this.pacientesRepository.save(newPaciente);
        this.logger.log(`✅ Paciente criado: ${pacienteData.nome}`);
      } else {
        this.logger.log(`ℹ️ Paciente já existe: ${pacienteData.nome}`);
      }
    } catch (error) {
      this.logger.error(
        `❌ Erro ao criar paciente ${pacienteData.nome}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      );
    }
  }

  async getPacientes(): Promise<Paciente[]> {
    return await this.pacientesRepository.find();
  }
}

/*             
   __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
