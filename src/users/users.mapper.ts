import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UserSharedMapper } from '../shared/mappers/user-shared.mapper';
import { BaseMapper } from '../common/mappers/base.mapper';
import {
  ApiResponse,
  ResponseFormat,
} from '../common/interfaces/api.interface';
import {
  UserResponse,
  UserLegacyResponse,
  UserFullResponse,
  UserSimpleResponse,
} from './interfaces/user.interface';

@Injectable()
export class UsersMapper {
  constructor(private readonly userSharedMapper: UserSharedMapper) {}

  /**
   * Mapea una lista de usuarios para el endpoint de listar usuarios
   */
  mapUsersList(
    users: User[],
    format: ResponseFormat = 'new',
  ): ApiResponse<
    | UserResponse[]
    | UserLegacyResponse[]
    | UserFullResponse[]
    | UserSimpleResponse[]
  > {
    const mappedData = this.userSharedMapper.mapUsersList(users, format);

    return BaseMapper.createSuccessResponse(
      mappedData,
      'Usuarios obtenidos exitosamente',
      '/users',
    );
  }

  /**
   * Mapea un usuario individual
   */
  mapUserDetail(
    user: User,
    format: ResponseFormat = 'new',
  ): ApiResponse<
    UserResponse | UserLegacyResponse | UserFullResponse | UserSimpleResponse
  > {
    const mappedData = this.userSharedMapper.mapUserResponse(user, format);

    return BaseMapper.createSuccessResponse(
      mappedData,
      'Usuario obtenido exitosamente',
      `/users/${user.id}`,
    );
  }

  /**
   * Mapea la respuesta de crear usuario
   */
  mapUserCreated(
    user: User,
    format: ResponseFormat = 'new',
  ): ApiResponse<
    UserResponse | UserLegacyResponse | UserFullResponse | UserSimpleResponse
  > {
    const mappedData = this.userSharedMapper.mapUserResponse(user, format);

    return BaseMapper.createSuccessResponse(
      mappedData,
      'Usuario creado exitosamente',
      '/users',
    );
  }

  /**
   * Mapea la respuesta de actualizar usuario
   */
  mapUserUpdated(
    user: User,
    format: ResponseFormat = 'new',
  ): ApiResponse<
    UserResponse | UserLegacyResponse | UserFullResponse | UserSimpleResponse
  > {
    const mappedData = this.userSharedMapper.mapUserResponse(user, format);

    return BaseMapper.createSuccessResponse(
      mappedData,
      'Usuario actualizado exitosamente',
      `/users/${user.id}`,
    );
  }

  /**
   * Mapea la respuesta de eliminar usuario
   */
  mapUserDeleted(userId: string): ApiResponse<{ id: string }> {
    return BaseMapper.createSuccessResponse(
      { id: userId },
      'Usuario eliminado exitosamente',
      `/users/${userId}`,
    );
  }
}
