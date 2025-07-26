/**
 * Interfaces específicas para el módulo de roles
 */

import { BaseEntity } from '../../common/interfaces/api.interface';
import { UserSimpleResponse } from '../../users/interfaces/user.interface';

// Interfaz para respuestas de rol
export interface RoleResponse extends BaseEntity {
  name: string;
  description: string;
}

// Interfaz para respuestas legacy de rol
export interface RoleLegacyResponse extends RoleResponse {
  users: any[];
}

// Interfaz para respuestas completas de rol
export interface RoleFullResponse extends RoleResponse {
  users?: UserSimpleResponse[];
}

// Interfaz para respuestas simples de rol
export interface RoleSimpleResponse {
  id: string;
  name: string;
  description: string;
}

// Interfaz para crear rol
export interface CreateRoleRequest {
  name: string;
  description: string;
}

// Interfaz para actualizar rol
export interface UpdateRoleRequest {
  name?: string;
  description?: string;
}
