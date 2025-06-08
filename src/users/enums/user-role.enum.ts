export enum UserRole {
  ADMIN = 'admin',
  MEDICO = 'medico',
  ENFERMEIRA = 'enfermeira',
  RECEPCIONISTA = 'recepcionista',
  TECNICA_ENFERMAGEM = 'tecnica_enfermagem', // Nova role
}

// Função auxiliar para validar roles
export function isValidUserRole(role: string): role is UserRole {
  return Object.values(UserRole).includes(role as UserRole);
}

// Array de todas as roles para facilitar validações
export const USER_ROLES = Object.values(UserRole);

// Função para obter o nome amigável da role
export function getUserRoleName(role: UserRole): string {
  const roleNames = {
    [UserRole.ADMIN]: 'Administrador',
    [UserRole.MEDICO]: 'Médico',
    [UserRole.ENFERMEIRA]: 'Enfermeira',
    [UserRole.RECEPCIONISTA]: 'Recepcionista',
    [UserRole.TECNICA_ENFERMAGEM]: 'Técnica de Enfermagem', // Nome amigável para nova role
  };
  return roleNames[role] || role;
}

/* 
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
