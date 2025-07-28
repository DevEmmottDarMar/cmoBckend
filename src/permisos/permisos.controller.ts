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
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { PermisosService } from './permisos.service';
import { CreatePermisoDto } from './dto/create-permiso.dto';
import { UpdatePermisoDto } from './dto/update-permiso.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { User } from '../entities/user.entity';

@ApiTags('Permisos')
@ApiBearerAuth('JWT-auth')
@Controller('permisos')
export class PermisosController {
  constructor(private readonly permisosService: PermisosService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Crear un nuevo permiso',
    description: 'Crea un nuevo permiso para un trabajo específico',
  })
  @ApiBody({ type: CreatePermisoDto })
  @ApiResponse({
    status: 201,
    description: 'Permiso creado exitosamente',
  })
  create(@Body() createPermisoDto: CreatePermisoDto) {
    return this.permisosService.create(createPermisoDto);
  }

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Obtener todos los permisos',
    description: 'Retorna una lista de todos los permisos del sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de permisos obtenida exitosamente',
  })
  findAll() {
    return this.permisosService.findAll();
  }

  @Get('pendientes')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Obtener permisos pendientes',
    description: 'Retorna todos los permisos que están pendientes de aprobación',
  })
  @ApiResponse({
    status: 200,
    description: 'Permisos pendientes obtenidos exitosamente',
  })
  findPendientes() {
    return this.permisosService.findPendientes();
  }

  @Get('mis-permisos')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Obtener permisos del técnico actual',
    description: 'Retorna los permisos solicitados por el técnico autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Permisos del técnico obtenidos exitosamente',
  })
  findMisPermisos(@CurrentUser() user: User) {
    return this.permisosService.findByTecnico(user.id);
  }

  @Get('trabajo/:trabajoId')
  @Public()
  @ApiOperation({
    summary: 'Obtener permisos por trabajo',
    description: 'Retorna todos los permisos asociados a un trabajo específico',
  })
  @ApiParam({ name: 'trabajoId', description: 'ID del trabajo' })
  @ApiResponse({
    status: 200,
    description: 'Permisos del trabajo obtenidos exitosamente',
  })
  findByTrabajo(@Param('trabajoId', ParseUUIDPipe) trabajoId: string) {
    return this.permisosService.findByTrabajo(trabajoId);
  }

  @Get('tecnico/:tecnicoId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Obtener permisos por técnico',
    description: 'Retorna los permisos solicitados por un técnico específico',
  })
  @ApiParam({ name: 'tecnicoId', description: 'ID del técnico' })
  @ApiResponse({
    status: 200,
    description: 'Permisos del técnico obtenidos exitosamente',
  })
  findByTecnico(@Param('tecnicoId', ParseUUIDPipe) tecnicoId: string) {
    return this.permisosService.findByTecnico(tecnicoId);
  }

  @Get(':id')
  @Public()
  @ApiOperation({
    summary: 'Obtener un permiso por ID',
    description: 'Retorna la información detallada de un permiso específico',
  })
  @ApiParam({ name: 'id', description: 'ID del permiso' })
  @ApiResponse({
    status: 200,
    description: 'Permiso encontrado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Permiso no encontrado',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.permisosService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Actualizar un permiso',
    description: 'Actualiza la información de un permiso existente',
  })
  @ApiParam({ name: 'id', description: 'ID del permiso' })
  @ApiBody({ type: UpdatePermisoDto })
  @ApiResponse({
    status: 200,
    description: 'Permiso actualizado exitosamente',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePermisoDto: UpdatePermisoDto,
  ) {
    return this.permisosService.update(id, updatePermisoDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Eliminar un permiso',
    description: 'Elimina un permiso del sistema',
  })
  @ApiParam({ name: 'id', description: 'ID del permiso' })
  @ApiResponse({
    status: 200,
    description: 'Permiso eliminado exitosamente',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.permisosService.remove(id);
  }

  @Post(':id/solicitar')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Solicitar un permiso',
    description: 'El técnico solicita un permiso específico con descripción e imagen',
  })
  @ApiParam({ name: 'id', description: 'ID del permiso' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        descripcion: { type: 'string', description: 'Descripción del permiso solicitado' },
        imagenUrl: { type: 'string', description: 'URL de la imagen enviada por el técnico' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Permiso solicitado exitosamente',
  })
  solicitarPermiso(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
    @Body() body: { descripcion?: string; imagenUrl?: string },
  ) {
    return this.permisosService.solicitarPermiso(
      id,
      user.id,
      body.descripcion,
      body.imagenUrl,
    );
  }

  @Post(':id/solicitar-con-imagen')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('imagen'))
  @ApiOperation({
    summary: 'Solicitar un permiso con imagen',
    description: 'El técnico solicita un permiso específico subiendo una imagen directamente',
  })
  @ApiParam({ name: 'id', description: 'ID del permiso' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        descripcion: { type: 'string', description: 'Descripción del permiso solicitado' },
        imagen: {
          type: 'string',
          format: 'binary',
          description: 'Archivo de imagen (JPEG, PNG, JPG, WEBP)',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Permiso solicitado exitosamente con imagen',
  })
  async solicitarPermisoConImagen(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
    @Body() body: { descripcion?: string },
    @UploadedFile() imagen?: Express.Multer.File,
  ) {
    return this.permisosService.solicitarPermisoConImagen(
      id,
      user.id,
      body.descripcion,
      imagen,
    );
  }

  // Endpoint temporal para pruebas sin autenticación
  @Post(':id/test-imagen')
  @Public()
  @UseInterceptors(FileInterceptor('imagen'))
  @ApiOperation({
    summary: 'TEMPORAL: Solicitar un permiso con imagen (sin autenticación)',
    description: 'Endpoint temporal para pruebas de carga de imágenes',
  })
  @ApiParam({ name: 'id', description: 'ID del permiso' })
  async testSolicitarPermisoConImagen(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('tecnicoId') tecnicoId: string,
    @Body() body: { descripcion?: string },
    @UploadedFile() imagen?: Express.Multer.File,
  ) {
    console.log('🔍 testSolicitarPermisoConImagen - Archivo recibido:', {
      originalname: imagen?.originalname,
      mimetype: imagen?.mimetype,
      size: imagen?.size,
      buffer: imagen?.buffer ? `${imagen.buffer.length} bytes` : 'No buffer',
    });
    
    return this.permisosService.solicitarPermisoConImagen(
      id,
      tecnicoId,
      body.descripcion,
      imagen,
    );
  }

  // Endpoint para verificar imágenes de un permiso
  @Get(':id/imagenes')
  @Public()
  @ApiOperation({
    summary: 'Obtener imágenes de un permiso',
    description: 'Lista todas las imágenes asociadas a un permiso específico',
  })
  @ApiParam({ name: 'id', description: 'ID del permiso' })
  async getImagenesPermiso(@Param('id', ParseUUIDPipe) id: string) {
    const permiso = await this.permisosService.findOne(id);
    return {
      permisoId: id,
      totalImagenes: permiso.imagenes?.length || 0,
      imagenes: permiso.imagenes || [],
    };
  }

  @Post(':id/aprobar')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Aprobar un permiso',
    description: 'El supervisor aprueba un permiso solicitado',
  })
  @ApiParam({ name: 'id', description: 'ID del permiso' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        comentario: { type: 'string', description: 'Comentario del supervisor' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Permiso aprobado exitosamente',
  })
  aprobarPermiso(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
    @Body() body: { comentario?: string },
  ) {
    return this.permisosService.aprobarPermiso(id, user.id, body.comentario);
  }

  @Post(':id/rechazar')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Rechazar un permiso',
    description: 'El supervisor rechaza un permiso solicitado (comentario obligatorio)',
  })
  @ApiParam({ name: 'id', description: 'ID del permiso' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        comentario: { type: 'string', description: 'Comentario obligatorio del supervisor' },
      },
      required: ['comentario'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Permiso rechazado exitosamente',
  })
  rechazarPermiso(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
    @Body() body: { comentario: string },
  ) {
    return this.permisosService.rechazarPermiso(id, user.id, body.comentario);
  }
}