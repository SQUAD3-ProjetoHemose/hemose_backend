import { LogLevel } from '@nestjs/common';

export interface LoggerConfig {
  levels: LogLevel[];
  enableRequestBody: boolean;
  enableResponseBody: boolean;
  maxBodySize: number;
  excludePaths: string[];
}

export const getLoggerConfig = (): LoggerConfig => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return {
    // Níveis de log baseado no ambiente
    levels: isDevelopment 
      ? ['log', 'error', 'warn', 'debug', 'verbose'] 
      : ['log', 'error', 'warn'],
    
    // Habilitar log do body das requisições
    enableRequestBody: isDevelopment,
    
    // Habilitar log do body das respostas (cuidado com dados sensíveis)
    enableResponseBody: false,
    
    // Tamanho máximo do body para logar (em caracteres)
    maxBodySize: 1000,
    
    // Paths para excluir do log (ex: health check)
    excludePaths: ['/health', '/favicon.ico'],
  };
};

/* 
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/