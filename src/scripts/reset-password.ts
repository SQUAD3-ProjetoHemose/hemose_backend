/**
 * Script para redefinir a senha de um usuário no banco de dados
 * 
 * Como usar:
 * 1. Compile o projeto: npm run build
 * 2. Execute o script: node dist/scripts/reset-password.js <email> <nova-senha>
 */

import { createConnection } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';
import { User } from '../users/entities/user.entity';

// Carrega as variáveis de ambiente
config();

async function resetPassword() {
  const args = process.argv.slice(2);
  
  if (args.length !== 2) {
    console.error('Uso: node reset-password.js <email> <nova-senha>');
    process.exit(1);
  }
  
  const [email, newPassword] = args;
  
  try {
    // Conecta ao banco de dados usando as variáveis de ambiente
    const connection = await createConnection({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User],
      synchronize: false,
    });
    
    const userRepository = connection.getRepository(User);
    
    // Busca o usuário pelo email
    const user = await userRepository.findOne({ where: { email } });
    
    if (!user) {
      console.error(`Usuário com email ${email} não encontrado.`);
      await connection.close();
      process.exit(1);
    }
    
    // Gera o hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Atualiza a senha do usuário
    user.senha = hashedPassword;
    await userRepository.save(user);
    
    console.log(`Senha redefinida com sucesso para o usuário ${user.nome} (${email}).`);
    
    await connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    process.exit(1);
  }
}

// Executa a função principal
resetPassword();
            
/*             
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
