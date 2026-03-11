import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Rol } from '../../roles/entities/rol.entity';
import { Ausencia } from '../../ausencias/entities/ausencia.entity';
import { Cita } from '../../citas/entities/cita.entity';
import { AsignacionMesa } from '../../asignacion-mesas/entities/asignacion-mesa.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_rol' })
  idRol: string;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 150 })
  apellidos: string;

  @Column({ length: 150, unique: true })
  email: string;

  @Column({ name: 'password_hash', length: 255 })
  passwordHash: string;

  @Column({ name: 'foto_url', length: 255, nullable: true })
  fotoUrl: string;

  @ManyToOne(() => Rol, (rol) => rol.usuarios)
  @JoinColumn({ name: 'id_rol' })
  rol: Rol;

  @OneToMany(() => Ausencia, (ausencia) => ausencia.usuario)
  ausencias: Ausencia[];

  @OneToMany(() => Cita, (cita) => cita.usuarioAsignado)
  citas: Cita[];

  @OneToMany(() => AsignacionMesa, (asignacion) => asignacion.usuario)
  asignacionesMesas: AsignacionMesa[];
}
