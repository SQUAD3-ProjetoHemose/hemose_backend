import { Module } from '@nestjs/common';
import { PacienteService } from './../services/paciente.service';
import { PacienteController } from './../controllers/paciente.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Funcionario } from '../../entities/funcionario.entity';
import { Medico } from '../../entities/medico.entity';
import { Paciente } from '../../paciente/entities/paciente.entity';
import { Prescricao } from '../../entities/prescricao.entity';
import { Medicamento } from '../../entities/medicamento.entity';
import { Leito } from '../../entities/leito.entity';
import { Internacao } from '../../entities/internacao.entity';
import { Prontuario } from '../../entities/prontuario.entity';
import { HistoricoPaciente } from '../../entities/historico-paciente.entity';
import { FuncionarioInternacao } from '../../entities/funcionario-internacao.entity';
import { EstoqueMedicamentos } from '../../entities/estoque-medicamentos.entity';
import { PacienteMedicamento } from '../../entities/paciente-medicamento.entity';
import { UsersService } from '../../users.service';
import { UsersController } from '../../users.controller';

@Module({
  imports: [
      TypeOrmModule.forFeature([
        User,
        Funcionario,
        Medico,
        Paciente,
        Prescricao,
        Medicamento,
        Leito,
        Internacao,
        Prontuario,
        HistoricoPaciente,
        FuncionarioInternacao,
        EstoqueMedicamentos,
        PacienteMedicamento,
      ]),
    ],
  controllers: [PacienteController],
  providers: [PacienteService],
  exports: [PacienteService]
})
export class PacienteModule {}
