import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Sala } from '../../salas/entities/sala.entity';
import { Cita } from '../../citas/entities/cita.entity';
import { AsignacionMesa } from '../../asignacion-mesas/entities/asignacion-mesa.entity';

@Entity({ name: 'mesas' })
export class Mesa {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { name: 'nombre_mesa', length: 50 })
  nombreMesa: string;

  @Column('float', { name: 'pos_x', default: 0 })
  posX: number;

  @Column('float', { name: 'pos_y', default: 0 })
  posY: number;

  @Column('float', { default: 0 })
  rotacion: number;

  @Column('float', { default: 60 })
  ancho: number;

  @Column('float', { default: 60 })
  largo: number;

  @Column('varchar', { length: 20, default: 'Libre' })
  estado: string;

  @ManyToOne(() => Sala, (sala) => sala.mesas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_sala' })
  sala: Sala;

  @Column({ name: 'id_sala' })
  idSala: string;

  @OneToMany(() => Cita, (cita) => cita.mesa)
  citas: Cita[];

  @OneToMany(() => AsignacionMesa, (asignacion) => asignacion.mesa)
  asignacionesMesas: AsignacionMesa[];
}
