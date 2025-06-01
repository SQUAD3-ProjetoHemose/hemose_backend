import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Importar módulos existentes que serão reutilizados
import { PacienteModule } from '../users/paciente/modules/paciente.module';
import { ProntuarioEletronicoModule } from '../prontuario-eletronico/prontuario-eletronico.module';
import { AgendamentoModule } from '../agendamentos/agendamento.module';
import { AuditModule } from '../audit/audit.module';

// Importar entidades necessárias
import { User } from '../users/entities/user.entity';
import { Agendamento } from '../agendamentos/entities/agendamento.entity'; // Adicionar entidade Agendamento
import { Atestado } from './entities/atestado.entity';
import { Prescricao } from './entities/prescricao.entity';
import { PrescricaoMedicamento } from './entities/prescricao-medicamento.entity'; // Adicionar entidade relacionada
import { Template } from './entities/template.entity';
import { FilaEspera } from './entities/fila-espera.entity';
import { Paciente } from '../users/paciente/entities/paciente.entity'; // Importar Paciente se necessário
import { HistoricoClinico } from '../prontuario-eletronico/entities/historico-clinico.entity';
import { EvolucaoPaciente } from '../prontuario-eletronico/entities/evolucao-paciente.entity';
import { Exame } from '../prontuario-eletronico/entities/exame.entity';
import { SinaisVitais } from '../prontuario-eletronico/entities/sinais-vitais.entity';
import { AnotacaoMedica } from '../prontuario-eletronico/entities/anotacao-medica.entity';
import { AuditLog } from '../audit/entities/audit-log.entity';


// Controladores do módulo médico
import { MedicoDashboardController } from './controllers/medico-dashboard.controller';
import { MedicoAtendimentoController } from './controllers/medico-atendimento.controller';
import { MedicoAtestadoController } from './controllers/medico-atestado.controller';
import { MedicoPrescricaoController } from './controllers/medico-prescricao.controller';
import { MedicoTemplateController } from './controllers/medico-template.controller';

// Serviços do módulo médico
import { MedicoDashboardService } from './services/medico-dashboard.service';
import { MedicoAtendimentoService } from './services/medico-atendimento.service';
import { MedicoAtestadoService } from './services/medico-atestado.service';
import { MedicoPrescricaoService } from './services/medico-prescricao.service';
import { MedicoTemplateService } from './services/medico-template.service';
import { FilaEsperaService } from './services/fila-espera.service';

@Module({
  imports: [
    // Registrar as entidades específicas do módulo médico incluindo Agendamento
    TypeOrmModule.forFeature([
      User,
      Agendamento, 
      Atestado,
      Prescricao,
      PrescricaoMedicamento, 
      Template,
      FilaEspera,
      Paciente, 
      HistoricoClinico,
      EvolucaoPaciente,
      Exame,
      SinaisVitais,
      AnotacaoMedica,
      AuditLog, 
      // Outras entidades do módulo médico podem ser adicionadas aqui
    ]),
    
    // Importar módulos existentes para reutilização
    PacienteModule,
    ProntuarioEletronicoModule,
    AgendamentoModule, // Manter para reutilizar serviços se necessário
    AuditModule,
  ],
  
  controllers: [
    MedicoDashboardController,
    MedicoAtendimentoController,
    MedicoAtestadoController,
    MedicoPrescricaoController,
    MedicoTemplateController,
  ],
  
  providers: [
    MedicoDashboardService,
    MedicoAtendimentoService,
    MedicoAtestadoService,
    MedicoPrescricaoService,
    MedicoTemplateService,
    FilaEsperaService,
  ],
  
  exports: [
    MedicoDashboardService,
    MedicoAtendimentoService,
    MedicoAtestadoService,
    MedicoPrescricaoService,
    MedicoTemplateService,
    FilaEsperaService,
  ],
})
export class MedicoModule {}

/* 
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
