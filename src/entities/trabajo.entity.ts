import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { Permiso } from './permiso.entity';

export enum EstadoTrabajo {
  PENDIENTE = 'pendiente',
  EN_PROCESO = 'en_proceso',
  TERMINADO = 'terminado',
}

@Entity('trabajos')
export class Trabajo {
  @ApiProperty({ description: 'ID único del trabajo (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Título del trabajo', example: 'Instalación de línea eléctrica' })
  @Column()
  titulo: string;

  @ApiProperty({ description: 'Descripción detallada del trabajo' })
  @Column('text')
  descripcion: string;

  @ApiProperty({ description: 'Fecha de creación del trabajo' })
  @CreateDateColumn()
  fechaCreacion: Date;

  @ApiProperty({ description: 'Fecha de ejecución del trabajo', required: false })
  @Column({ type: 'timestamp', nullable: true })
  fechaEjecutada?: Date;

  @ApiProperty({ description: 'Observaciones del trabajo', required: false })
  @Column('text', { nullable: true })
  observacion?: string;

  @ApiProperty({ description: 'URLs de imágenes del trabajo', type: [String], required: false })
  @Column('simple-array', { nullable: true })
  imagenes?: string[];

  @ApiProperty({ description: 'Estado del trabajo', enum: EstadoTrabajo })
  @Column({
    type: 'enum',
    enum: EstadoTrabajo,
    default: EstadoTrabajo.PENDIENTE,
  })
  estado: EstadoTrabajo;

  @ApiProperty({ description: 'Técnico asignado al trabajo', type: () => User })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'tecnicoAsignadoId' })
  tecnicoAsignado?: User;

  @Column({ nullable: true })
  tecnicoAsignadoId?: string;

  @ApiProperty({ description: 'Permisos asociados al trabajo', type: () => [Permiso] })
  @OneToMany(() => Permiso, (permiso) => permiso.trabajo, { cascade: true })
  permisos: Permiso[];

  @ApiProperty({ description: 'Fecha de última actualización' })
  @UpdateDateColumn()
  updatedAt: Date;
}