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
import { Trabajo } from './trabajo.entity';
import { User } from './user.entity';
import { TipoPermiso } from './tipo-permiso.entity';
import { Imagen } from './imagen.entity';

export enum EstadoPermiso {
  PENDIENTE = 'pendiente',
  APROBADO = 'aprobado',
  RECHAZADO = 'rechazado',
}

@Entity('permisos')
export class Permiso {
  @ApiProperty({ description: 'ID único del permiso (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Tipo de permiso', type: () => TipoPermiso })
  @ManyToOne(() => TipoPermiso, (tipoPermiso) => tipoPermiso.permisos)
  @JoinColumn({ name: 'tipoPermisoId' })
  tipoPermiso: TipoPermiso;

  @Column()
  tipoPermisoId: string;

  @ApiProperty({ description: 'Estado del permiso', enum: EstadoPermiso })
  @Column({
    type: 'enum',
    enum: EstadoPermiso,
    default: EstadoPermiso.PENDIENTE,
  })
  estado: EstadoPermiso;

  @ApiProperty({ description: 'Descripción o comentario del permiso', required: false })
  @Column('text', { nullable: true })
  descripcion?: string;

  @ApiProperty({ description: 'URL de la imagen enviada por el técnico', required: false })
  @Column({ nullable: true })
  imagenTecnico?: string;

  @ApiProperty({ description: 'Comentario del supervisor', required: false })
  @Column('text', { nullable: true })
  comentarioSupervisor?: string;

  @ApiProperty({ description: 'Fecha de solicitud del permiso' })
  @CreateDateColumn()
  fechaSolicitud: Date;

  @ApiProperty({ description: 'Fecha de respuesta del supervisor', required: false })
  @Column({ type: 'timestamp', nullable: true })
  fechaRespuesta?: Date;

  @ApiProperty({ description: 'Trabajo al que pertenece el permiso', type: () => Trabajo })
  @ManyToOne(() => Trabajo, (trabajo) => trabajo.permisos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trabajoId' })
  trabajo: Trabajo;

  @Column()
  trabajoId: string;

  @ApiProperty({ description: 'Técnico que solicita el permiso', type: () => User })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'tecnicoId' })
  tecnico?: User;

  @Column({ nullable: true })
  tecnicoId?: string;

  @ApiProperty({ description: 'Supervisor que responde al permiso', type: () => User, required: false })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'supervisorId' })
  supervisor?: User;

  @Column({ nullable: true })
  supervisorId?: string;

  // Relación con imágenes manejada manualmente para evitar conflictos de sincronización
  // @OneToMany(() => Imagen, (imagen) => imagen.permiso)
  // imagenes: Imagen[];

  @ApiProperty({ description: 'Fecha de última actualización' })
  @UpdateDateColumn()
  updatedAt: Date;
}