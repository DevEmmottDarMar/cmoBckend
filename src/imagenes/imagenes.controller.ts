import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { ImagenesService } from './imagenes.service';
import { CreateImagenDto } from './dto/create-imagen.dto';
import { UpdateImagenDto } from './dto/update-imagen.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../entities/user.entity';
import { multerConfig } from '../config/multer.config';

@ApiTags('Imágenes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('imagenes')
export class ImagenesController {
  constructor(private readonly imagenesService: ImagenesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva imagen' })
  @ApiResponse({ status: 201, description: 'Imagen creada exitosamente' })
  @Roles('admin', 'tecnico', 'supervisor')
  create(@Body() createImagenDto: CreateImagenDto) {
    return this.imagenesService.create(createImagenDto);
  }

  @Post('upload/:permisoId')
  @ApiOperation({ summary: 'Subir imagen para un permiso' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Imagen subida exitosamente' })
  @Roles('tecnico', 'supervisor')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadImage(
    @Param('permisoId') permisoId: string,
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User,
    @Body('descripcion') descripcion?: string,
  ) {
    return this.imagenesService.createFromUpload(
      file,
      permisoId,
      user.id,
      descripcion,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las imágenes' })
  @ApiResponse({
    status: 200,
    description: 'Lista de imágenes obtenida exitosamente',
  })
  @Roles('admin', 'supervisor')
  findAll() {
    return this.imagenesService.findAll();
  }

  @Get('permiso/:permisoId')
  @ApiOperation({ summary: 'Obtener imágenes de un permiso específico' })
  @ApiResponse({
    status: 200,
    description: 'Imágenes del permiso obtenidas exitosamente',
  })
  @Roles('admin', 'tecnico', 'supervisor')
  findByPermiso(@Param('permisoId') permisoId: string) {
    return this.imagenesService.findByPermiso(permisoId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener imagen por ID' })
  @ApiResponse({ status: 200, description: 'Imagen obtenida exitosamente' })
  @Roles('admin', 'tecnico', 'supervisor')
  findOne(@Param('id') id: string) {
    return this.imagenesService.findOne(id);
  }

  @Get(':id/view')
  @ApiOperation({ summary: 'Ver imagen desde la base de datos' })
  @ApiResponse({ status: 200, description: 'Imagen servida exitosamente' })
  @Roles('admin', 'tecnico', 'supervisor')
  async viewImage(@Param('id') id: string, @Res() res: Response) {
    try {
      const imagen = await this.imagenesService.findOne(id);

      // Verificar si la URL es un data URL (base64)
      if (imagen.url.startsWith('data:')) {
        // Extraer el tipo MIME y los datos base64
        const matches = imagen.url.match(/^data:([^;]+);base64,(.+)$/);
        if (matches) {
          const mimeType = matches[1];
          const base64Data = matches[2];
          const buffer = Buffer.from(base64Data, 'base64');

          res.set({
            'Content-Type': mimeType,
            'Content-Length': buffer.length,
            'Cache-Control': 'public, max-age=31536000', // Cache por 1 año
          });

          return res.send(buffer);
        }
      }

      // Si no es un data URL, devolver la URL como está
      return res.json({ url: imagen.url });
    } catch (error) {
      throw new NotFoundException(`Imagen con ID ${id} no encontrada`);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar imagen' })
  @ApiResponse({ status: 200, description: 'Imagen actualizada exitosamente' })
  @Roles('admin', 'supervisor')
  update(@Param('id') id: string, @Body() updateImagenDto: UpdateImagenDto) {
    return this.imagenesService.update(id, updateImagenDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar imagen' })
  @ApiResponse({ status: 200, description: 'Imagen eliminada exitosamente' })
  @Roles('admin', 'supervisor')
  remove(@Param('id') id: string) {
    return this.imagenesService.remove(id);
  }
}
