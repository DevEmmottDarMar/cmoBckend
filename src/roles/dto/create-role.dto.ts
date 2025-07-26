import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ 
    description: 'Nombre del rol', 
    example: 'Administrador',
    maxLength: 100 
  })
  @IsNotEmpty({ message: 'El nombre del rol es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  name: string;

  @ApiProperty({ 
    description: 'Descripción del rol', 
    example: 'Rol con permisos completos del sistema' 
  })
  @IsNotEmpty({ message: 'La descripción del rol es obligatoria' })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  description: string;
}
