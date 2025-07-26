import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsUUID,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { EstadoPermiso } from '../../entities/permiso.entity';

export class UpdatePermisoDto {
  @ApiProperty({
    description: 'Estado del permiso',
    enum: EstadoPermiso,
    required: false,
    example: EstadoPermiso.APROBADO,
  })
  @IsOptional()
  @IsEnum(EstadoPermiso)
  estado?: EstadoPermiso;

  @ApiProperty({
    description: 'Descripción o comentario del permiso',
    required: false,
    example: 'Permiso actualizado con nuevas especificaciones',
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({
    description: 'Comentario del supervisor',
    required: false,
    example: 'Aprobado. Verificar uso de EPP completo',
  })
  @IsOptional()
  @IsString()
  comentarioSupervisor?: string;

  @ApiProperty({
    description: 'Fecha de respuesta del supervisor',
    required: false,
    example: '2024-07-25T10:30:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  fechaRespuesta?: string;

  @ApiProperty({
    description: 'ID del supervisor que responde',
    required: false,
    example: 'cfd2c317-70c9-4c1f-9a2a-9345e8b17d31',
  })
  @IsOptional()
  @IsUUID()
  supervisorId?: string;
}