import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';

// DTO para criar um novo log de auditoria
export class CreateAuditLogDto {
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsString()
  action: string;

  @IsString()
  resource: string;

  @IsOptional()
  @IsNumber()
  resourceId?: number;

  @IsOptional()
  details?: object;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  errorMessage?: string;
}

/* 
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/

   */
