import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Entidad } from '../../entidades/entities/entidad.entity';
import { Cita } from '../../citas/entities/cita.entity';

export enum EstadoTurno {
  EN_ESPERA = 'En espera',
  LLAMADO = 'Llamado',
  ATENDIDO = 'Atendido',
  DESCARTADO = 'Descartado',
}

@Entity({ name: 'turnos_llegada' })
export class TurnoLlegada {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_entidad' })
  idEntidad: string;

  @Column({ name: 'id_cita', nullable: true })
  idCita: string;

  @Column('varchar', { name: 'codigo_ticket', length: 20 })
  codigoTicket: string;

  @Column({
    type: 'enum',
    enum: EstadoTurno,
    default: EstadoTurno.EN_ESPERA,
  })
  estado: EstadoTurno;

  @CreateDateColumn({ name: 'fecha_generacion' })
  fechaGeneracion: Date;

  @Column({ name: 'fecha_llamada', type: 'datetime', nullable: true })
  fechaLlamada: Date;

  @ManyToOne(() => Entidad, (entidad) => entidad.turnosLlegada, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_entidad' })
  entidad: Entidad;

  @OneToOne(() => Cita, (cita) => cita.turnoLlegada, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_cita' })
  cita: Cita;
}
