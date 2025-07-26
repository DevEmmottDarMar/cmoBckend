import { PartialType } from '@nestjs/swagger';
import { CreateTrabajoDto } from './create-trabajo.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsDateString } from 'class-validator';

export class UpdateTrabajoDto extends PartialType(CreateTrabajoDto) {
  @ApiProperty({
    description: 'Fecha de ejecución del trabajo',
    required: false,
    example: '2024-07-25T10:30:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  fechaEjecutada?: string;
}