import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

@Entity('roles')
export class Role {
  @ApiProperty({ description: 'ID único del rol (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Nombre del rol', example: 'Administrador' })
  @Column({ unique: true })
  name: string;

  @ApiProperty({ description: 'Descripción del rol', example: 'Rol con permisos completos del sistema' })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ description: 'Usuarios asociados a este rol', type: () => [User] })
  @OneToMany(() => User, user => user.role)
  users: User[];

  @ApiProperty({ description: 'Fecha de creación' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  @UpdateDateColumn()
  updatedAt: Date;
}
