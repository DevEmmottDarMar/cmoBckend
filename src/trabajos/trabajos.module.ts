import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrabajosService } from './trabajos.service';
import { TrabajosController } from './trabajos.controller';
import { Trabajo } from '../entities/trabajo.entity';
import { Permiso } from '../entities/permiso.entity';
import { TipoPermiso } from '../entities/tipo-permiso.entity';
import { User } from '../entities/user.entity';
import { UsersModule } from '../users/users.module';
import { TiposPermisoModule } from '../tipos-permiso/tipos-permiso.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Trabajo, Permiso, TipoPermiso, User]),
    UsersModule,
    TiposPermisoModule,
  ],
  controllers: [TrabajosController],
  providers: [TrabajosService],
  exports: [TrabajosService],
})
export class TrabajosModule {}