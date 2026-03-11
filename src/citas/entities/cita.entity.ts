import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Mesa } from '../../mesas/entities/mesa.entity';
import { Tramite } from '../../tramites/entities/tramite.entity';

export enum EstadoCita {
  PENDIENTE = 'Pendiente',
  REALIZADA = 'Realizada',
  NO_PRESENTADO_TRABAJADOR = 'No presentado trabajador',
  NO_ASISTIDO_CLIENTE = 'No asistido cliente',
  CANCELADA = 'Cancelada',
}

@Entity('citas')
export class Cita {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'cliente_nombre', length: 100 })
  clienteNombre: string;

  @Column({ name: 'cliente_apellidos', length: 150 })
  clienteApellidos: string;

  @Column({ name: 'cliente_dni', length: 20 })
  clienteDni: string;

  @Column({ name: 'cliente_email', length: 150, nullable: true })
  clienteEmail: string;

  @Column({ name: 'cliente_telefono', length: 20, nullable: true })
  clienteTelefono: string;

  @Column({ name: 'id_usuario_asignado' })
  idUsuarioAsignado: number;

  @Column({ name: 'id_mesa' })
  idMesa: number;

  @Column({ name: 'id_tramite' })
  idTramite: number;

  @Column({ name: 'fecha_hora', type: 'datetime' })
  fechaHora: Date;

  @Column({
    type: 'enum',
    enum: EstadoCita,
    default: EstadoCita.PENDIENTE,
  })
  estado: EstadoCita;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.citas)
  @JoinColumn({ name: 'id_usuario_asignado' })
  usuarioAsignado: Usuario;

  @ManyToOne(() => Mesa, (mesa) => mesa.citas)
  @JoinColumn({ name: 'id_mesa' })
  mesa: Mesa;

  @ManyToOne(() => Tramite, (tramite) => tramite.citas)
  @JoinColumn({ name: 'id_tramite' })
  tramite: Tramite;
}
