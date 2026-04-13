import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Cita } from '../../citas/entities/cita.entity';
import { Entidad } from '../../entidades/entities/entidad.entity';

@Entity({ name: 'tramites' })
export class Tramite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { name: 'nombre_tramite', length: 150 })
  nombreTramite: string;

  @Column('text', { nullable: true })
  descripcion: string;

  @ManyToOne(() => Entidad, (entidad) => entidad.tramites)
  @JoinColumn({ name: 'id_entidad' })
  entidad: Entidad;

  @Column({ name: 'id_entidad' })
  idEntidad: string;

  @OneToMany(() => Cita, (cita) => cita.tramite)
  citas: Cita[];
}
