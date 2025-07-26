import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Imagen } from '../entities/imagen.entity';
import { CreateImagenDto } from './dto/create-imagen.dto';
import { UpdateImagenDto } from './dto/update-imagen.dto';

@Injectable()
export class ImagenesService {
  constructor(
    @InjectRepository(Imagen)
    private readonly imagenRepository: Repository<Imagen>,
  ) {}

  async create(createImagenDto: CreateImagenDto): Promise<Imagen> {
    console.log('💾 create - Creando imagen en BD con DTO:', createImagenDto);
    console.log('🔍 Verificando permisoId en DTO:', createImagenDto.permisoId);

    const imagen = this.imagenRepository.create(createImagenDto);
    console.log('🏗️ Entidad creada (antes de save):', imagen);
    console.log('🔍 Verificando permisoId en entidad:', imagen.permisoId);

    try {
      const imagenGuardada = await this.imagenRepository.save(imagen);
      console.log('✅ Imagen guardada exitosamente:', imagenGuardada);
      return imagenGuardada;
    } catch (error) {
      console.error('❌ Error al guardar imagen:', error);
      console.error('📊 Datos que causaron el error:', {
        dto: createImagenDto,
        entidad: imagen,
      });
      throw error;
    }
  }

  async findAll(): Promise<Imagen[]> {
    return this.imagenRepository.find({
      relations: ['permiso', 'usuario'],
    });
  }

  async findOne(id: string): Promise<Imagen> {
    const imagen = await this.imagenRepository.findOne({
      where: { id },
      relations: ['permiso', 'usuario'],
    });

    if (!imagen) {
      throw new NotFoundException(`Imagen con ID ${id} no encontrada`);
    }

    return imagen;
  }

  async findByPermiso(permisoId: string): Promise<Imagen[]> {
    return this.imagenRepository.find({
      where: { permisoId },
      relations: ['usuario'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateImagenDto: UpdateImagenDto): Promise<Imagen> {
    const imagen = await this.findOne(id);

    Object.assign(imagen, updateImagenDto);
    return this.imagenRepository.save(imagen);
  }

  async remove(id: string): Promise<void> {
    const imagen = await this.findOne(id);
    await this.imagenRepository.remove(imagen);
  }

  async validateImageFile(file: Express.Multer.File): Promise<void> {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/webp',
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Tipo de archivo no permitido. Solo se permiten: JPEG, PNG, JPG, WEBP',
      );
    }

    if (file.size > maxSize) {
      throw new BadRequestException(
        'El archivo es demasiado grande. Tamaño máximo: 5MB',
      );
    }
  }

  async createFromUpload(
    file: Express.Multer.File,
    permisoId: string,
    uploadedBy: string,
    descripcion?: string,
  ): Promise<Imagen> {
    console.log('🖼️ createFromUpload - Iniciando creación de imagen en BD');
    console.log('📁 Archivo recibido:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      buffer: file.buffer ? `${file.buffer.length} bytes` : 'No buffer',
    });
    console.log('🔗 Datos adicionales:', {
      permisoId,
      uploadedBy,
      descripcion,
    });

    await this.validateImageFile(file);

    // Convertir el buffer a base64 para almacenar en BD
    const base64Data = file.buffer.toString('base64');
    const dataUrl = `data:${file.mimetype};base64,${base64Data}`;

    const createImagenDto: CreateImagenDto = {
      nombre: file.originalname,
      url: dataUrl, // Guardar como data URL en BD
      mimeType: file.mimetype,
      tamaño: file.size,
      descripcion,
      permisoId,
      uploadedBy,
    };

    console.log('📝 DTO creado:', {
      ...createImagenDto,
      url: `${createImagenDto.url.substring(0, 50)}...`, // Mostrar solo los primeros 50 caracteres
    });

    const imagenCreada = await this.create(createImagenDto);
    console.log('✅ Imagen guardada en BD:', {
      id: imagenCreada.id,
      nombre: imagenCreada.nombre,
      tamaño: imagenCreada.tamaño,
      mimeType: imagenCreada.mimeType,
    });

    return imagenCreada;
  }
}
