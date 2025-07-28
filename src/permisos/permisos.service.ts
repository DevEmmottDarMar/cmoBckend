import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permiso, EstadoPermiso } from '../entities/permiso.entity';
import { TipoPermiso } from '../entities/tipo-permiso.entity';
import { Trabajo, EstadoTrabajo } from '../entities/trabajo.entity';
import { CreatePermisoDto } from './dto/create-permiso.dto';
import { UpdatePermisoDto } from './dto/update-permiso.dto';
import { UsersService } from '../users/users.service';
import { TiposPermisoService } from '../tipos-permiso/tipos-permiso.service';
import { ImagenesService } from '../imagenes/imagenes.service';

@Injectable()
export class PermisosService {
  constructor(
    @InjectRepository(Permiso)
    private permisoRepository: Repository<Permiso>,
    @InjectRepository(Trabajo)
    private trabajoRepository: Repository<Trabajo>,
    private usersService: UsersService,
    private tiposPermisoService: TiposPermisoService,
    private imagenesService: ImagenesService,
  ) {}

  async create(createPermisoDto: CreatePermisoDto): Promise<Permiso> {
    // Verificar que el trabajo existe
    const trabajo = await this.trabajoRepository.findOne({
      where: { id: createPermisoDto.trabajoId },
    });
    if (!trabajo) {
      throw new NotFoundException(`Trabajo con ID ${createPermisoDto.trabajoId} no encontrado`);
    }

    // Verificar que el técnico existe si se proporciona
    if (createPermisoDto.tecnicoId) {
      await this.usersService.findOne(createPermisoDto.tecnicoId);
    }

    const permiso = this.permisoRepository.create(createPermisoDto);
    // Guardar el permiso sin cargar las relaciones de imágenes para evitar conflictos
    const permisoGuardado = await this.permisoRepository.save(permiso);
    
    // Recargar el permiso con todas las relaciones para la respuesta
    return this.findOne(permisoGuardado.id);
  }

