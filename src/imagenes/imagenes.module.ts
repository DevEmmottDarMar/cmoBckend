import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagenesService } from './imagenes.service';
import { ImagenesController } from './imagenes.controller';
import { Imagen } from '../entities/imagen.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Imagen])],
  controllers: [ImagenesController],
  providers: [ImagenesService],
  exports: [ImagenesService],
})
export class ImagenesModule {}