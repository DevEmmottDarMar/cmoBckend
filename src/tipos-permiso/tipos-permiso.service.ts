import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoPermiso } from '../entities/tipo-permiso.entity';

@Injectable()
export class TiposPermisoService implements OnModuleInit {
  constructor(
    @InjectRepository(TipoPermiso)
    private readonly tipoPermisoRepository: Repository<TipoPermiso>,
  ) {}

  async onModuleInit() {
    await this.createDefaultTiposPermiso();
  }

  private async createDefaultTiposPermiso() {
    const tiposExistentes = await this.tipoPermisoRepository.count();
    
    if (tiposExistentes === 0) {
      const tiposDefault = [
        {
          nombre: 'altura',
          descripcion: 'Permiso para trabajos en altura',
          orden: 1,
        },
        {
          nombre: 'enganche',
          descripcion: 'Permiso para trabajos de enganche',
          orden: 2,
        },
        {
          nombre: 'cierre',
          descripcion: 'Permiso para trabajos de cierre',
          orden: 3,
        },
      ];

      await this.tipoPermisoRepository.save(tiposDefault);
      console.log('✅ Tipos de permiso por defecto creados');
    }
  }

  async findAll(): Promise<TipoPermiso[]> {
    return this.tipoPermisoRepository.find({
      where: { activo: true },
      order: { orden: 'ASC' },
    });
  }

  async findByNombre(nombre: string): Promise<TipoPermiso | null> {
    return this.tipoPermisoRepository.findOne({
      where: { nombre, activo: true },
    });
  }

  async findOne(id: string): Promise<TipoPermiso | null> {
    return this.tipoPermisoRepository.findOne({
      where: { id, activo: true },
    });
  }

  async findById(id: string): Promise<TipoPermiso | null> {
    return this.tipoPermisoRepository.findOne({
      where: { id, activo: true },
    });
  }

  async getNextTipoPermiso(currentTipoId: string): Promise<TipoPermiso | null> {
    const currentTipo = await this.findById(currentTipoId);
    if (!currentTipo) return null;

    return this.tipoPermisoRepository.findOne({
      where: { 
        orden: currentTipo.orden + 1,
        activo: true 
      },
    });
  }

  async isLastTipoPermiso(tipoId: string): Promise<boolean> {
    const tipo = await this.findById(tipoId);
    if (!tipo) return false;

    const maxOrden = await this.tipoPermisoRepository
      .createQueryBuilder('tipo')
      .select('MAX(tipo.orden)', 'maxOrden')
      .where('tipo.activo = :activo', { activo: true })
      .getRawOne();

    return tipo.orden === maxOrden.maxOrden;
  }
}