import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Permiso } from './permiso.entity';

@Entity('tipos_permiso')
export class TipoPermiso {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  nombre: string;

  @Column({ length: 255, nullable: true })
  descripcion: string;

  @Column({ type: 'int', default: 1 })
  orden: number; // Para definir el orden secuencial (altura=1, enganche=2, cierre=3)

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Permiso, (permiso) => permiso.tipoPermiso)
  permisos: Permiso[];
}