import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Mesa } from '../../mesas/entities/mesa.entity';

export enum TurnoAsignacion {
  MANANA = 'Mañana',
  TARDE = 'Tarde',
  COMPLETO = 'Completo',
}

@Entity('asignacion_mesas')
@Unique(['mesa', 'fecha', 'turno'])
export class AsignacionMesa {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_usuario' })
  idUsuario: string;

  @Column({ name: 'id_mesa' })
  idMesa: string;

  @Column({ type: 'date' })
  fecha: string;

  @Column({
    type: 'enum',
    enum: TurnoAsignacion,
    default: TurnoAsignacion.COMPLETO,
  })
  turno: TurnoAsignacion;

  @ManyToOne(() => Usuario, (usuario) => usuario.asignacionesMesas)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @ManyToOne(() => Mesa, (mesa) => mesa.asignacionesMesas)
  @JoinColumn({ name: 'id_mesa' })
  mesa: Mesa;
}
