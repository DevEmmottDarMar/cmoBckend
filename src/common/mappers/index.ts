// Exportar mappers base
export * from './base.mapper';

// Exportar mappers específicos con alias para evitar conflictos
export * from './user.mapper';
export {
  RoleMapper,
  RoleResponseDto,
  RoleSimpleResponseDto,
  RoleLegacyResponseDto,
  RoleUserResponseDto,
} from './role.mapper';

// Re-exportar tipos comunes para facilitar el uso
export type {
  ApiResponse,
  ApiErrorResponse,
  PaginatedResponse,
} from '../interfaces/api.interface';
