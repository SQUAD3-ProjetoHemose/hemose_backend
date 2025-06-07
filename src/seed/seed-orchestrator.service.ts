import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { AgendamentosSeedService } from './agendamentos.seed';
import { PacientesSeedService } from './pacientes.seed';
import { ProntuariosSeedService } from './prontuarios.seed';
import { TemplatesSeedService } from './templates.seed';
import { UsersSeedService } from './users.seed';

@Injectable()
export class SeedOrchestrator implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedOrchestrator.name);

  constructor(
    private readonly usersSeedService: UsersSeedService,
    private readonly pacientesSeedService: PacientesSeedService,
    private readonly agendamentosSeedService: AgendamentosSeedService,
    private readonly templatesSeedService: TemplatesSeedService,
    private readonly prontuariosSeedService: ProntuariosSeedService,
  ) {}

  /**
   * Executado automaticamente quando a aplicação inicializa
   * Coordena a execução de todos os seeds na ordem correta
   */
  async onApplicationBootstrap() {
    const isProduction = process.env.NODE_ENV === 'production';

    if (isProduction) {
      this.logger.log('🚫 Seeds desabilitados em produção');
      return;
    }

    this.logger.log(
      '🌱 Iniciando população do banco de dados com dados de exemplo...',
    );
    const startTime = Date.now();

    try {
      // Executar seeds na ordem correta (respeitando dependências)

      // 1. Primeiro criar usuários (não dependem de nada)
      await this.usersSeedService.seed();

      // 2. Criar pacientes (não dependem de usuários)
      await this.pacientesSeedService.seed();

      // 3. Criar templates (não dependem de outros dados)
      await this.templatesSeedService.seed();

      // 4. Criar agendamentos (dependem de usuários e pacientes)
      await this.agendamentosSeedService.seed();

      // 5. Criar dados de prontuários (dependem de usuários e pacientes)
      await this.prontuariosSeedService.seed();

      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;

      this.logger.log(`✅ População do banco concluída em ${duration}s`);
      this.logger.log(
        '📊 Banco de dados populado com dados de exemplo para desenvolvimento',
      );
    } catch (error) {
      this.logger.error('❌ Erro durante a população do banco:', error);
    }
  }

  /**
   * Método para executar seeds manualmente se necessário
   */
  async runSeedsManually() {
    this.logger.log('🔄 Executando seeds manualmente...');
    await this.onApplicationBootstrap();
  }

  /**
   * Método para resetar e recriar todos os dados (cuidado!)
   */
  async resetAndReseedDatabase() {
    this.logger.warn('⚠️  ATENÇÃO: Resetando e recriando dados do banco!');

    // Este método pode ser expandido futuramente para limpar dados antes de recriar
    // Por enquanto, apenas executa os seeds novamente
    await this.runSeedsManually();
  }
}

/*             
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
