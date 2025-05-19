import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { PacienteModule } from './users/paciente/modules/paciente.module';
import { SeedModule } from './seed/seed.module';
import databaseConfig from './config/database.config';
import { AuthModule } from './auth/auth.module'; 
import { AgendamentoModule } from './agendamentos/agendamento.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
    }),
    UsersModule,
    PacienteModule,
    SeedModule, 
    AgendamentoModule,
    AuthModule, 
    
  ],
})
export class AppModule {}
            
/*             
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
