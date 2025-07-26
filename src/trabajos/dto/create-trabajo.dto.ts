import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsArray,
  IsUrl,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { EstadoTrabajo } from '../../entities/trabajo.entity';

export class CreateTrabajoDto {
  @ApiProperty({
    description: 'Título del trabajo',
    example: 'Instalación de línea eléctrica en sector norte',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  titulo: string;

  @ApiProperty({
    description: 'Descripción detallada del trabajo',
    example: 'Instalación completa de línea eléctrica de media tensión en el sector norte de la ciudad',
  })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty({
    description: 'Observaciones adicionales del trabajo',
    required: false,
    example: 'Requiere coordinación con el municipio',
  })
  @IsOptional()
  @IsString()
  observacion?: string;

  @ApiProperty({
    description: 'URLs de imágenes relacionadas al trabajo',
    type: [String],
    required: false,
    example: ['https://ejemplo.com/imagen1.jpg', 'https://ejemplo.com/imagen2.jpg'],
  })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  imagenes?: string[];

  @ApiProperty({
    description: 'ID del técnico asignado al trabajo',
    required: false,
    example: 'cfd2c317-70c9-4c1f-9a2a-9345e8b17d31',
  })
  @IsOptional()
  @IsUUID()
  tecnicoAsignadoId?: string;

  @ApiProperty({
    description: 'Estado inicial del trabajo',
    enum: EstadoTrabajo,
    required: false,
    default: EstadoTrabajo.PENDIENTE,
  })
  @IsOptional()
  @IsEnum(EstadoTrabajo)
  estado?: EstadoTrabajo;
}