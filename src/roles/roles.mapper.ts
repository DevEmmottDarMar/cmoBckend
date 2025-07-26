import { Injectable } from '@nestjs/common';
import { Role } from '../entities/role.entity';
import { RoleSharedMapper } from '../shared/mappers/role-shared.mapper';
import { BaseMapper } from '../common/mappers/base.mapper';
import {
  ApiResponse,
  ResponseFormat,
} from '../common/interfaces/api.interface';
import {
  RoleResponse,
  RoleLegacyResponse,
  RoleFullResponse,
  RoleSimpleResponse,
} from './interfaces/role.interface';

@Injectable()
export class RolesMapper {
  constructor(private readonly roleSharedMapper: RoleSharedMapper) {}

  /**
   * Mapea una lista de roles para el endpoint de listar roles
   */
  mapRolesList(
    roles: Role[],
    format: ResponseFormat = 'simple',
  ): ApiResponse<
    | RoleResponse[]
    | RoleLegacyResponse[]
    | RoleFullResponse[]
    | RoleSimpleResponse[]
  > {
    const mappedData = this.roleSharedMapper.mapRolesList(roles, format);

    return BaseMapper.createSuccessResponse(
      mappedData,
      'Roles obtenidos exitosamente',
      '/roles',
    );
  }

  /**
   * Mapea un rol individual
   */
  mapRoleDetail(
    role: Role,
    format: ResponseFormat = 'simple',
  ): ApiResponse<
    RoleResponse | RoleLegacyResponse | RoleFullResponse | RoleSimpleResponse
  > {
    const mappedData = this.roleSharedMapper.mapRoleResponse(role, format);

    return BaseMapper.createSuccessResponse(
      mappedData,
      'Rol obtenido exitosamente',
      `/roles/${role.id}`,
    );
  }

  /**
   * Mapea la respuesta de crear rol
   */
  mapRoleCreated(
    role: Role,
    format: ResponseFormat = 'simple',
  ): ApiResponse<
    RoleResponse | RoleLegacyResponse | RoleFullResponse | RoleSimpleResponse
  > {
    const mappedData = this.roleSharedMapper.mapRoleResponse(role, format);

    return BaseMapper.createSuccessResponse(
      mappedData,
      'Rol creado exitosamente',
      '/roles',
    );
  }

  /**
   * Mapea la respuesta de actualizar rol
   */
  mapRoleUpdated(
    role: Role,
    format: ResponseFormat = 'simple',
  ): ApiResponse<
    RoleResponse | RoleLegacyResponse | RoleFullResponse | RoleSimpleResponse
  > {
    const mappedData = this.roleSharedMapper.mapRoleResponse(role, format);

    return BaseMapper.createSuccessResponse(
      mappedData,
      'Rol actualizado exitosamente',
      `/roles/${role.id}`,
    );
  }

  /**
   * Mapea la respuesta de eliminar rol
   */
  mapRoleDeleted(roleId: string): ApiResponse<{ id: string }> {
    return BaseMapper.createSuccessResponse(
      { id: roleId },
      'Rol eliminado exitosamente',
      `/roles/${roleId}`,
    );
  }
}
