import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
  ApiResponse as SwaggerApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import {
  UsersListResponseSchema,
  UserDetailResponseSchema,
  CreateUserRequestSchema,
  UpdateUserRequestSchema,
  ApiErrorResponseSchema,
} from '../common/swagger/schemas';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../entities/user.entity';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
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
import { UsersMapper } from './users.mapper';

@ApiTags('Usuarios')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersMapper: UsersMapper,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo usuario',
    description:
      'Crea un nuevo usuario en el sistema con la información proporcionada',
  })
  @ApiBody({
    type: CreateUserRequestSchema,
    description: 'Datos del usuario a crear',
  })
  @SwaggerApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente',
    type: UserDetailResponseSchema,
  })
  @SwaggerApiResponse({
    status: 400,
    description: 'Datos inválidos',
    type: ApiErrorResponseSchema,
  })
  @SwaggerApiResponse({
    status: 409,
    description: 'El email ya existe',
    type: ApiErrorResponseSchema,
  })
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Obtener todos los usuarios',
    description:
      'Retorna una lista de todos los usuarios en el sistema con diferentes formatos de respuesta',
  })
  @ApiQuery({
    name: 'format',
    required: false,
    enum: ['legacy', 'new', 'full', 'simple'],
    description:
      'Formato de respuesta: legacy (compatible), new (nuevo), full (completo), simple (básico)',
  })
  @SwaggerApiResponse({
    status: 200,
    description: 'Lista de usuarios obtenida exitosamente',
    type: UsersListResponseSchema,
  })
  @SwaggerApiResponse({
    status: 500,
    description: 'Error interno del servidor',
    type: ApiErrorResponseSchema,
  })
  async findAll(
    @Query('format') format: ResponseFormat = 'new',
  ): Promise<
    ApiResponse<
      | UserResponse[]
      | UserLegacyResponse[]
      | UserFullResponse[]
      | UserSimpleResponse[]
    >
  > {
    const users = await this.usersService.findAll();
    return this.usersMapper.mapUsersList(users, format);
  }

  @Get(':id')
  @Public()
  @ApiOperation({
    summary: 'Obtener un usuario por ID',
    description:
      'Retorna la información detallada de un usuario específico por su ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del usuario (UUID)',
    example: 'cfd2c317-70c9-4c1f-9a2a-9345e8b17d31',
  })
  @ApiQuery({
    name: 'format',
    required: false,
    enum: ['legacy', 'new', 'full', 'simple'],
    description: 'Formato de respuesta',
  })
  @SwaggerApiResponse({
    status: 200,
    description: 'Usuario encontrado exitosamente',
    type: UserDetailResponseSchema,
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
    type: ApiErrorResponseSchema,
  })
  @SwaggerApiResponse({
    status: 400,
    description: 'ID inválido',
    type: ApiErrorResponseSchema,
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('format') format: ResponseFormat = 'new',
  ): Promise<
    ApiResponse<
      UserResponse | UserLegacyResponse | UserFullResponse | UserSimpleResponse
    >
  > {
    const user = await this.usersService.findOne(id);
    return this.usersMapper.mapUserDetail(user, format);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Actualizar un usuario',
    description:
      'Actualiza la información de un usuario existente. Requiere autenticación JWT.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del usuario a actualizar (UUID)',
    example: 'cfd2c317-70c9-4c1f-9a2a-9345e8b17d31',
  })
  @ApiBody({
    type: UpdateUserRequestSchema,
    description: 'Datos a actualizar del usuario',
  })
  @SwaggerApiResponse({
    status: 200,
    description: 'Usuario actualizado exitosamente',
    type: UserDetailResponseSchema,
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
    type: ApiErrorResponseSchema,
  })
  @SwaggerApiResponse({
    status: 401,
    description: 'No autorizado - Token JWT requerido',
    type: ApiErrorResponseSchema,
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Eliminar un usuario',
    description:
      'Elimina permanentemente un usuario del sistema. Requiere autenticación JWT.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del usuario a eliminar (UUID)',
    example: 'cfd2c317-70c9-4c1f-9a2a-9345e8b17d31',
  })
  @SwaggerApiResponse({
    status: 200,
    description: 'Usuario eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Usuario eliminado exitosamente' },
      },
    },
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
    type: ApiErrorResponseSchema,
  })
  @SwaggerApiResponse({
    status: 401,
    description: 'No autorizado - Token JWT requerido',
    type: ApiErrorResponseSchema,
  })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
