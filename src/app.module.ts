import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

// Guards e interceptors
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

// Importar todos os módulos da aplicação
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PacienteModule } from './users/paciente/modules/paciente.module';
import { AgendamentoModule } from './agendamentos/agendamento.module';
import { ReportsModule } from './reports/reports.module';
import { AuditModule } from './audit/audit.module';
import { ProntuarioEletronicoModule } from './prontuario-eletronico/prontuario-eletronico.module';
import { MedicoModule } from './medico/medico.module'; // Novo módulo médico
import { SeedModule } from './seed/seed.module';

// Entidades do banco de dados
import { User } from './users/entities/user.entity';
import { Paciente } from './users/paciente/entities/paciente.entity';
import { Agendamento } from './agendamentos/entities/agendamento.entity';
import { HistoricoClinico } from './prontuario-eletronico/entities/historico-clinico.entity';
import { EvolucaoPaciente } from './prontuario-eletronico/entities/evolucao-paciente.entity';
import { Exame } from './prontuario-eletronico/entities/exame.entity';
import { SinaisVitais } from './prontuario-eletronico/entities/sinais-vitais.entity';
import { AnotacaoMedica } from './prontuario-eletronico/entities/anotacao-medica.entity';
import { AuditLog } from './audit/entities/audit-log.entity';

// Novas entidades do módulo médico
import { Atestado } from './medico/entities/atestado.entity';
import { Prescricao } from './medico/entities/prescricao.entity';
import { PrescricaoMedicamento } from './medico/entities/prescricao-medicamento.entity';
import { Template } from './medico/entities/template.entity';
import { FilaEspera } from './medico/entities/fila-espera.entity';

@Module({
  imports: [
    // Configuração de variáveis de ambiente
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      cache: true,
    }),

    // Configuração do Passport
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // Configuração do JWT
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'hemose-secret-key',
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '24h',
        },
      }),
      inject: [ConfigService],
      global: true,
    }),

    // Configuração do banco de dados TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get<string>('DATABASE_PATH') || 'hemose.db',
        entities: [
          User,
          Paciente,
          Agendamento,
          HistoricoClinico,
          EvolucaoPaciente,
          SinaisVitais,
          AnotacaoMedica,
          AuditLog,
          Exame,

          Atestado,
          Prescricao,
          PrescricaoMedicamento,
          Template,
          FilaEspera,
        ],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        logging: configService.get<string>('NODE_ENV') === 'development',
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),

    // Módulos da aplicação
    AuthModule,
    UsersModule,
    PacienteModule,
    AgendamentoModule,
    ProntuarioEletronicoModule,
    MedicoModule, // Adicionar o novo módulo médico
    ReportsModule,
    AuditModule,
    SeedModule,
  ],

  providers: [
    // Configurar o LoggingInterceptor como interceptor global
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },

    // Configurar o JwtAuthGuard como guard global
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },

    // Configurar o RolesGuard como guard global (depois do JWT)
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],

  controllers: [],
  exports: [],
})
export class AppModule {
  constructor(private configService: ConfigService) {
    // Log de inicialização com informações do ambiente
    console.log('🔧 Configuração do banco:', {
      type: 'sqlite',
      database: this.configService.get<string>('DATABASE_PATH') || 'hemose.db',
      synchronize: this.configService.get<string>('NODE_ENV') !== 'production',
    });

    console.log('🔐 Configuração JWT:', {
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '24h',
      hasSecret: !!this.configService.get<string>('JWT_SECRET'),
    });

    console.log(
      '🌍 Ambiente:',
      this.configService.get<string>('NODE_ENV') || 'development',
    );
    console.log('📋 Sistema de logging de endpoints ativado');
  }
}

/* 
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
