/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { config } from 'dotenv';
import { createConnection } from 'typeorm';
import { Agendamento } from '../agendamentos/entities/agendamento.entity';

// Carregar variáveis de ambiente
config();

async function migrateAgendamentos() {
  console.log('🔄 Iniciando migração de agendamentos...');

  try {
    // Conectar ao banco usando SQLite
    const connection = await createConnection({
      type: 'sqlite',
      database: process.env.DATABASE_PATH || 'hemose.db',
      entities: [Agendamento],
      synchronize: false, // Não fazer sync automático
    });

    const agendamentoRepository = connection.getRepository(Agendamento);

    // Buscar todos os agendamentos
    const agendamentos = await agendamentoRepository.query(
      'SELECT * FROM agendamentos WHERE hora IS NULL OR hora = ""',
    );

    console.log(
      `📊 Encontrados ${agendamentos.length} agendamentos para corrigir`,
    );

    // Atualizar cada agendamento com hora padrão
    for (const agendamento of agendamentos) {
      const horaDefault = '08:00'; // Hora padrão

      await agendamentoRepository.query(
        'UPDATE agendamentos SET hora = ? WHERE id = ?',
        [horaDefault, agendamento.id],
      );
    }

    console.log('✅ Migração concluída com sucesso!');
    await connection.close();
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  void migrateAgendamentos();
}

export { migrateAgendamentos };

/*             
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
