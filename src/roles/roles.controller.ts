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
  RolesListResponseSchema,
  RoleDetailResponseSchema,
  CreateRoleRequestSchema,
  UpdateRoleRequestSchema,
  ApiErrorResponseSchema,
} from '../common/swagger/schemas';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from '../entities/role.entity';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
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
import { RolesMapper } from './roles.mapper';

@ApiTags('Roles')
@ApiBearerAuth('JWT-auth')
@Controller('roles')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly rolesMapper: RolesMapper,
  ) {}

  @Post()
  @Public()
  @ApiOperation({
    summary: 'Crear un nuevo rol',
    description:
      'Crea un nuevo rol en el sistema con la información proporcionada',
  })
  @ApiBody({
    type: CreateRoleRequestSchema,
    description: 'Datos del rol a crear',
  })
  @SwaggerApiResponse({
    status: 201,
    description: 'Rol creado exitosamente',
    type: RoleDetailResponseSchema,
  })
  @SwaggerApiResponse({
    status: 400,
    description: 'Datos inválidos',
    type: ApiErrorResponseSchema,
  })
  @SwaggerApiResponse({
    status: 409,
    description: 'El nombre del rol ya existe',
    type: ApiErrorResponseSchema,
  })
  create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Obtener todos los roles',
    description:
      'Retorna una lista de todos los roles en el sistema con diferentes formatos de respuesta',
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
    description: 'Lista de roles obtenida exitosamente',
    type: RolesListResponseSchema,
  })
  @SwaggerApiResponse({
    status: 500,
    description: 'Error interno del servidor',
    type: ApiErrorResponseSchema,
  })
  async findAll(
    @Query('format') format: ResponseFormat = 'simple',
  ): Promise<
    ApiResponse<
      | RoleResponse[]
      | RoleLegacyResponse[]
      | RoleFullResponse[]
      | RoleSimpleResponse[]
    >
  > {
    const roles = await this.rolesService.findAll();
    return this.rolesMapper.mapRolesList(roles, format);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Obtener un rol por ID' })
  @ApiParam({ name: 'id', description: 'ID del rol' })
  @ApiQuery({
    name: 'format',
    required: false,
    enum: ['legacy', 'new', 'full', 'simple'],
    description: 'Formato de respuesta',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('format') format: ResponseFormat = 'simple',
  ): Promise<
    ApiResponse<
      RoleResponse | RoleLegacyResponse | RoleFullResponse | RoleSimpleResponse
    >
  > {
    const role = await this.rolesService.findOne(id);
    return this.rolesMapper.mapRoleDetail(role, format);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Actualizar un rol' })
  @ApiParam({ name: 'id', description: 'ID del rol' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Eliminar un rol' })
  @ApiParam({ name: 'id', description: 'ID del rol' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.rolesService.remove(id);
  }
}
