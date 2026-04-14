import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Entidad } from '../../entidades/entities/entidad.entity';

@Entity('festivos')
export class Festivo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_entidad' })
  idEntidad: string;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ length: 150, nullable: true })
  descripcion: string;

  @ManyToOne(() => Entidad, (entidad) => entidad.festivos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_entidad' })
  entidad: Entidad;
}
