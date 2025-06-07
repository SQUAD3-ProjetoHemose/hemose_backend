import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Importar seeds
import { AgendamentosSeedService } from './agendamentos.seed';
import { PacientesSeedService } from './pacientes.seed';
import { ProntuariosSeedService } from './prontuarios.seed';
import { SeedOrchestrator } from './seed-orchestrator.service';
import { TemplatesSeedService } from './templates.seed';
import { UsersSeedService } from './users.seed';

// Importar entidades necessárias
import { Agendamento } from '../agendamentos/entities/agendamento.entity';
import { AuditLog } from '../audit/entities/audit-log.entity';
import { Template } from '../medico/entities/template.entity';
import { AnotacaoMedica } from '../prontuario-eletronico/entities/anotacao-medica.entity';
import { EvolucaoPaciente } from '../prontuario-eletronico/entities/evolucao-paciente.entity';
import { Exame } from '../prontuario-eletronico/entities/exame.entity';
import { HistoricoClinico } from '../prontuario-eletronico/entities/historico-clinico.entity';
import { SinaisVitais } from '../prontuario-eletronico/entities/sinais-vitais.entity';
import { User } from '../users/entities/user.entity';
import { Paciente } from '../users/paciente/entities/paciente.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Paciente,
      Agendamento,
      Template,
      AnotacaoMedica,
      HistoricoClinico,
      SinaisVitais,
      EvolucaoPaciente,
      Exame,
      AuditLog,
    ]),
  ],
  providers: [
    UsersSeedService,
    PacientesSeedService,
    AgendamentosSeedService,
    TemplatesSeedService,
    ProntuariosSeedService,
    SeedOrchestrator,
  ],
  exports: [SeedOrchestrator],
})
export class SeedModule {}

/*             
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
