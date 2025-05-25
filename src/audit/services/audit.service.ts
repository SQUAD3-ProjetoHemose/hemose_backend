import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';
import { CreateAuditLogDto } from '../dto/create-audit-log.dto';
import { AuditQueryDto } from '../dto/audit-query.dto';

// Serviço responsável pela gestão de logs de auditoria
@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditRepository: Repository<AuditLog>,
  ) {}

  // Cria um novo log de auditoria
  async createLog(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog> {
    const auditLog = this.auditRepository.create(createAuditLogDto);
    return await this.auditRepository.save(auditLog);
  }

  // Busca logs com filtros e paginação
  async findLogs(query: AuditQueryDto) {
    const {
      page = 1,
      limit = 50,
      userId,
      action,
      resource,
      startDate,
      endDate,
      status,
    } = query;

    const queryBuilder = this.auditRepository
      .createQueryBuilder('audit')
      .leftJoinAndSelect('audit.user', 'user')
      .orderBy('audit.createdAt', 'DESC');

    // Aplicar filtros condicionalmente
    if (userId) {
      queryBuilder.andWhere('audit.userId = :userId', { userId });
    }

    if (action) {
      queryBuilder.andWhere('audit.action = :action', { action });
    }

    if (resource) {
      queryBuilder.andWhere('audit.resource = :resource', { resource });
    }

    if (status) {
      queryBuilder.andWhere('audit.status = :status', { status });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere('audit.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    // Paginação
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [logs, total] = await queryBuilder.getManyAndCount();

    return {
      data: logs,
      pagination: {
        current_page: page,
        per_page: limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  // Busca estatísticas de auditoria
  async getAuditStats(startDate?: Date, endDate?: Date) {
    const queryBuilder = this.auditRepository.createQueryBuilder('audit');

    if (startDate && endDate) {
      queryBuilder.where('audit.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    // Total de ações por tipo
    const actionStats = await queryBuilder
      .select('audit.action', 'action')
      .addSelect('COUNT(*)', 'count')
      .groupBy('audit.action')
      .getRawMany();

    // Total de ações por usuário (top 10)
    const userStats = await this.auditRepository
      .createQueryBuilder('audit')
      .leftJoin('audit.user', 'user')
      .select('user.nome', 'userName')
      .addSelect('COUNT(*)', 'count')
      .where(
        startDate && endDate
          ? 'audit.createdAt BETWEEN :startDate AND :endDate'
          : '1=1',
        { startDate, endDate },
      )
      .groupBy('audit.userId')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    // Total de ações por recurso
    const resourceStats = await queryBuilder
      .clone()
      .select('audit.resource', 'resource')
      .addSelect('COUNT(*)', 'count')
      .groupBy('audit.resource')
      .getRawMany();

    return {
      actionStats,
      userStats,
      resourceStats,
    };
  }

  // Busca logs de um usuário específico
  async getUserAuditLogs(userId: number, limit: number = 100) {
    return await this.auditRepository.find({
      where: { userId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  // Limpa logs antigos (para manutenção)
  async cleanOldLogs(daysToKeep: number = 90) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await this.auditRepository
      .createQueryBuilder()
      .delete()
      .where('createdAt < :cutoffDate', { cutoffDate })
      .execute();

    return { deletedCount: result.affected };
  }
}

/* 
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/

   */
