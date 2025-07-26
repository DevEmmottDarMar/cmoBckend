import { Injectable } from '@nestjs/common';
import { Role } from '../../entities/role.entity';
import { ResponseFormat } from '../../common/interfaces/api.interface';
import {
  RoleResponse,
  RoleLegacyResponse,
  RoleFullResponse,
  RoleSimpleResponse,
} from '../../roles/interfaces/role.interface';
import { UserSimpleResponse } from '../../users/interfaces/user.interface';

@Injectable()
export class RoleSharedMapper {
  /**
   * Mapea un rol según el formato especificado
   */
  mapRoleResponse(
    role: Role,
    format: ResponseFormat = 'simple',
  ): RoleResponse | RoleLegacyResponse | RoleFullResponse | RoleSimpleResponse {
    switch (format) {
      case 'legacy':
        return this.mapToLegacyFormat(role);
      case 'full':
        return this.mapToFullFormat(role);
      case 'simple':
      default:
        return this.mapToSimpleFormat(role);
    }
  }

  /**
   * Formato simple (por defecto) - Solo información básica
   */
  private mapToSimpleFormat(role: Role): RoleSimpleResponse {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
    };
  }

  /**
   * Formato nuevo - Información completa sin usuarios
   */
  private mapToNewFormat(role: Role): RoleResponse {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }

  /**
   * Formato legacy - Con objeto users vacío para compatibilidad
   */
  private mapToLegacyFormat(role: Role): RoleLegacyResponse {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      users: [],
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }

  /**
   * Formato completo - Con información de usuarios
   */
  private mapToFullFormat(role: Role): RoleFullResponse {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      users: role.users
        ? role.users.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
          }))
        : [],
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }

  /**
   * Mapea una lista de roles
   */
  mapRolesList(roles: Role[], format: ResponseFormat = 'simple') {
    return roles.map((role) => this.mapRoleResponse(role, format));
  }

  /**
   * Mapea solo datos básicos para listas simples
   */
  mapRoleBasic(role: Role): RoleSimpleResponse {
    return this.mapToSimpleFormat(role);
  }
}
