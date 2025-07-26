import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trabajo, EstadoTrabajo } from '../entities/trabajo.entity';
import { Permiso, EstadoPermiso } from '../entities/permiso.entity';
import { TipoPermiso } from '../entities/tipo-permiso.entity';
import { CreateTrabajoDto } from './dto/create-trabajo.dto';
import { UpdateTrabajoDto } from './dto/update-trabajo.dto';
import { UsersService } from '../users/users.service';
import { TiposPermisoService } from '../tipos-permiso/tipos-permiso.service';

@Injectable()
export class TrabajosService {
  constructor(
    @InjectRepository(Trabajo)
    private trabajoRepository: Repository<Trabajo>,
    @InjectRepository(Permiso)
    private permisoRepository: Repository<Permiso>,
    @InjectRepository(TipoPermiso)
    private tipoPermisoRepository: Repository<TipoPermiso>,
    private usersService: UsersService,
    private tiposPermisoService: TiposPermisoService,
  ) {}

  async create(createTrabajoDto: CreateTrabajoDto): Promise<Trabajo> {
    // Verificar que el técnico existe si se proporciona
    if (createTrabajoDto.tecnicoAsignadoId) {
      await this.usersService.findOne(createTrabajoDto.tecnicoAsignadoId);
    }

    const trabajo = this.trabajoRepository.create(createTrabajoDto);
    const savedTrabajo = await this.trabajoRepository.save(trabajo);

    // Crear automáticamente los tres permisos requeridos
    await this.createDefaultPermisos(savedTrabajo.id);

    return this.findOne(savedTrabajo.id);
  }

  async findAll(): Promise<Trabajo[]> {
    return this.trabajoRepository.find({
      relations: ['tecnicoAsignado', 'permisos', 'permisos.tecnico', 'permisos.supervisor', 'permisos.tipoPermiso', 'permisos.imagenes'],
      order: { fechaCreacion: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Trabajo> {
    const trabajo = await this.trabajoRepository.findOne({
      where: { id },
      relations: ['tecnicoAsignado', 'permisos', 'permisos.tecnico', 'permisos.supervisor', 'permisos.tipoPermiso', 'permisos.imagenes'],
    });

    if (!trabajo) {
      throw new NotFoundException(`Trabajo con ID ${id} no encontrado`);
    }

    return trabajo;
  }

  async findByTecnico(tecnicoId: string): Promise<Trabajo[]> {
    return this.trabajoRepository.find({
      where: { tecnicoAsignadoId: tecnicoId },
      relations: ['tecnicoAsignado', 'permisos', 'permisos.tecnico', 'permisos.supervisor', 'permisos.tipoPermiso', 'permisos.imagenes'],
      order: { fechaCreacion: 'DESC' },
    });
  }

  async update(id: string, updateTrabajoDto: UpdateTrabajoDto): Promise<Trabajo> {
    const trabajo = await this.findOne(id);

    // Verificar que el técnico existe si se proporciona
    if (updateTrabajoDto.tecnicoAsignadoId) {
      await this.usersService.findOne(updateTrabajoDto.tecnicoAsignadoId);
    }

    // Si se cambia el estado a terminado, establecer fecha de ejecución
    if (updateTrabajoDto.estado === EstadoTrabajo.TERMINADO && !updateTrabajoDto.fechaEjecutada) {
      updateTrabajoDto.fechaEjecutada = new Date().toISOString();
    }

    Object.assign(trabajo, updateTrabajoDto);
    await this.trabajoRepository.save(trabajo);

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const trabajo = await this.findOne(id);
    await this.trabajoRepository.remove(trabajo);
  }

  async asignarTecnico(trabajoId: string, tecnicoId: string): Promise<Trabajo> {
    const trabajo = await this.findOne(trabajoId);
    await this.usersService.findOne(tecnicoId);

    trabajo.tecnicoAsignadoId = tecnicoId;
    trabajo.estado = EstadoTrabajo.EN_PROCESO;
    
    await this.trabajoRepository.save(trabajo);
    return this.findOne(trabajoId);
  }

  async iniciarTrabajo(trabajoId: string, tecnicoId: string): Promise<Trabajo> {
    const trabajo = await this.findOne(trabajoId);
    
    if (trabajo.tecnicoAsignadoId !== tecnicoId) {
      throw new BadRequestException('Solo el técnico asignado puede iniciar el trabajo');
    }

    if (trabajo.estado !== EstadoTrabajo.PENDIENTE) {
      throw new BadRequestException('El trabajo ya ha sido iniciado');
    }

    trabajo.estado = EstadoTrabajo.EN_PROCESO;
    await this.trabajoRepository.save(trabajo);

    return this.findOne(trabajoId);
  }

  private async createDefaultPermisos(trabajoId: string): Promise<void> {
    const tiposPermiso = await this.tiposPermisoService.findAll();
    
    for (const tipoPermiso of tiposPermiso) {
      const permiso = this.permisoRepository.create({
        tipoPermisoId: tipoPermiso.id,
        trabajoId,
        estado: EstadoPermiso.PENDIENTE,
      });
      await this.permisoRepository.save(permiso);
    }
  }
}