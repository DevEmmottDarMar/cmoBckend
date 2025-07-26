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
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { TrabajosService } from './trabajos.service';
import { CreateTrabajoDto } from './dto/create-trabajo.dto';
import { UpdateTrabajoDto } from './dto/update-trabajo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { User } from '../entities/user.entity';

@ApiTags('Trabajos')
@ApiBearerAuth('JWT-auth')
@Controller('trabajos')
export class TrabajosController {
  constructor(private readonly trabajosService: TrabajosService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Crear un nuevo trabajo',
    description: 'Crea un nuevo trabajo en el sistema y automáticamente genera los tres permisos requeridos (altura, enganche, cierre)',
  })
  @ApiBody({ type: CreateTrabajoDto })
  @ApiResponse({
    status: 201,
    description: 'Trabajo creado exitosamente',
  })
  create(@Body() createTrabajoDto: CreateTrabajoDto) {
    return this.trabajosService.create(createTrabajoDto);
  }

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Obtener todos los trabajos',
    description: 'Retorna una lista de todos los trabajos con sus permisos y técnicos asignados',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de trabajos obtenida exitosamente',
  })
  findAll() {
    return this.trabajosService.findAll();
  }

  @Get('mis-trabajos')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Obtener trabajos del técnico actual',
    description: 'Retorna los trabajos asignados al técnico autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Trabajos del técnico obtenidos exitosamente',
  })
  findMyTrabajos(@CurrentUser() user: User) {
    return this.trabajosService.findByTecnico(user.id);
  }

  @Get('tecnico/:tecnicoId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Obtener trabajos por técnico',
    description: 'Retorna los trabajos asignados a un técnico específico',
  })
  @ApiParam({ name: 'tecnicoId', description: 'ID del técnico' })
  @ApiResponse({
    status: 200,
    description: 'Trabajos del técnico obtenidos exitosamente',
  })
  findByTecnico(@Param('tecnicoId', ParseUUIDPipe) tecnicoId: string) {
    return this.trabajosService.findByTecnico(tecnicoId);
  }

  @Get(':id')
  @Public()
  @ApiOperation({
    summary: 'Obtener un trabajo por ID',
    description: 'Retorna la información detallada de un trabajo específico con sus permisos',
  })
  @ApiParam({ name: 'id', description: 'ID del trabajo' })
  @ApiResponse({
    status: 200,
    description: 'Trabajo encontrado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Trabajo no encontrado',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.trabajosService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Actualizar un trabajo',
    description: 'Actualiza la información de un trabajo existente',
  })
  @ApiParam({ name: 'id', description: 'ID del trabajo' })
  @ApiBody({ type: UpdateTrabajoDto })
  @ApiResponse({
    status: 200,
    description: 'Trabajo actualizado exitosamente',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTrabajoDto: UpdateTrabajoDto,
  ) {
    return this.trabajosService.update(id, updateTrabajoDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Eliminar un trabajo',
    description: 'Elimina un trabajo y todos sus permisos asociados',
  })
  @ApiParam({ name: 'id', description: 'ID del trabajo' })
  @ApiResponse({
    status: 200,
    description: 'Trabajo eliminado exitosamente',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.trabajosService.remove(id);
  }

  @Post(':id/asignar-tecnico')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Asignar técnico a un trabajo',
    description: 'Asigna un técnico a un trabajo y cambia el estado a "en proceso"',
  })
  @ApiParam({ name: 'id', description: 'ID del trabajo' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        tecnicoId: { type: 'string', description: 'ID del técnico a asignar' },
      },
      required: ['tecnicoId'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Técnico asignado exitosamente',
  })
  asignarTecnico(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('tecnicoId', ParseUUIDPipe) tecnicoId: string,
  ) {
    return this.trabajosService.asignarTecnico(id, tecnicoId);
  }

  @Post(':id/iniciar')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Iniciar trabajo',
    description: 'El técnico asignado inicia el trabajo (cambia estado a "en proceso")',
  })
  @ApiParam({ name: 'id', description: 'ID del trabajo' })
  @ApiResponse({
    status: 200,
    description: 'Trabajo iniciado exitosamente',
  })
  iniciarTrabajo(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.trabajosService.iniciarTrabajo(id, user.id);
  }
}