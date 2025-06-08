import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnfermagemController } from './controllers/enfermagem.controller';
import { EnfermagemService } from './services/enfermagem.service';
import { Triagem } from './entities/triagem.entity';
import { EvolucaoEnfermagem } from './entities/evolucao-enfermagem.entity';
// Importar entidades relacionadas quando necessário
// import { Paciente } from '../pacientes/entities/paciente.entity';
// import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Triagem,
      EvolucaoEnfermagem,
      // Adicionar outras entidades relacionadas quando necessário
      // Paciente,
      // User,
    ]),
  ],
  controllers: [EnfermagemController],
  providers: [EnfermagemService],
  exports: [EnfermagemService],
})
export class EnfermagemModule {}

/*             
   __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
