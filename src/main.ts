// filepath: hemose_backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    
    // Habilitar CORS para o frontend
    app.enableCors({
      origin: 'http://localhost:3000', // URL do frontend
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });
    
    // Adicionar validação global
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true, // Remove propriedades não decoradas
      forbidNonWhitelisted: true, // Lança erro se propriedades não decoradas forem enviadas
      transform: true, // Transforma automaticamente os tipos
    }));
    
    await app.listen(3001); // Backend na porta 3001
    console.log('Application is running on: http://localhost:3001');
  } catch (error) {
    console.error('Error starting application:', error);
    process.exit(1);
  }
}

bootstrap();
            
/*             
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/