/**
 * Interfaces específicas para el módulo de usuarios
 */

import { BaseEntity } from '../../common/interfaces/api.interface';

// Interfaz para respuestas de usuario
export interface UserResponse extends BaseEntity {
  email: string;
  name: string;
  phone?: string;
}

// Interfaz para respuestas legacy de usuario
export interface UserLegacyResponse extends UserResponse {
  roleId: string;
}

// Interfaz para respuestas completas de usuario
export interface UserFullResponse extends UserResponse {
  role?: {
    id: string;
    name: string;
    description: string;
  };
}

// Interfaz para respuestas simples de usuario
export interface UserSimpleResponse {
  id: string;
  name: string;
  email: string;
}

// Interfaz para crear usuario
export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
  roleId?: string;
}

// Interfaz para actualizar usuario
export interface UpdateUserRequest {
  name?: string;
  phone?: string;
  roleId?: string;
}
