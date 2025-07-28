import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsUrl,
} from 'class-validator';
import { EstadoPermiso } from '../../entities/permiso.entity';

export class CreatePermisoDto {
  @ApiProperty({
    description: 'ID del tipo de permiso solicitado',
    example: 'cfd2c317-70c9-4c1f-9a2a-9345e8b17d31',
  })
  @IsUUID()
  @IsNotEmpty()
  tipoPermisoId: string;

  @ApiProperty({
    description: 'ID del trabajo al que pertenece el permiso',
    example: 'cfd2c317-70c9-4c1f-9a2a-9345e8b17d31',
  })
  @IsUUID()
  @IsNotEmpty()
  trabajoId: string;

  @ApiProperty({
    description: 'Descripción o comentario del permiso',
    required: false,
    example: 'Solicitud de permiso para trabajos en altura en poste de 15 metros',
  })
  @IsOptional()
  @IsString()
  descripcion?: string;



  @ApiProperty({
    description: 'ID del técnico que solicita el permiso',
    required: false,
    example: 'cfd2c317-70c9-4c1f-9a2a-9345e8b17d31',
  })
  @IsOptional()
  @IsUUID()
  tecnicoId?: string;
}