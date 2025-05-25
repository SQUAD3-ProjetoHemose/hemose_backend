import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProntuarioEletronicoController } from './controllers/prontuario-eletronico.controller';
import { ProntuarioEletronicoService } from './services/prontuario-eletronico.service';
import { Prontuario } from '../users/entities/prontuario.entity';
import { HistoricoClinico } from './entities/historico-clinico.entity';
import { AnotacaoMedica } from './entities/anotacao-medica.entity';
import { Exame } from './entities/exame.entity';
import { EvolucaoPaciente } from './entities/evolucao-paciente.entity';
import { SinaisVitais } from './entities/sinais-vitais.entity';

// Módulo completo de prontuário eletrônico
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Prontuario,
      HistoricoClinico,
      AnotacaoMedica,
      Exame,
      EvolucaoPaciente,
      SinaisVitais,
    ]),
  ],
  controllers: [ProntuarioEletronicoController],
  providers: [ProntuarioEletronicoService],
  exports: [ProntuarioEletronicoService],
})
export class ProntuarioEletronicoModule {}

/* 
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
   */