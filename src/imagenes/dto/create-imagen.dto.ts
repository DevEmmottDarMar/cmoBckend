import { IsString, IsOptional, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateImagenDto {
  @ApiProperty({ description: 'Nombre del archivo de imagen' })
  @IsString()
  nombre: string;

  @ApiProperty({ description: 'URL o path donde se almacena la imagen' })
  @IsString()
  url: string;

  @ApiProperty({ description: 'Tipo MIME de la imagen', required: false })
  @IsOptional()
  @IsString()
  mimeType?: string;

  @ApiProperty({ description: 'Tamaño del archivo en bytes', required: false })
  @IsOptional()
  @IsNumber()
  tamaño?: number;

  @ApiProperty({ description: 'Descripción de la imagen', required: false })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ description: 'ID del permiso al que pertenece la imagen' })
  @IsUUID()
  permisoId: string;

  @ApiProperty({ description: 'ID del usuario que subió la imagen' })
  @IsUUID()
  uploadedBy: string;
}