import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';
import { getLoggerConfig, LoggerConfig } from '../../config/logger.config';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);
  private readonly config: LoggerConfig;

  constructor() {
    this.config = getLoggerConfig();
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();
    
    const { method, url, ip, headers } = request;
    
    // Verificar se deve excluir este path do log
    if (this.shouldExcludePath(url)) {
      return next.handle();
    }

    const userAgent = headers['user-agent'] || '';
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    // Log da requisição recebida
    this.logger.log(
      `📥 [${requestId}] [${method}] ${url} - IP: ${ip} - UA: ${userAgent.substring(0, 50)}...`
    );

    // Log do body se habilitado
    if (this.config.enableRequestBody && request.body && Object.keys(request.body).length > 0) {
      const sanitizedBody = this.sanitizeBody(request.body);
      const bodyStr = JSON.stringify(sanitizedBody);
      
      if (bodyStr.length <= this.config.maxBodySize) {
        this.logger.debug(`📝 [${requestId}] Body: ${bodyStr}`);
      } else {
        this.logger.debug(`📝 [${requestId}] Body: ${bodyStr.substring(0, this.config.maxBodySize)}... (truncated)`);
      }
    }

    // Log dos query params
    if (request.query && Object.keys(request.query).length > 0) {
      this.logger.debug(`🔍 [${requestId}] Query: ${JSON.stringify(request.query)}`);
    }

    // Log dos headers importantes (autorização, content-type, etc.)
    const importantHeaders = this.extractImportantHeaders(headers);
    if (Object.keys(importantHeaders).length > 0) {
      this.logger.debug(`📋 [${requestId}] Headers: ${JSON.stringify(importantHeaders)}`);
    }

    return next.handle().pipe(
      tap((responseData) => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        // Log da resposta de sucesso
        this.logger.log(
          `📤 [${requestId}] [${method}] ${url} - ${response.statusCode} - ${duration}ms`
        );

        // Log do body da resposta se habilitado
        if (this.config.enableResponseBody && responseData) {
          const responseStr = JSON.stringify(responseData);
          if (responseStr.length <= this.config.maxBodySize) {
            this.logger.debug(`📦 [${requestId}] Response: ${responseStr}`);
          } else {
            this.logger.debug(`📦 [${requestId}] Response: ${responseStr.substring(0, this.config.maxBodySize)}... (truncated)`);
          }
        }

        // Log de performance para requisições lentas
        if (duration > 1000) {
          this.logger.warn(`🐌 [${requestId}] Requisição lenta detectada: ${duration}ms`);
        }
      }),
      catchError((error) => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        // Log de erro
        this.logger.error(
          `❌ [${requestId}] [${method}] ${url} - ${error.status || 500} - ${duration}ms - Error: ${error.message}`
        );

        // Log detalhado para erros 5xx
        if (!error.status || error.status >= 500) {
          this.logger.error(`🔥 [${requestId}] Stack: ${error.stack}`);
        }

        // Log de validação para erros 4xx
        if (error.status >= 400 && error.status < 500 && error.response) {
          this.logger.debug(`🚫 [${requestId}] Validation: ${JSON.stringify(error.response)}`);
        }

        throw error;
      })
    );
  }

  /**
   * Gera um ID único para cada requisição
   */
  private generateRequestId(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  /**
   * Verifica se o path deve ser excluído do log
   */
  private shouldExcludePath(url: string): boolean {
    return this.config.excludePaths.some(path => url.startsWith(path));
  }

  /**
   * Remove campos sensíveis do body
   */
  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const sensitiveFields = [
      'password', 'senha', 'token', 'secret', 'key', 
      'authorization', 'auth', 'apiKey', 'apiSecret'
    ];
    
    const sanitized = Array.isArray(body) ? [...body] : { ...body };

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '***HIDDEN***';
      }
    }

    return sanitized;
  }

  /**
   * Extrai headers importantes para log
   */
  private extractImportantHeaders(headers: any): any {
    const important = {};
    const importantKeys = [
      'content-type', 'accept', 'user-agent', 
      'x-forwarded-for', 'x-real-ip', 'origin'
    ];

    for (const key of importantKeys) {
      if (headers[key]) {
        important[key] = headers[key];
      }
    }

    // Logar se há autorização (mas não o valor)
    if (headers.authorization) {
      important['has-authorization'] = true;
    }

    return important;
  }
}

/* 
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/