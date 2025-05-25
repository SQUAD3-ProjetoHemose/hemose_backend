import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuditService } from '../../audit/services/audit.service';
import { AUDIT_METADATA_KEY, AuditOptions } from '../decorators/audit.decorator';

// Interceptor global para auditoria automática
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private auditService: AuditService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const auditOptions = this.reflector.get<AuditOptions>(
      AUDIT_METADATA_KEY,
      context.getHandler(),
    );

    // Se não há configuração de auditoria, prosseguir normalmente
    if (!auditOptions) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    // Extrair informações da requisição
    const user = request.user;
    const method = request.method;
    const url = request.url;
    const ip = this.getClientIP(request);
    const userAgent = request.headers['user-agent'] || 'unknown';

    // Determinar ação e recurso
    const action = auditOptions.action || this.getActionFromMethod(method);
    const resource = auditOptions.resource || this.getResourceFromUrl(url);

    // Preparar dados base da auditoria
    const baseAuditData = {
      userId: user?.id,
      action,
      resource,
      ipAddress: ip,
      userAgent,
      details: this.buildAuditDetails(request, auditOptions),
    };

    // Extrair ID do recurso da URL ou corpo da requisição
    const resourceId = this.extractResourceId(request, auditOptions);
    if (resourceId) {
      baseAuditData['resourceId'] = resourceId;
    }

    return next.handle().pipe(
      tap((data) => {
        // Auditoria de sucesso
        const auditData = {
          ...baseAuditData,
          status: 'SUCCESS',
          ...(auditOptions.includeResponse && data ? { details: { ...baseAuditData.details, response: data } } : {}),
        };
        
        this.auditService.createLog(auditData);
      }),
      catchError((error) => {
        // Auditoria de erro
        const auditData = {
          ...baseAuditData,
          status: 'ERROR',
          errorMessage: error.message,
          details: {
            ...baseAuditData.details,
            error: {
              message: error.message,
              statusCode: error.status || 500,
            },
          },
        };
        
        this.auditService.createLog(auditData);
        throw error;
      }),
    );
  }

  // Mapear método HTTP para ação
  private getActionFromMethod(method: string): string {
    const methodMapping: { [key: string]: string } = {
      'GET': 'READ',
      'POST': 'create',
      'PUT': 'update',
      'PATCH': 'update',
      'DELETE': 'delete',
    };

    return methodMapping[method.toUpperCase()] || method.toLowerCase();
  }

  // Extrair recurso da URL
  private getResourceFromUrl(url: string): string {
    try {
      const pathSegments = url.split('/').filter(segment => segment && segment !== 'api');
      if (pathSegments.length > 0) {
        return pathSegments[0];
      }
      return 'unknown';
    } catch {
      return 'unknown';
    }
  }

  // Extrair IP do cliente
  private getClientIP(request: any): string {
    return request.ip || 
           request.connection?.remoteAddress || 
           request.socket?.remoteAddress ||
           request.headers['x-forwarded-for']?.split(',')[0] ||
           'unknown';
  }

  // Construir detalhes da auditoria
  private buildAuditDetails(request: any, options: AuditOptions): object {
    const details: any = {
      method: request.method,
      url: request.url,
      timestamp: new Date().toISOString(),
    };

    // Incluir corpo da requisição se habilitado
    if (options.includeBody && request.body) {
      const body = { ...request.body };
      
      // Remover campos sensíveis
      if (options.excludeFields) {
        options.excludeFields.forEach(field => {
          delete body[field];
        });
      }
      
      // Sempre remover campos de senha
      delete body.password;
      delete body.senha;
      delete body.passwordConfirmation;
      
      details.requestBody = body;
    }

    // Incluir parâmetros da query
    if (Object.keys(request.query).length > 0) {
      details.queryParams = request.query;
    }

    // Incluir parâmetros da rota
    if (Object.keys(request.params).length > 0) {
      details.routeParams = request.params;
    }

    return details;
  }

  // Extrair ID do recurso
  private extractResourceId(request: any, options: AuditOptions): number | undefined {
    // Tentar extrair do parâmetro 'id' na rota
    if (request.params?.id) {
      const id = parseInt(request.params.id);
      if (!isNaN(id)) {
        return id;
      }
    }

    // Tentar extrair do corpo da requisição (para operações de criação)
    if (request.body?.id) {
      const id = parseInt(request.body.id);
      if (!isNaN(id)) {
        return id;
      }
    }

    // Para pacientes, tentar extrair pacienteId
    if (request.params?.pacienteId) {
      const id = parseInt(request.params.pacienteId);
      if (!isNaN(id)) {
        return id;
      }
    }

    return undefined;
  }
}

/* 
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/

   */
