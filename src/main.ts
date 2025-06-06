/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  try {
    // Criar aplicação com configurações otimizadas para produção
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);
    // Configurar CORS com origens específicas e seguras
    const allowedOrigins = [
      'https://hemose.vercel.app',
      'https://www.hemose.vercel.app',
      'https://hemose-backend-19dc5c1c172f.herokuapp.com',
      ...(process.env.NODE_ENV !== 'production'
        ? ['http://localhost:3000']
        : []),
    ];

    app.enableCors({
      origin: (origin, callback) => {
        // Permitir requisições sem origin (ex: mobile apps, Postman)
        if (!origin) return callback(null, true);

        // Verificar se está na lista de origens permitidas
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        // Permitir qualquer domínio que termine com .vercel.app
        if (origin.endsWith('.vercel.app')) {
          return callback(null, true);
        }

        // Em desenvolvimento, permitir qualquer localhost
        if (
          process.env.NODE_ENV !== 'production' &&
          origin.includes('localhost')
        ) {
          return callback(null, true);
        }

        return callback(new Error('Não permitido pelo CORS'), false);
      },
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      credentials: true,
      optionsSuccessStatus: 200,
      preflightContinue: false,
    });

    // Configurar validação global com tratamento de erros robusto
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Remove propriedades não decoradas
        forbidNonWhitelisted: true, // Rejeita propriedades não permitidas
        transform: true, // Transforma tipos automaticamente
        disableErrorMessages: process.env.NODE_ENV === 'production',
        validateCustomDecorators: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    // Configurar porta obrigatória do Heroku
    const port = parseInt(process.env.PORT as string, 10) || 3001;

    // Host obrigatório para Heroku (0.0.0.0)
    const host = '0.0.0.0';

    // Rotas essenciais para monitoramento e funcionamento
    const httpAdapter = app.getHttpAdapter();

    // Health check obrigatório para evitar crashes
    httpAdapter.get('/health', (req: any, res: any) => {
      res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
        memory: process.memoryUsage(),
        version: process.version,
      });
    });

    // Tratar favicon para evitar erro 404/503
    httpAdapter.get('/favicon.ico', (req: any, res: any) => {
      res.status(204).end();
    });

    // Rota raiz para evitar crashes na home
    httpAdapter.get('/', (req: any, res: any) => {
      res.status(200).json({
        message: 'Hemose API está funcionando!',
        status: 'online',
        timestamp: new Date().toISOString(),
      });
    });

    // Inicializar servidor com timeout para evitar travamentos
    const server = await app.listen(port, host);

    // Configurar timeouts para produção
    server.setTimeout(30000); // 30 segundos timeout
    server.keepAliveTimeout = 61000; // Keep-alive para load balancers
    server.headersTimeout = 62000; // Headers timeout

    console.log(`🚀 Aplicação iniciada na porta ${port}`);
    console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`⚡ Servidor Heroku online e funcionando`);
  } catch (error) {
    console.error('❌ ERRO CRÍTICO na inicialização:', error);
    console.error('📊 Stack completo:', error.stack);
    console.error('💾 Memória disponível:', process.memoryUsage());

    // Estratégia de recuperação em produção
    if (process.env.NODE_ENV === 'production') {
      console.log('🔄 Tentativa de recuperação em 3 segundos...');
      setTimeout(() => {
        process.exit(1); // Heroku reiniciará automaticamente
      }, 3000);
    } else {
      process.exit(1);
    }
  }
}

// Tratamento robusto de erros não capturados
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('❌ Promise rejeitada não tratada:', {
    reason: reason?.message || reason,
    stack: reason?.stack,
    promise: promise.toString().substring(0, 100),
  });

  // Em produção, não quebrar a aplicação por promises rejeitadas
  if (process.env.NODE_ENV === 'production') {
    console.log('⚠️ Continuando execução apesar do erro...');
  }
});

process.on('uncaughtException', (error: Error) => {
  console.error('❌ Exceção não capturada crítica:', {
    message: error.message,
    stack: error.stack,
    name: error.name,
  });

  // Sair imediatamente em exceções não capturadas
  console.log('🔥 Encerrando processo devido a erro crítico...');
  process.exit(1);
});

// Tratamento de sinais do sistema (Heroku)
process.on('SIGTERM', () => {
  console.log('📡 Sinal SIGTERM recebido, encerrando graciosamente...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📡 Sinal SIGINT recebido, encerrando graciosamente...');
  process.exit(0);
});

// Inicializar aplicação
bootstrap().catch((error) => {
  console.error('❌ Falha total na inicialização:', error);
  process.exit(1);
});

/*             
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
