import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Entidad } from '../../entidades/entities/entidad.entity';
import { Mesa } from '../../mesas/entities/mesa.entity';

@Entity({ name: 'salas' })
export class Sala {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { name: 'nombre_sala', length: 100 })
  nombreSala: string;

  @Column('int', { name: 'canvas_width', default: 800 })
  canvasWidth: number;

  @Column('int', { name: 'canvas_height', default: 600 })
  canvasHeight: number;

  @Column('varchar', { name: 'color_fondo', length: 20, default: '#FFFFFF' })
  colorFondo: string;

  @Column('varchar', { name: 'url_plano', length: 255, nullable: true })
  urlPlano: string;

  @ManyToOne(() => Entidad, (entidad) => entidad.salas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_entidad' })
  entidad: Entidad;

  @Column({ name: 'id_entidad' })
  idEntidad: string;

  @OneToMany(() => Mesa, (mesa) => mesa.sala)
  mesas: Mesa[];
}
