import { ApiProperty } from '@nestjs/swagger';

// ===== ESQUEMAS BASE =====

export class ApiResponseSchema<T> {
  @ApiProperty({ description: 'Indica si la operación fue exitosa' })
  success: boolean;

  @ApiProperty({ description: 'Mensaje descriptivo de la operación' })
  message: string;

  @ApiProperty({ description: 'Datos de la respuesta' })
  data: T;

  @ApiProperty({ description: 'Timestamp de cuando se generó la respuesta' })
  timestamp: string;

  @ApiProperty({ description: 'Endpoint que se llamó' })
  path: string;
}

export class ApiErrorResponseSchema {
  @ApiProperty({ example: false, description: 'Indica que la operación falló' })
  success: false;

  @ApiProperty({ description: 'Mensaje de error' })
  message: string;

  @ApiProperty({ required: false, description: 'Código de error específico' })
  error?: string;

  @ApiProperty({ description: 'Timestamp del error' })
  timestamp: string;

  @ApiProperty({ description: 'Endpoint que causó el error' })
  path: string;
}

// ===== ESQUEMAS DE USUARIO =====

export class UserResponseSchema {
  @ApiProperty({ description: 'ID único del usuario' })
  id: string;

  @ApiProperty({ description: 'Email del usuario' })
  email: string;

  @ApiProperty({ description: 'Nombre del usuario' })
  name: string;

  @ApiProperty({ required: false, description: 'Teléfono del usuario' })
  phone?: string;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  updatedAt: Date;
}

export class UserLegacyResponseSchema extends UserResponseSchema {
  @ApiProperty({ description: 'ID del rol asignado al usuario' })
  roleId: string;
}

export class UserFullResponseSchema extends UserResponseSchema {
  @ApiProperty({
    required: false,
    description: 'Información completa del rol del usuario',
  })
  role?: {
    id: string;
    name: string;
    description: string;
  };
}

export class UserSimpleResponseSchema {
  @ApiProperty({ description: 'ID único del usuario' })
  id: string;

  @ApiProperty({ description: 'Nombre del usuario' })
  name: string;

  @ApiProperty({ description: 'Email del usuario' })
  email: string;
}

// ===== ESQUEMAS DE ROL =====

export class RoleResponseSchema {
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

export class RoleLegacyResponseSchema extends RoleResponseSchema {
  @ApiProperty({
    type: [Object],
    description: 'Array vacío para compatibilidad con versiones anteriores',
  })
  users: any[];
}

export class RoleFullResponseSchema extends RoleResponseSchema {
  @ApiProperty({
    type: [UserSimpleResponseSchema],
    required: false,
    description: 'Lista de usuarios que tienen este rol',
  })
  users?: UserSimpleResponseSchema[];
}

export class RoleSimpleResponseSchema {
  @ApiProperty({ description: 'ID único del rol' })
  id: string;

  @ApiProperty({ description: 'Nombre del rol' })
  name: string;

  @ApiProperty({ description: 'Descripción del rol' })
  description: string;
}

// ===== ESQUEMAS DE REQUEST =====

export class CreateUserRequestSchema {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'usuario@demo.com',
  })
  email: string;

  @ApiProperty({ description: 'Contraseña del usuario', example: '123456' })
  password: string;

  @ApiProperty({ description: 'Nombre del usuario', example: 'Juan Pérez' })
  name: string;

  @ApiProperty({
    required: false,
    description: 'Teléfono del usuario',
    example: '+1234567890',
  })
  phone?: string;

  @ApiProperty({
    required: false,
    description: 'ID del rol a asignar',
    example: 'cfd2c317-70c9-4c1f-9a2a-9345e8b17d31',
  })
  roleId?: string;
}

export class UpdateUserRequestSchema {
  @ApiProperty({
    required: false,
    description: 'Nuevo nombre del usuario',
    example: 'Juan Pérez Actualizado',
  })
  name?: string;

  @ApiProperty({
    required: false,
    description: 'Nuevo teléfono del usuario',
    example: '+1234567890',
  })
  phone?: string;

  @ApiProperty({
    required: false,
    description: 'Nuevo ID del rol',
    example: 'cfd2c317-70c9-4c1f-9a2a-9345e8b17d31',
  })
  roleId?: string;
}

export class CreateRoleRequestSchema {
  @ApiProperty({ description: 'Nombre del rol', example: 'admin' })
  name: string;

  @ApiProperty({
    description: 'Descripción del rol',
    example: 'Rol de administrador con permisos completos',
  })
  description: string;
}

export class UpdateRoleRequestSchema {
  @ApiProperty({
    required: false,
    description: 'Nuevo nombre del rol',
    example: 'admin_updated',
  })
  name?: string;

  @ApiProperty({
    required: false,
    description: 'Nueva descripción del rol',
    example: 'Rol de administrador actualizado',
  })
  description?: string;
}

// ===== ESQUEMAS DE RESPUESTA COMPLETOS =====

export class UsersListResponseSchema {
  @ApiProperty({ description: 'Indica si la operación fue exitosa' })
  success: boolean;

  @ApiProperty({ description: 'Mensaje descriptivo de la operación' })
  message: string;

  @ApiProperty({
    type: [UserResponseSchema],
    description: 'Lista de usuarios',
  })
  data: UserResponseSchema[];

  @ApiProperty({ description: 'Timestamp de cuando se generó la respuesta' })
  timestamp: string;

  @ApiProperty({ description: 'Endpoint que se llamó' })
  path: string;
}

export class UserDetailResponseSchema {
  @ApiProperty({ description: 'Indica si la operación fue exitosa' })
  success: boolean;

  @ApiProperty({ description: 'Mensaje descriptivo de la operación' })
  message: string;

  @ApiProperty({
    type: UserResponseSchema,
    description: 'Información del usuario',
  })
  data: UserResponseSchema;

  @ApiProperty({ description: 'Timestamp de cuando se generó la respuesta' })
  timestamp: string;

  @ApiProperty({ description: 'Endpoint que se llamó' })
  path: string;
}

export class RolesListResponseSchema {
  @ApiProperty({ description: 'Indica si la operación fue exitosa' })
  success: boolean;

  @ApiProperty({ description: 'Mensaje descriptivo de la operación' })
  message: string;

  @ApiProperty({
    type: [RoleResponseSchema],
    description: 'Lista de roles',
  })
  data: RoleResponseSchema[];

  @ApiProperty({ description: 'Timestamp de cuando se generó la respuesta' })
  timestamp: string;

  @ApiProperty({ description: 'Endpoint que se llamó' })
  path: string;
}

export class RoleDetailResponseSchema {
  @ApiProperty({ description: 'Indica si la operación fue exitosa' })
  success: boolean;

  @ApiProperty({ description: 'Mensaje descriptivo de la operación' })
  message: string;

  @ApiProperty({
    type: RoleResponseSchema,
    description: 'Información del rol',
  })
  data: RoleResponseSchema;

  @ApiProperty({ description: 'Timestamp de cuando se generó la respuesta' })
  timestamp: string;

  @ApiProperty({ description: 'Endpoint que se llamó' })
  path: string;
}
