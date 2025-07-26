import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { TiposPermisoService } from './tipos-permiso.service';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Tipos de Permiso')
@Controller('tipos-permiso')
export class TiposPermisoController {
  constructor(private readonly tiposPermisoService: TiposPermisoService) {}

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Obtener todos los tipos de permiso',
    description: 'Retorna una lista de todos los tipos de permiso disponibles ordenados por secuencia',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de permiso obtenida exitosamente',
  })
  findAll() {
    return this.tiposPermisoService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({
    summary: 'Obtener un tipo de permiso por ID',
    description: 'Retorna la información detallada de un tipo de permiso específico',
  })
  @ApiParam({ name: 'id', description: 'ID del tipo de permiso' })
  @ApiResponse({
    status: 200,
    description: 'Tipo de permiso encontrado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de permiso no encontrado',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tiposPermisoService.findOne(id);
  }

  @Get('nombre/:nombre')
  @Public()
  @ApiOperation({
    summary: 'Obtener un tipo de permiso por nombre',
    description: 'Retorna la información de un tipo de permiso específico por su nombre',
  })
  @ApiParam({ name: 'nombre', description: 'Nombre del tipo de permiso (altura, enganche, cierre)' })
  @ApiResponse({
    status: 200,
    description: 'Tipo de permiso encontrado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de permiso no encontrado',
  })
  findByNombre(@Param('nombre') nombre: string) {
    return this.tiposPermisoService.findByNombre(nombre);
  }

  @Get(':id/siguiente')
  @Public()
  @ApiOperation({
    summary: 'Obtener el siguiente tipo de permiso en la secuencia',
    description: 'Retorna el siguiente tipo de permiso que debe solicitarse después del actual',
  })
  @ApiParam({ name: 'id', description: 'ID del tipo de permiso actual' })
  @ApiResponse({
    status: 200,
    description: 'Siguiente tipo de permiso obtenido exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay siguiente tipo de permiso o tipo actual no encontrado',
  })
  getNextTipoPermiso(@Param('id', ParseUUIDPipe) id: string) {
    return this.tiposPermisoService.getNextTipoPermiso(id);
  }
}