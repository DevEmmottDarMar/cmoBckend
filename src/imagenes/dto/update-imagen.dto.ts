import { PartialType } from '@nestjs/swagger';
import { CreateImagenDto } from './create-imagen.dto';
import { OmitType } from '@nestjs/swagger';

export class UpdateImagenDto extends PartialType(
  OmitType(CreateImagenDto, ['permisoId', 'uploadedBy'] as const)
) {}