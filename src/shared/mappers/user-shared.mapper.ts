import { Injectable } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { ResponseFormat } from '../../common/interfaces/api.interface';
import {
  UserResponse,
  UserLegacyResponse,
  UserFullResponse,
  UserSimpleResponse,
} from '../../users/interfaces/user.interface';

@Injectable()
export class UserSharedMapper {
  /**
   * Mapea un usuario según el formato especificado
   */
  mapUserResponse(
    user: User,
    format: ResponseFormat = 'new',
  ): UserResponse | UserLegacyResponse | UserFullResponse | UserSimpleResponse {
    switch (format) {
      case 'legacy':
        return this.mapToLegacyFormat(user);
      case 'full':
        return this.mapToFullFormat(user);
      case 'simple':
        return this.mapToSimpleFormat(user);
      case 'new':
      default:
        return this.mapToNewFormat(user);
    }
  }

  /**
   * Formato nuevo (por defecto) - Sin roleId
   */
  private mapToNewFormat(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Formato legacy - Con roleId para compatibilidad
   */
  private mapToLegacyFormat(user: User): UserLegacyResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      roleId: user.roleId || '',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Formato completo - Con información del rol
   */
  private mapToFullFormat(user: User): UserFullResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role
        ? {
            id: user.role.id,
            name: user.role.name,
            description: user.role.description,
          }
        : undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Formato simple - Solo datos básicos
   */
  private mapToSimpleFormat(user: User): UserSimpleResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  /**
   * Mapea una lista de usuarios
   */
  mapUsersList(users: User[], format: ResponseFormat = 'new') {
    return users.map((user) => this.mapUserResponse(user, format));
  }

  /**
   * Mapea solo datos básicos para listas simples
   */
  mapUserBasic(user: User): UserSimpleResponse {
    return this.mapToSimpleFormat(user);
  }
}