  async findAll(): Promise<Permiso[]> {
    return this.permisoRepository.find({
      relations: ['trabajo', 'tecnico', 'supervisor', 'tipoPermiso', 'imagenes'],
      order: { fechaSolicitud: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Permiso> {
    const permiso = await this.permisoRepository.findOne({
      where: { id },
      relations: ['trabajo', 'tecnico', 'supervisor', 'tipoPermiso', 'imagenes'],
    });

    if (!permiso) {
      throw new NotFoundException(`Permiso con ID ${id} no encontrado`);
    }

    return permiso;
  }

  async findByTrabajo(trabajoId: string): Promise<Permiso[]> {
    return this.permisoRepository.find({
      where: { trabajoId },
      relations: ['trabajo', 'tecnico', 'supervisor', 'tipoPermiso', 'imagenes'],
      order: { fechaSolicitud: 'ASC' },
    });
  }

  async findByTecnico(tecnicoId: string): Promise<Permiso[]> {
    return this.permisoRepository.find({
      where: { tecnicoId },
      relations: ['trabajo', 'tecnico', 'supervisor', 'tipoPermiso', 'imagenes'],
      order: { fechaSolicitud: 'DESC' },
    });
  }

  async findPendientes(): Promise<Permiso[]> {
    return this.permisoRepository.find({
      where: { estado: EstadoPermiso.PENDIENTE },
      relations: ['trabajo', 'tecnico', 'supervisor', 'tipoPermiso', 'imagenes'],
      order: { fechaSolicitud: 'ASC' },
    });
  }

  async update(id: string, updatePermisoDto: UpdatePermisoDto): Promise<Permiso> {
    const permiso = await this.findOne(id);

    // Verificar que el supervisor existe si se proporciona
    if (updatePermisoDto.supervisorId) {
      await this.usersService.findOne(updatePermisoDto.supervisorId);
    }

    // Si se cambia el estado, establecer fecha de respuesta
    if (updatePermisoDto.estado && updatePermisoDto.estado !== EstadoPermiso.PENDIENTE) {
      if (!updatePermisoDto.fechaRespuesta) {
        updatePermisoDto.fechaRespuesta = new Date().toISOString();
      }
    }

    Object.assign(permiso, updatePermisoDto);
    // Guardar el permiso sin cargar las relaciones de imágenes para evitar conflictos
    const permisoGuardado = await this.permisoRepository.save(permiso);
    
    // Recargar el permiso con todas las relaciones para la respuesta
    return this.findOne(permisoGuardado.id);
  }

  async remove(id: string): Promise<void> {
    const permiso = await this.findOne(id);
    await this.permisoRepository.remove(permiso);
  }

  async solicitarPermiso(
    permisoId: string,
    tecnicoId: string,
    descripcion?: string,
    imagenUrl?: string,
  ): Promise<Permiso> {
    const permiso = await this.findOne(permisoId);
    
    // Verificar que el técnico está asignado al trabajo
    const trabajo = await this.trabajoRepository.findOne({
      where: { id: permiso.trabajoId },
      relations: ['permisos'],
    });
    if (!trabajo) {
      throw new NotFoundException(`Trabajo con ID ${permiso.trabajoId} no encontrado`);
    }
    if (trabajo.tecnicoAsignadoId !== tecnicoId) {
      throw new ForbiddenException('Solo el técnico asignado puede solicitar permisos para este trabajo');
    }

    if (permiso.estado !== EstadoPermiso.PENDIENTE) {
      throw new BadRequestException('Este permiso ya ha sido procesado');
    }

    // Verificar secuencia de permisos
    await this.verificarSecuenciaPermisos(trabajo.permisos, permiso.tipoPermiso);

    permiso.tecnicoId = tecnicoId;
    permiso.descripcion = descripcion;
    permiso.fechaSolicitud = new Date();

    // Si se proporciona una URL de imagen, crear la entidad Imagen
    if (imagenUrl) {
      try {
        await this.imagenesService.create({
          nombre: `Imagen permiso ${permiso.tipoPermiso?.nombre || 'permiso'}`,
          url: imagenUrl,
          mimeType: 'image/jpeg', // Por defecto, se puede mejorar detectando el tipo
          tamaño: 0, // No tenemos el tamaño real de la URL
          descripcion: `Imagen para permiso de ${permiso.tipoPermiso?.nombre || 'permiso'}`,
          permisoId: permisoId,
          uploadedBy: tecnicoId,
        });
      } catch (error) {
        throw new BadRequestException(`Error al crear la imagen: ${error.message}`);
      }
    }

    // Guardar el permiso
    const permisoGuardado = await this.permisoRepository.save(permiso);
    
    // Recargar el permiso con todas las relaciones para la respuesta
    return this.findOne(permisoGuardado.id);
  }

  async aprobarPermiso(
    permisoId: string,
    supervisorId: string,
    comentario?: string,
  ): Promise<Permiso> {
    const permiso = await this.findOne(permisoId);
    
    if (permiso.estado !== EstadoPermiso.PENDIENTE) {
      throw new BadRequestException('Este permiso ya ha sido procesado');
    }

    permiso.estado = EstadoPermiso.APROBADO;
    permiso.supervisorId = supervisorId;
    permiso.comentarioSupervisor = comentario;
    permiso.fechaRespuesta = new Date();

    const permisoAprobado = await this.permisoRepository.save(permiso);

    // Si es el permiso de cierre, cambiar el estado del trabajo a terminado
    const esCierre = await this.tiposPermisoService.isLastTipoPermiso(permiso.tipoPermisoId);
    if (esCierre) {
      await this.trabajoRepository.update(
        { id: permiso.trabajoId },
        { 
          estado: EstadoTrabajo.TERMINADO,
          fechaEjecutada: new Date()
        }
      );
    }

    return permisoAprobado;
  }

  async rechazarPermiso(
    permisoId: string,
    supervisorId: string,
    comentario: string,
  ): Promise<Permiso> {
    const permiso = await this.findOne(permisoId);
    
    if (permiso.estado !== EstadoPermiso.PENDIENTE) {
      throw new BadRequestException('Este permiso ya ha sido procesado');
    }

    if (!comentario) {
      throw new BadRequestException('El comentario es obligatorio al rechazar un permiso');
    }

    permiso.estado = EstadoPermiso.RECHAZADO;
    permiso.supervisorId = supervisorId;
    permiso.comentarioSupervisor = comentario;
    permiso.fechaRespuesta = new Date();

    return this.permisoRepository.save(permiso);
  }

  async solicitarPermisoConImagen(
    permisoId: string,
    tecnicoId: string,
    descripcion?: string,
    imagen?: Express.Multer.File,
  ): Promise<Permiso> {
    console.log('🚀 solicitarPermisoConImagen - Iniciando con permisoId:', permisoId);
    console.log('👤 tecnicoId:', tecnicoId);
    console.log('📝 descripcion:', descripcion);
    console.log('🖼️ imagen:', imagen ? 'Archivo presente' : 'Sin archivo');
    
    if (imagen) {
      console.log('📁 Detalles del archivo:', {
        originalname: imagen.originalname,
        mimetype: imagen.mimetype,
        size: imagen.size,
        buffer: imagen.buffer ? `${imagen.buffer.length} bytes` : 'No buffer',
      });
    }
    
    const permiso = await this.findOne(permisoId);
    console.log('✅ Permiso encontrado:', { id: permiso.id, estado: permiso.estado, trabajoId: permiso.trabajoId });
    
    // Verificar que el técnico está asignado al trabajo
    const trabajo = await this.trabajoRepository.findOne({
      where: { id: permiso.trabajoId },
      relations: ['permisos'],
    });
    if (!trabajo) {
      throw new NotFoundException(`Trabajo con ID ${permiso.trabajoId} no encontrado`);
    }
    if (trabajo.tecnicoAsignadoId !== tecnicoId) {
      throw new ForbiddenException('Solo el técnico asignado puede solicitar permisos para este trabajo');
    }

    if (permiso.estado !== EstadoPermiso.PENDIENTE) {
      throw new BadRequestException('Este permiso ya ha sido procesado');
    }

    // Verificar secuencia de permisos
    await this.verificarSecuenciaPermisos(trabajo.permisos, permiso.tipoPermiso);

    // Actualizar datos básicos del permiso
    permiso.tecnicoId = tecnicoId;
    permiso.descripcion = descripcion;
    permiso.fechaSolicitud = new Date();

    // Si se proporciona una imagen, crearla y asociarla
    if (imagen) {
      try {
        console.log('🖼️ Creando imagen en BD...');
        const imagenCreada = await this.imagenesService.createFromUpload(
          imagen,
          permisoId,
          tecnicoId,
          `Imagen para permiso de ${permiso.tipoPermiso?.nombre || 'permiso'}`
        );
        console.log('✅ Imagen creada exitosamente:', {
          id: imagenCreada.id,
          nombre: imagenCreada.nombre,
          permisoId: imagenCreada.permisoId,
        });
      } catch (error) {
        console.error('❌ Error al crear imagen:', error);
        throw new BadRequestException(`Error al procesar la imagen: ${error.message}`);
      }
    } else {
      console.log('📭 No se proporcionó imagen');
    }

    // Guardar el permiso
    const permisoGuardado = await this.permisoRepository.save(permiso);
    console.log('💾 Permiso guardado:', { id: permisoGuardado.id, estado: permisoGuardado.estado });
    
    // Recargar el permiso con todas las relaciones para la respuesta
    const permisoRecargado = await this.findOne(permisoGuardado.id);
    console.log('🔄 Permiso recargado con imágenes:', {
      id: permisoRecargado.id,
      totalImagenes: permisoRecargado.imagenes?.length || 0,
      imagenes: permisoRecargado.imagenes?.map(img => ({ id: img.id, nombre: img.nombre })) || [],
    });
    
    return permisoRecargado;
  }

  /**
   * Verifica que los permisos se soliciten en secuencia: altura -> enganche -> cierre
   */
  private async verificarSecuenciaPermisos(permisos: Permiso[], tipoSolicitado: TipoPermiso): Promise<void> {
    // Si es el primer permiso en orden (orden = 1), se puede solicitar directamente
    if (tipoSolicitado.orden === 1) {
      return;
    }

    // Obtener todos los tipos de permiso ordenados
    const todosTipos = await this.tiposPermisoService.findAll();
    
    // Verificar que todos los permisos anteriores estén aprobados
    for (const tipo of todosTipos) {
      if (tipo.orden >= tipoSolicitado.orden) {
        break; // Ya llegamos al tipo solicitado o uno posterior
      }
      
      const permisoAnterior = permisos.find(p => p.tipoPermisoId === tipo.id);
      
      if (!permisoAnterior) {
        throw new BadRequestException(`No se encontró el permiso de ${tipo.nombre}`);
      }
      
      if (permisoAnterior.estado !== EstadoPermiso.APROBADO) {
        throw new BadRequestException(
          `No se puede solicitar el permiso de ${tipoSolicitado.nombre} hasta que el permiso de ${tipo.nombre} sea aprobado`
        );
      }
    }
  }
}