import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../entities/user.entity';
import { Role } from '../../entities/role.entity';
import { BaseMapper } from './base.mapper';
import { ApiResponse } from '../interfaces/api.interface';

// DTO para respuesta de rol en contexto de usuario
export class UserRoleResponseDto {
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

// DTO para respuesta de usuario sin información sensible
export class UserResponseDto {
  @ApiProperty({ description: 'ID único del usuario' })
  id: string;

  @ApiProperty({ description: 'Email del usuario' })
  email: string;

  @ApiProperty({ description: 'Nombre del usuario' })
  name: string;

  @ApiProperty({ description: 'Teléfono del usuario', required: false })
  phone?: string;

  @ApiProperty({ description: 'Rol del usuario', required: false })
  role?: UserRoleResponseDto;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  updatedAt: Date;
}

// DTO para respuesta de usuario legado (compatible con versiones anteriores)
export class UserLegacyResponseDto {
  @ApiProperty({ description: 'ID único del usuario' })
  id: string;

  @ApiProperty({ description: 'Email del usuario' })
  email: string;

  @ApiProperty({ description: 'Nombre del usuario' })
  name: string;

  @ApiProperty({ description: 'Teléfono del usuario', required: false })
  phone?: string;

  @ApiProperty({ description: 'ID del rol del usuario', required: false })
  roleId?: string;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  updatedAt: Date;
}

export class UserMapper extends BaseMapper {
  // Mapear entidad User a UserResponseDto
  static toUserResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role ? this.toRoleResponse(user.role) : undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  // Mapear entidad User a UserLegacyResponseDto (compatible con versiones anteriores)
  static toUserLegacyResponse(user: User): UserLegacyResponseDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      roleId: user.roleId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  // Mapear entidad Role a UserRoleResponseDto
  static toRoleResponse(role: Role): UserRoleResponseDto {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }

  // Mapear array de usuarios a respuesta paginada
  static toUserResponseList(users: User[]): UserResponseDto[] {
    return users.map((user) => this.toUserResponse(user));
  }

  // Mapear array de usuarios a respuesta legada
  static toUserLegacyResponseList(users: User[]): UserLegacyResponseDto[] {
    return users.map((user) => this.toUserLegacyResponse(user));
  }

  // Crear respuesta exitosa para un usuario
  static createUserResponse(
    user: User,
    message: string = 'Usuario obtenido exitosamente',
    path: string = '/users',
  ): ApiResponse<UserResponseDto> {
    return this.createSuccessResponse(this.toUserResponse(user), message, path);
  }

  // Crear respuesta exitosa para lista de usuarios
  static createUserListResponse(
    users: User[],
    message: string = 'Usuarios obtenidos exitosamente',
    path: string = '/users',
  ): ApiResponse<UserResponseDto[]> {
    return this.createSuccessResponse(
      this.toUserResponseList(users),
      message,
      path,
    );
  }

  // Crear respuesta legada para un usuario
  static createUserLegacyResponse(
    user: User,
    message: string = 'Usuario obtenido exitosamente',
    path: string = '/users',
  ): ApiResponse<UserLegacyResponseDto> {
    return this.createSuccessResponse(
      this.toUserLegacyResponse(user),
      message,
      path,
    );
  }

  // Crear respuesta legada para lista de usuarios
  static createUserLegacyListResponse(
    users: User[],
    message: string = 'Usuarios obtenidos exitosamente',
    path: string = '/users',
  ): ApiResponse<UserLegacyResponseDto[]> {
    return this.createSuccessResponse(
      this.toUserLegacyResponseList(users),
      message,
      path,
    );
  }
}
