import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Oficina } from '../../oficinas/entities/oficina.entity';

@Entity('horarios')
export class Horario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_oficina' })
  idOficina: string;

  @Column({ name: 'fecha_inicio', type: 'date' })
  fechaInicio: string;

  @Column({ name: 'fecha_fin', type: 'date' })
  fechaFin: string;

  @Column({ name: 'hora_apertura', type: 'time' })
  horaApertura: string;

  @Column({ name: 'hora_cierre', type: 'time' })
  horaCierre: string;

  @ManyToOne(() => Oficina, (oficina) => oficina.horarios, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_oficina' })
  oficina: Oficina;
}
