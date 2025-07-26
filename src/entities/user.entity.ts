import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Role } from './role.entity';

@Entity('users')
export class User {
  @ApiProperty({ description: 'ID único del usuario (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Email del usuario', example: 'usuario@ejemplo.com' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: 'Nombre del usuario', example: 'Juan Pérez' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Teléfono del usuario', example: '+1234567890', required: false })
  @Column({ nullable: true })
  phone?: string;

  @Exclude()
  @Column()
  password: string;

  @ApiProperty({ description: 'Rol del usuario', type: () => Role, required: false })
  @ManyToOne(() => Role, role => role.users, { nullable: true })
  @JoinColumn({ name: 'roleId' })
  role?: Role;

  @Column({ nullable: true })
  roleId?: string;

  @ApiProperty({ description: 'Fecha de creación' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  @UpdateDateColumn()
  updatedAt: Date;
}