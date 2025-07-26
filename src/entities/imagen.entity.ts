import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Permiso } from './permiso.entity';
import { User } from './user.entity';

@Entity('imagenes')
export class Imagen {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  nombre: string;

  @Column({ type: 'text' })
  url: string; // Data URL (base64) o URL donde se almacena la imagen

  @Column({ length: 100, nullable: true })
  mimeType: string; // image/jpeg, image/png, etc.

  @Column({ type: 'bigint', nullable: true })
  tamaño: number; // Tamaño en bytes

  @Column({ length: 255, nullable: true })
  descripcion: string;

  @Column()
  permisoId: string;

  @Column()
  uploadedBy: string; // ID del usuario que subió la imagen

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Permiso, {
    onDelete: 'CASCADE',
    lazy: true,
  })
  @JoinColumn({ name: 'permisoId' })
  permiso: Promise<Permiso>;

  @ManyToOne(() => User, {
    onDelete: 'SET NULL',
    lazy: true,
  })
  @JoinColumn({ name: 'uploadedBy' })
  usuario: Promise<User>;
}
