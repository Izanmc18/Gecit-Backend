import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Mesa } from '../../mesas/entities/mesa.entity';
import { Tramite } from '../../tramites/entities/tramite.entity';
import { Entidad } from '../../entidades/entities/entidad.entity';

@Entity({ name: 'citas' })
export class Cita {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { name: 'cliente_nombre', length: 100 })
  clienteNombre: string;

  @Column('varchar', { name: 'cliente_apellidos', length: 150 })
  clienteApellidos: string;

  @Column('varchar', { name: 'cliente_dni', length: 20 })
  clienteDni: string;

  @Column('varchar', { name: 'cliente_email', length: 150, nullable: true })
  clienteEmail: string;

  @Column('varchar', { name: 'cliente_telefono', length: 20, nullable: true })
  clienteTelefono: string;

  @Column('datetime', { name: 'fecha_hora' })
  fechaHora: Date;

  @Column('enum', {
    enum: ['Pendiente', 'Realizada', 'No presentado', 'Cancelada'],
    default: 'Pendiente',
  })
  estado: string;

  @Column('text', { nullable: true })
  observaciones: string;

  @ManyToOne(() => Entidad, (entidad) => entidad.citas)
  @JoinColumn({ name: 'id_entidad' })
  entidad: Entidad;

  @Column({ name: 'id_entidad' })
  idEntidad: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.citasComoCliente, {
    nullable: true,
  })
  @JoinColumn({ name: 'id_cliente' })
  cliente: Usuario;

  @Column({ name: 'id_cliente', nullable: true })
  idCliente: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.citasAsignadas)
  @JoinColumn({ name: 'id_usuario_asignado' })
  usuarioAsignado: Usuario;

  @Column({ name: 'id_usuario_asignado' })
  idUsuarioAsignado: string;

  @ManyToOne(() => Mesa)
  @JoinColumn({ name: 'id_mesa' })
  mesa: Mesa;

  @Column({ name: 'id_mesa' })
  idMesa: string;

  @ManyToOne(() => Tramite)
  @JoinColumn({ name: 'id_tramite' })
  tramite: Tramite;

  @Column({ name: 'id_tramite' })
  idTramite: string;
}
