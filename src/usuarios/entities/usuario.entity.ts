import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Rol } from '../../roles/entities/rol.entity';
import { Entidad } from '../../entidades/entities/entidad.entity';
import { Ausencia } from '../../ausencias/entities/ausencia.entity';
import { Cita } from '../../citas/entities/cita.entity';

@Entity({ name: 'usuarios' })
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 100 })
  nombre: string;

  @Column('varchar', { length: 150 })
  apellidos: string;

  @Column('varchar', { length: 20, unique: true, nullable: true })
  dni: string;

  @Column('varchar', { length: 20, nullable: true })
  telefono: string;

  @Column('varchar', { length: 150, unique: true })
  email: string;

  @Column('varchar', { name: 'password_hash', length: 255 })
  passwordHash: string;

  @Column('varchar', { name: 'foto_url', length: 255, nullable: true })
  fotoUrl: string;

  @Column('boolean', { default: true })
  activo: boolean;

  @ManyToOne(() => Entidad, (entidad) => entidad.usuarios, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_entidad' })
  entidad: Entidad;

  @Column({ name: 'id_entidad', nullable: true })
  idEntidad: string;

  @ManyToOne(() => Rol, (rol) => rol.usuarios, { eager: true })
  @JoinColumn({ name: 'id_rol' })
  rol: Rol;

  @Column({ name: 'id_rol' })
  idRol: string;

  @OneToMany(() => Ausencia, (ausencia) => ausencia.usuario)
  ausencias: Ausencia[];

  @OneToMany(() => Cita, (cita) => cita.usuarioAsignado)
  citasAsignadas: Cita[];

  @OneToMany(() => Cita, (cita) => cita.cliente)
  citasComoCliente: Cita[];
}
