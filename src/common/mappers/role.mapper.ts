import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../entities/role.entity';
import { User } from '../../entities/user.entity';
import { BaseMapper } from './base.mapper';
import { ApiResponse } from '../interfaces/api.interface';

// DTO para respuesta de usuario en contexto de rol
export class RoleUserResponseDto {
  @ApiProperty({ description: 'ID único del usuario' })
  id: string;

  @ApiProperty({ description: 'Email del usuario' })
  email: string;

  @ApiProperty({ description: 'Nombre del usuario' })
  name: string;

  @ApiProperty({ description: 'Teléfono del usuario', required: false })
  phone?: string;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  updatedAt: Date;
}

// DTO para respuesta de rol con información completa
export class RoleResponseDto {
  @ApiProperty({ description: 'ID único del rol' })
  id: string;

  @ApiProperty({ description: 'Nombre del rol' })
  name: string;

  @ApiProperty({ description: 'Descripción del rol' })
  description: string;

  @ApiProperty({
    description: 'Usuarios asociados al rol',
    type: [RoleUserResponseDto],
  })
  users: RoleUserResponseDto[];

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  updatedAt: Date;
}

// DTO para respuesta de rol sin usuarios (más ligero)
export class RoleSimpleResponseDto {
  @ApiProperty({ description: 'ID único del rol' })
  id: string;

  @ApiProperty({ description: 'Nombre del rol' })
  name: string;

  @ApiProperty({ description: 'Descripción del rol' })
  description: string;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  updatedAt: Date;
}

// DTO para respuesta de rol legado (compatible con versiones anteriores)
export class RoleLegacyResponseDto {
  @ApiProperty({ description: 'ID único del rol' })
  id: string;

  @ApiProperty({ description: 'Nombre del rol' })
  name: string;

  @ApiProperty({ description: 'Descripción del rol' })
  description: string;

  @ApiProperty({
    description: 'Usuarios asociados (objeto vacío en versión legada)',
  })
  users: Record<string, never>;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  updatedAt: Date;
}

export class RoleMapper extends BaseMapper {
  // Mapear entidad Role a RoleResponseDto (con usuarios)
  static toRoleResponse(role: Role): RoleResponseDto {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      users: role.users
        ? role.users.map((user) => this.toUserResponse(user))
        : [],
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }

  // Mapear entidad Role a RoleSimpleResponseDto (sin usuarios)
  static toRoleSimpleResponse(role: Role): RoleSimpleResponseDto {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }

  // Mapear entidad Role a RoleLegacyResponseDto (compatible con versiones anteriores)
  static toRoleLegacyResponse(role: Role): RoleLegacyResponseDto {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      users: {},
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }

  // Mapear entidad User a RoleUserResponseDto
  static toUserResponse(user: User): RoleUserResponseDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  // Mapear array de roles a respuesta simple
  static toRoleSimpleResponseList(roles: Role[]): RoleSimpleResponseDto[] {
    return roles.map((role) => this.toRoleSimpleResponse(role));
  }

  // Mapear array de roles a respuesta completa
  static toRoleResponseList(roles: Role[]): RoleResponseDto[] {
    return roles.map((role) => this.toRoleResponse(role));
  }

  // Mapear array de roles a respuesta legada
  static toRoleLegacyResponseList(roles: Role[]): RoleLegacyResponseDto[] {
    return roles.map((role) => this.toRoleLegacyResponse(role));
  }

  // Crear respuesta exitosa para un rol
  static createRoleResponse(
    role: Role,
    message: string = 'Rol obtenido exitosamente',
    path: string = '/roles',
  ): ApiResponse<RoleResponseDto> {
    return this.createSuccessResponse(this.toRoleResponse(role), message, path);
  }

  // Crear respuesta exitosa para un rol simple
  static createRoleSimpleResponse(
    role: Role,
    message: string = 'Rol obtenido exitosamente',
    path: string = '/roles',
  ): ApiResponse<RoleSimpleResponseDto> {
    return this.createSuccessResponse(
      this.toRoleSimpleResponse(role),
      message,
      path,
    );
  }

  // Crear respuesta exitosa para lista de roles
  static createRoleListResponse(
    roles: Role[],
    message: string = 'Roles obtenidos exitosamente',
    path: string = '/roles',
  ): ApiResponse<RoleResponseDto[]> {
    return this.createSuccessResponse(
      this.toRoleResponseList(roles),
      message,
      path,
    );
  }

  // Crear respuesta exitosa para lista de roles simples
  static createRoleSimpleListResponse(
    roles: Role[],
    message: string = 'Roles obtenidos exitosamente',
    path: string = '/roles',
  ): ApiResponse<RoleSimpleResponseDto[]> {
    return this.createSuccessResponse(
      this.toRoleSimpleResponseList(roles),
      message,
      path,
    );
  }

  // Crear respuesta legada para un rol
  static createRoleLegacyResponse(
    role: Role,
    message: string = 'Rol obtenido exitosamente',
    path: string = '/roles',
  ): ApiResponse<RoleLegacyResponseDto> {
    return this.createSuccessResponse(
      this.toRoleLegacyResponse(role),
      message,
      path,
    );
  }

  // Crear respuesta legada para lista de roles
  static createRoleLegacyListResponse(
    roles: Role[],
    message: string = 'Roles obtenidos exitosamente',
    path: string = '/roles',
  ): ApiResponse<RoleLegacyResponseDto[]> {
    return this.createSuccessResponse(
      this.toRoleLegacyResponseList(roles),
      message,
      path,
    );
  }
}
