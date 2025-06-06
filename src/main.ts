/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log'], // Adicionar logs para debug no Heroku
    });

    const configService = app.get(ConfigService);

    // Configurar CORS para produção - permitir o domínio do Heroku
    const allowedOrigins = [
      'https://hemose-backend-19dc5c1c172f.herokuapp.com',
      'https://seudominio.com',
      'http://localhost:3000',
      'https:https://hemose.vercel.app',
      'https://hemose.vercel.app',
      ...(process.env.NODE_ENV !== 'production'
        ? ['http://localhost:3000']
        : []),
    ];

    app.enableCors({
      origin: allowedOrigins,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      optionsSuccessStatus: 200,
    });

    // Adicionar validação global
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Remove propriedades não decoradas
        forbidNonWhitelisted: true, // Lança erro se propriedades não decoradas forem enviadas
        transform: true, // Transforma automaticamente os tipos
        disableErrorMessages: process.env.NODE_ENV === 'production',
      }),
    );

    // CRÍTICO: Heroku define a porta via variável de ambiente
    const port = process.env.PORT || 3001;

    // CRÍTICO: Heroku requer bind em 0.0.0.0, não localhost
    const host = '0.0.0.0';

    // Adicionar rota de health check para evitar crashes
    app.getHttpAdapter().get('/health', (req, res) => {
      res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      });
    });

    // Adicionar tratamento para favicon.ico que está causando o erro
    app.getHttpAdapter().get('/favicon.ico', (req, res) => {
      res.status(204).end(); // No Content - evita erro 404
    });

    await app.listen(port, host);

    console.log(`🚀 Aplicação rodando na porta ${port}`);
    console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`⚡ Heroku Dyno iniciado com sucesso`);
  } catch (error) {
    console.error('❌ Erro crítico ao iniciar aplicação:', error);
    console.error('Stack trace:', error.stack);
    // Em produção, tentar reiniciar após delay
    if (process.env.NODE_ENV === 'production') {
      setTimeout(() => {
        console.log('🔄 Tentando reiniciar aplicação...');
        process.exit(1);
      }, 5000);
    } else {
      process.exit(1);
    }
  }
}

// Capturar erros não tratados que podem causar crash
process.on('unhandledRejection', (reason, promise) => {
  console.error(
    '❌ Promise rejeitada não tratada em:',
    promise,
    'motivo:',
    reason,
  );
});

process.on('uncaughtException', (error) => {
  console.error('❌ Exceção não capturada:', error);
  process.exit(1);
});

void bootstrap();

/*             
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
