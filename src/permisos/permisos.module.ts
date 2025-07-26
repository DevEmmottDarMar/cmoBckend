import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { PermisosService } from './permisos.service';
import { PermisosController } from './permisos.controller';
import { Permiso } from '../entities/permiso.entity';
import { Trabajo } from '../entities/trabajo.entity';
import { User } from '../entities/user.entity';
import { UsersModule } from '../users/users.module';
import { TiposPermisoModule } from '../tipos-permiso/tipos-permiso.module';
import { ImagenesModule } from '../imagenes/imagenes.module';
import { multerConfig } from '../config/multer.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permiso, Trabajo, User]),
    MulterModule.register(multerConfig),
    UsersModule,
    TiposPermisoModule,
    ImagenesModule,
  ],
  controllers: [PermisosController],
  providers: [PermisosService],
  exports: [PermisosService],
})
export class PermisosModule {}