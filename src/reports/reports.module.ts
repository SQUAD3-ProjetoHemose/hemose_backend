import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './controllers/reports.controller';
import { ReportsService } from './services/reports.service';
import { User } from '../users/entities/user.entity';
import { Paciente } from '../users/paciente/entities/paciente.entity';
import { Agendamento } from '../agendamentos/entities/agendamento.entity';
import { Prontuario } from '../users/entities/prontuario.entity';
import { Prescricao } from '../users/entities/prescricao.entity';
import { Internacao } from '../users/entities/internacao.entity';

// Módulo de relatórios e estatísticas do sistema
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Paciente,
      Agendamento,
      Prontuario,
      Prescricao,
      Internacao,
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}

/* 
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
 */
