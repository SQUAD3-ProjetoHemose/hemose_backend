import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';

// Chave para metadados de auditoria
export const AUDIT_METADATA_KEY = 'audit';

// Interface para configuração de auditoria
export interface AuditOptions {
  action?: string;
  resource?: string;
  includeBody?: boolean;
  includeResponse?: boolean;
  excludeFields?: string[];
}

// Decorator para marcar métodos que devem ser auditados
export const Audit = (options: AuditOptions = {}) =>
  SetMetadata(AUDIT_METADATA_KEY, options);

// Decorator para extrair dados do usuário autenticado
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

// Decorator para extrair IP do cliente
export const ClientIP = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return (
      request.ip ||
      request.connection.remoteAddress ||
      request.socket.remoteAddress ||
      (request.connection.socket
        ? request.connection.socket.remoteAddress
        : null)
    );
  },
);

// Decorator para extrair User-Agent
export const UserAgent = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['user-agent'] || 'unknown';
  },
);

/* 
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/

   */
