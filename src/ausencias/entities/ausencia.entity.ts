import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';

export enum TipoAusencia {
  VACACIONES = 'Vacaciones',
  BAJA_MEDICA = 'Baja Medica',
  ASUNTOS_PROPIOS = 'Asuntos Propios',
}

export enum EstadoAusencia {
  PENDIENTE = 'Pendiente',
  APROBADA = 'Aprobada',
  RECHAZADA = 'Rechazada',
}

@Entity('ausencias')
export class Ausencia {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_usuario' })
  idUsuario: string;

  @Column({ name: 'fecha_solicitud', type: 'date' })
  fechaSolicitud: string;

  @Column({ name: 'fecha_inicio', type: 'date' })
  fechaInicio: string;

  @Column({ name: 'fecha_fin', type: 'date' })
  fechaFin: string;

  @Column({ type: 'enum', enum: TipoAusencia })
  tipo: TipoAusencia;

  @Column({
    type: 'enum',
    enum: EstadoAusencia,
    default: EstadoAusencia.PENDIENTE,
  })
  estado: EstadoAusencia;

  @ManyToOne(() => Usuario, (usuario) => usuario.ausencias, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;
}
