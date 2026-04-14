import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Entidad } from '../../entidades/entities/entidad.entity';

@Entity('horarios')
export class Horario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_entidad' })
  idEntidad: string;

  @Column({ name: 'fecha_inicio', type: 'date' })
  fechaInicio: string;

  @Column({ name: 'fecha_fin', type: 'date' })
  fechaFin: string;

  @Column({ name: 'hora_apertura', type: 'time' })
  horaApertura: string;

  @Column({ name: 'hora_cierre', type: 'time' })
  horaCierre: string;

  @ManyToOne(() => Entidad, (entidad) => entidad.horarios, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_entidad' })
  entidad: Entidad;
}
