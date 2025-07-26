import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoPermiso } from '../entities/tipo-permiso.entity';
import { TiposPermisoService } from './tipos-permiso.service';
import { TiposPermisoController } from './tipos-permiso.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TipoPermiso])],
  controllers: [TiposPermisoController],
  providers: [TiposPermisoService],
  exports: [TiposPermisoService],
})
export class TiposPermisoModule {}