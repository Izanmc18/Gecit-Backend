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

@Entity('mesas')
export class Mesa {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_sala' })
  idSala: string;

  @Column({ name: 'nombre_mesa', length: 50 })
  nombreMesa: string;

  @ManyToOne(() => Sala, (sala) => sala.mesas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_sala' })
  sala: Sala;

  @OneToMany(() => Cita, (cita) => cita.mesa)
  citas: Cita[];

  @OneToMany(() => AsignacionMesa, (asignacion) => asignacion.mesa)
  asignacionesMesas: AsignacionMesa[];
}
